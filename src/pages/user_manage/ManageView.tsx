// @ts-nocheck
import React, { useRef, useState } from 'react';
// @material-ui/core components
import { makeStyles } from '@material-ui/core/styles';
import GridContainer from '../../components/base/grid/GridContainer';
import GridItem from '../../components/base/grid/GridItem';
import Card from '../../components/base/app_card/Card';
import CardHeader from '../../components/base/app_card/CardHeader';
import CardBody from '../../components/base/app_card/CardBody';
import AppInput from '../../components/base/app_input/AppInput';
import CardFooter from '../../components/base/app_card/CardFooter';
import AppButton from '../../components/base/app_button/AppButton';
import CardAvatar from '../../components/base/app_card/CardAvatar';
import { Helper, ResponseTime, User, UserType, WorkTime, HealthCenterType } from 'api';
import UsersApi from '../../network/UsersApi';
import AppDropdownMenu from '../../components/base/app_dropdown/AppDropdownMenu';
import HealthCenterPickerDialog from '../../dialogs/health_center_picker/HealthCenterPickerDialog';
import SpecializationPickerDialog
  from '../../dialogs/specialization_picker/SpecializationPickerDialog';
import CurrencyChargeDialog from '../../dialogs/currency_charge/CurrencyChargeDialog';
import NavigationHelper from '../../helpers/NavigationHelper';
import AppTextView from '../../components/base/app_text/AppTextView';
import AppImageView from '../../components/base/app_image/AppImageView';
import SettingView from '../../components/composite/settings_view/SettingsView';
import ResponseTimeCreateDialog
  from '../../dialogs/responsetime_create_dialog/ResponseTimeCreateDialog';
import CreateEditButton
  from '../../components/composite/privilege_managed_buttons/CreateEditButton';
import { store } from '../../index';
import LoadingDialog from '../../dialogs/loading_dialog/LoadingDialog';
import ReserveTimeCreateDialog
  from '../../dialogs/reservetime_create_dialog/ReserveTimeCreateDialog';
import { defaultEmpty, deleteIcon } from '../../assets/images';
import { Checkbox } from '@material-ui/core';
import AppModal from '../../components/base/app_modal/AppModal';
import AppDatePicker from '../../components/base/app_date_picker/AppDatePicker';
import moment from 'jalali-moment';
import { smartDate } from 'javascript-dev-kit';

const styles = {
  cardCategoryWhite: {
    color: 'rgba(255,255,255,.62)',
    margin: '0',
    fontSize: '14px',
    marginTop: '0',
    marginBottom: '0'
  },
  cardTitleWhite: {
    color: '#FFFFFF',
    marginTop: '0px',
    minHeight: 'auto',
    fontWeight: '300',
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    marginBottom: '3px',
    textDecoration: 'none'
  }
};

// @ts-ignore
const useStyles = makeStyles(styles);

interface Props {
  editableItem?: User,
  onSuccess:(user: User)=>void,
}
export default function ManageView (props: Props) {
  const { editableItem, onSuccess } = props;
  const classes = useStyles();
  const fileRef = useRef();

  if (editableItem && editableItem.type === 'DOCTOR') {
    if (!editableItem.settings) {
      editableItem.settings = {};
    }
    if (!editableItem.settings.notifications) {
      editableItem.settings.notifications = {
        newPatient: { sms: false, notification: true },
        workTimeStarted: { sms: false, notification: true },
        workTimeClose: { sms: false, notification: true },
        workTimeEnded: { sms: false, notification: true }
      };
    }
  }

  const [imageUrl, setImageUrl] = useState(editableItem ? editableItem.imageUrl : undefined);
  const [currencyDialogVisible, setCurrencyDialogVisible] = useState(false);
  const [user, setUser] = useState(editableItem || { mobile: '', name: '', type: UserType.PATIENT, gender: '' } as User);
  const [loading, setLoading] = useState(false);

  const create = () => {
    console.log(user);
    UsersApi.createUser(user).then((res) => {
      onSuccess(res.data);
    }).catch((e) => {
      console.log(e);
    });
  };

  const edit = () => {
    // @ts-ignore
    const u : User = { ...user, sms_code: undefined, finalizable_visits: undefined, fcmtoken: undefined };
    if (u.details && u.details.response_days) {
      Object.keys(u.details.response_days).forEach((key) => {
        u.details.response_days[key].forEach((responseTime: ResponseTime) => {
          if (responseTime.healthCenter) {
            responseTime.healthCenter = responseTime.healthCenter._id;
          }
        });
      });
    }
    UsersApi.updateUser(u).then((res) => {
      onSuccess(res.data);
    }).catch((e) => {
      console.log(e);
    });
  };

  const pickFile = () => {
    // @ts-ignore
    fileRef.current.click();
  };

  const filePicked = (event) => {
    event.stopPropagation();
    event.preventDefault();
    const file = event.target.files[0];
    setLoading(true);
    UsersApi.uploadProfileImage(user._id, file).then((res) => {
      setImageUrl(res.data);
    }).catch(console.log)
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div style={{ width: '50vw', height: '100vh' }}>
      <GridContainer>
        <GridItem xs={12} sm={12} md={0}>
          <Card>
            <CardHeader style={{ flexDirection: 'row', justifyContent: 'space-between' }} color="primary">
              <div>
                <h4 className={classes.cardTitleWhite}>Edit Profile</h4>
                <p className={classes.cardCategoryWhite}>Complete your profile</p>
              </div>
              {
                editableItem &&
                <div>
                  <Settings userId={editableItem._id}/>
                </div>
              }
            </CardHeader>
            <CardBody>
              <GridContainer>
                <CardAvatar profile style={{ marginTop: '2rem' }} onClick={editableItem && pickFile}>
                  <input
                    ref={(ref) => {
                    // @ts-ignore
                      fileRef.current = ref;
                    }}
                    type="file"
                    id="file"
                    style={{ display: 'none' }} onChange={filePicked}/>
                  <AppImageView src={imageUrl || defaultEmpty} style={{ width: 150, height: 150 }} fit={'fill'} alt="..." onClick={e => e.preventDefault()}/>
                </CardAvatar>
                <div style={{ alignSelf: 'center', alignItems: 'center', justifyContent: 'center' }}>
                  <h3 className={classes.cardTitle}>{user.name}</h3>
                  <h6 className={classes.cardTitle} style={{ marginTop: 0 }}>{user._id}</h6>
                </div>
                <GridItem md={50}>

                  {
                    editableItem &&
                            <AppTextView style={{ margin: 'auto' }} fontSize={20} text={user.type === UserType.DOCTOR ? 'پزشک' : 'بیمار'}/>
                  }
                  {
                    !editableItem &&
                        <AppDropdownMenu
                          initialValue={user.type}
                          items={[{ text: 'بیمار', value: UserType.PATIENT }, { text: 'دکتر', value: UserType.DOCTOR }]}
                          onClick={(value) => {
                            if (value === UserType.PATIENT) {
                              // @ts-ignore
                              setUser({ ...user, type: UserType.PATIENT, gender: '', code: undefined, specialization: undefined, details: undefined });
                            } else {
                              // @ts-ignore
                              setUser({
                                ...user,
                                type: UserType.DOCTOR,
                                gender: '',
                                code: 0,
                                specialization: null,
                                price: 0,
                                settings: {
                                  notifications: {
                                    newPatient: { notification: true, sms: false },
                                    workTimeClose: { notification: true, sms: false },
                                    workTimeStarted: { notification: true, sms: false },
                                    workTimeEnded: { notification: true, sms: false }
                                  }
                                },
                                details: {
                                  phone: '',
                                  address: '',
                                  videoCallAllowed: true,
                                  bio: '',
                                  displayInList: true,
                                  maxVisitDurationMillisec: 15 * 60 * 1000,
                                  city: '',
                                  shaba: '',
                                  clinics: [],
                                  hospitals: [],
                                  cut: 0,
                                  nezam_pezeshki_code: 0,
                                  response_days: { 0: [], 1: [], 2: [], 3: [], 4: [], 5: [], 6: [] },
                                  reservationInfo: {
                                    enabled: false,
                                    phone: '',
                                    address: '',
                                    cost: '',
                                    gapMinutes: 30,
                                    workTimes: {
                                      saturday: [],
                                      sunday: [],
                                      monday: [],
                                      tuesday: [],
                                      wednesday: [],
                                      thursday: [],
                                      friday: []
                                    }
                                  }
                                }
                              } as User);
                            }
                          }}
                        />
                  }

                </GridItem>

                <Row
                  value={user.name}
                  placeholder="نام"
                  type={'text'}
                  onChange={(text) => { setUser({ ...user, name: text }); }}/>

                <Row
                  value={user.mobile}
                  placeholder="شماره"
                  onChange={(text) => { setUser({ ...user, mobile: text }); }}/>

                <AppDropdownMenu
                  initialValue={user.gender}
                  items={[{ text: 'هیچکدام', value: '' }, { text: 'آقا', value: 'male' }, { text: 'خانم', value: 'female' }]}
                  onClick={(value) => { setUser({ ...user, gender: value }); }}
                />

                {
                  editableItem && user.type === UserType.PATIENT &&
                  <Row
                    value={user.currency}
                    type={'number'}
                    placeholder="موجودی"/>
                }
                {
                  editableItem &&
                  <Row
                    placeholder="آخرین کد اس ام اس"
                    value={user.sms_code || ''}
                    type={'number'}
                  />
                }
                {
                  editableItem &&
                  <Row
                      placeholder="سیستم عامل"
                      value={user.os || 'Unknown'}
                  />
                }
                {
                  user.type === UserType.DOCTOR &&
                      <DoctorView user={user} setUser={setUser}/>
                }
              </GridContainer>
            </CardBody>
            <CardFooter>
              {
                editableItem && user.type === UserType.PATIENT && store.getState().global.admin.privileges.users.patch &&
                <AppButton color="primary" text={'Change Currency'} onClick={() => { setCurrencyDialogVisible(true); }}/>
              }
              <CreateEditButton
                editableItem={editableItem}
                create={create}
                edit={edit}
                permission={privileges => privileges.users}
              />
            </CardFooter>
          </Card>
        </GridItem>
      </GridContainer>
      {
        currencyDialogVisible &&
            <CurrencyChargeDialog userId={user._id} name={user.name || 'Unknown'} onSuccess={() => { setCurrencyDialogVisible(false); }} onClose={() => { setCurrencyDialogVisible(false); }}/>
      }
      {
        loading &&
            <LoadingDialog/>
      }
    </div>
  );
}

const DoctorView = ({ user, setUser }) => {
  const [clinicModalVisible, setClinicModalVisible] = useState(false);
  const [hospitalModalVisible, setHospitalModalVisible] = useState(false);
  const [createResponseTimeDialogVisible, setCreateResponseTimeDialogVisible] = useState(false);
  const [createReserveTimeDialogVisible, setCreateReserveTimeDialogVisible] = useState(false);
  const [specVisible, setSpecVisible] = useState(false);
  console.log('user', user);
  /* if (!user.details.response_days || typeof user.details.response_days === 'string') {
    console.log(user.details)
    user.details.response_days = {};
  } */
  return (
    <div>
      <div>

        <div style={{ width: '100%', marginTop: 20, alignItems: 'center', justifyContent: 'center' }}>
          <AppTextView text={'تنظیمات اعلان ها : '}/>

          <div style={{ width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingLeft: 7, paddingRight: 7 }}>
            <AppTextView text={'بیمار جدید'}/>

              <div style={{ flexDirection: 'row' }}>
                <div style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <AppTextView text={'SMS'}/>
                  <Checkbox checked={user.settings.notifications.newPatient.sms} onChange={(checked) => {
                    const u = { ...user };
                    u.settings.notifications.newPatient.sms = checked.target.checked;
                    setUser(u);
                  }}/>
                </div>
                <div style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <AppTextView text={'Notification'}/>
                  <Checkbox checked={user.settings.notifications.newPatient.notification} onChange={(checked) => {
                    const u = { ...user };
                    u.settings.notifications.newPatient.notification = checked.target.checked;
                    setUser(u);
                  }}/>
                </div>
              </div>

          </div>

          <div style={{ width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingLeft: 7, paddingRight: 7 }}>
            <AppTextView text={'آغاز ساعت کاری : '}/>

            <div style={{ flexDirection: 'row' }}>
              <div style={{ flexDirection: 'row', alignItems: 'center' }}>
                <AppTextView text={'SMS'}/>
                <Checkbox checked={user.settings.notifications.workTimeStarted.sms} onChange={(checked) => {
                  const u = { ...user };
                  u.settings.notifications.workTimeStarted.sms = checked.target.checked;
                  setUser(u);
                }}/>
              </div>
              <div style={{ flexDirection: 'row', alignItems: 'center' }}>
                <AppTextView text={'Notification'}/>
                <Checkbox checked={user.settings.notifications.workTimeStarted.notification} onChange={(checked) => {
                  const u = { ...user };
                  u.settings.notifications.workTimeStarted.notification = checked.target.checked;
                  setUser(u);
                }}/>
              </div>
            </div>

          </div>

          <div style={{ width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingLeft: 7, paddingRight: 7 }}>
            <AppTextView text={'پایان ساعت کاری : '}/>

            <div style={{ flexDirection: 'row' }}>
              <div style={{ flexDirection: 'row', alignItems: 'center' }}>
                <AppTextView text={'SMS'}/>
                <Checkbox checked={user.settings.notifications.workTimeEnded.sms} onChange={(checked) => {
                  const u = { ...user };
                  u.settings.notifications.workTimeEnded.sms = checked.target.checked;
                  setUser(u);
                }}/>
              </div>
              <div style={{ flexDirection: 'row', alignItems: 'center' }}>
                <AppTextView text={'Notification'}/>
                <Checkbox checked={user.settings.notifications.workTimeEnded.notification} onChange={(checked) => {
                  const u = { ...user };
                  u.settings.notifications.workTimeEnded.notification = checked.target.checked;
                  setUser(u);
                }}/>
              </div>
            </div>

          </div>

        </div>

        {
          user.type === UserType.DOCTOR &&
          <div style={{ width: '100%', marginTop: 20, alignItems: 'center', justifyContent: 'center' }}>
            <AppTextView text={'نمایش در لیست : '}/>
            <AppDropdownMenu
              initialValue={user.details.displayInList}
              items={[{ text: 'نمایش در لیست', value: '' }, { text: 'بله', value: true }, { text: 'خیر', value: false }]}
              onClick={(value) => { setUser({ ...user, details: { ...user.details, displayInList: value } }); }}
            />
          </div>
        }

        <Row
          placeholder="کد"
          type={'number'}
          value={user.code}
          onChange={(text) => { setUser({ ...user, code: Number(text) }); }}
        />

        <Row
          placeholder="هزینه ویزیت"
          value={user.price}
          onChange={(text) => { setUser({ ...user, price: Number(text) }); }}
        />

        <Row
          placeholder="سهم پزشک"
          value={user.details.cut}
          type={'number'}
          onChange={(text) => { setUser({ ...user, details: { ...user.details, cut: text } }); }}
        />

        <AppTextView style={{ margin: 'auto', marginTop: 10 }} fontSize={20} text={'قابلیت تماس تصویری'}/>

        <AppDropdownMenu
            initialValue={user.details.videoCallAllowed}
            items={[{ text: 'بله', value: true }, { text: 'خیر', value: false }]}
            onClick={(value) => {
              setUser({ ...user, details: { ...user.details, videoCallAllowed: value } });
            }}
        />

        <Row
            placeholder="بیوگرافی"
            value={user.details.bio}
            onChange={(text) => { setUser({ ...user, details: { ...user.details, bio: text } }); }}
        />

        <Row
            placeholder="تلفن ثابت"
            value={user.details.phone}
            onChange={(text) => { setUser({ ...user, details: { ...user.details, phone: text } }); }}
        />

        <Row
            placeholder="آدرس"
            value={user.details.address}
            onChange={(text) => { setUser({ ...user, details: { ...user.details, address: text } }); }}
        />

        <Row
          placeholder="شهر"
          value={user.details.city}
          onChange={(text) => { setUser({ ...user, details: { ...user.details, city: text } }); }}
        />

        <Row
          placeholder="شماره شبا"
          value={user.details.shaba}
          onChange={(text) => { setUser({ ...user, details: { ...user.details, shaba: text } }); }}
        />

        <Row
          placeholder="نظام پزشکی"
          value={user.details.nezam_pezeshki_code}
          onChange={(text) => { setUser({ ...user, details: { ...user.details, nezam_pezeshki_code: text } }); }}
        />

        <Row
          placeholder="آماده برای پاسخگویی"
          value={user.ready ? 'بله' : 'خیر'}
        />

        <Row
          placeholder="حداکثر مدت زمان ویزیت"
          type={'number'}
          value={String(user.details.maxVisitDurationMillisec / 60 / 1000)}
          onChange={(text) => { setUser({ ...user, details: { ...user.details, maxVisitDurationMillisec: Number(text * 60 * 1000) } }); }}
        />

      </div>

      <AppButton text={user.specialization ? user.specialization.name : 'انتخاب تخصص'} onClick={() => {
        setSpecVisible(true);
      }}/>

      <AppButton text={'بیمارستانها'} onClick={() => {
        setHospitalModalVisible(true);
      }}/>

      {
        user.details.hospitals.map((h) => {
          return (
            <HCRow
              text={h.name}
              onDelete={() => {
                const list = [...user.details.hospitals];
                list.splice(user.details.hospitals.indexOf(h), 1);
                setUser({ ...user, details: { ...user.details, hospitals: list } });
              }}
            />
          );
        })
      }

      <AppButton text={'کلینیکها'} onClick={() => {
        setClinicModalVisible(true);
      }}/>

      {
        user.details.clinics.map((h) => {
          return (
            <HCRow
              text={h.name}
              onDelete={() => {
                const list = [...user.details.clinics];
                list.splice(user.details.clinics.indexOf(h), 1);
                setUser({ ...user, details: { ...user.details, clinics: list } });
              }}
            />
          );
        })
      }
      <AppButton text={'اضافه کردن زمان پاسخگویی'} onClick={() => {
        setCreateResponseTimeDialogVisible(true);
      }}/>
      <div style={{ flexDirection: 'column' }}>
        {
          ['6', '0', '1', '2', '3', '4', '5'].map((day) => {
            return user.details.response_days[day].map((responseTime: ResponseTime) => {
              return <WorkingDayRow
                day={day}
                responseTime={responseTime}
                onDelete={() => {
                  const u: User = { ...user };
                  const arr = u.details.response_days[String(day)];
                  arr.splice(arr.indexOf(responseTime), 1);
                  u.details.response_days[String(day)] = arr;
                  setUser(u);
                }}/>;
            });
          })
        }

      </div>

      <AppDropdownMenu
        items={[{ text: 'رزرو حضوری : فعال', value: true }, { text: 'ویزیت حضوری : غیر فعال', value: false }]}
        initialValue={user.details.reservationInfo ? user.details.reservationInfo.enabled : false}
        onClick={(value: User) => {
          user.details.reservationInfo = user.details.reservationInfo || {
            enabled: false,
            phone: '',
            address: '',
            gapMinutes: 30,
            cost: '',
            coordinates: { lat: 0, lng: 0 },
            workTimes: {
              saturday: [],
              sunday: [],
              monday: [],
              tuesday: [],
              wednesday: [],
              thursday: [],
              friday: []
            }
          };
          setUser({ ...user, details: { ...user.details, reservationInfo: { ...user.details.reservationInfo, enabled: value } } });
        }}
      />
        {
            user.details.reservationInfo && user.details.reservationInfo.enabled &&
                <div style={{ flexDirection: 'column' }}>
                  <AppInput placeholder={'شماره تلفن رزرو'} initialvalue={user.details.reservationInfo.phone} onChange={(text) => {
                    setUser({ ...user, details: { ...user.details, reservationInfo: { ...user.details.reservationInfo, phone: text } } });
                  }}/>
                  <AppInput placeholder={'آدرس رزرو'} initialvalue={user.details.reservationInfo.address} onChange={(text) => {
                    setUser({ ...user, details: { ...user.details, reservationInfo: { ...user.details.reservationInfo, address: text } } });
                  }}/>
                  <AppInput placeholder={'هزینه'} initialvalue={user.details.reservationInfo.cost} onChange={(text) => {
                    setUser({ ...user, details: { ...user.details, reservationInfo: { ...user.details.reservationInfo, cost: text } } });
                  }}/>
                  <AppInput placeholder={'Latitude'} initialvalue={user.details.reservationInfo.coordinates?.lat || 0.0} onChange={(text) => {
                    setUser({ ...user, details: { ...user.details, reservationInfo: { ...user.details.reservationInfo, coordinates: { ...user.details.reservationInfo.coordinates, lat: text || 0 } } } });
                  }}/>
                  <AppInput placeholder={'Longitude'} initialvalue={user.details.reservationInfo.coordinates?.lng || 0.0} onChange={(text) => {
                    setUser({ ...user, details: { ...user.details, reservationInfo: { ...user.details.reservationInfo, coordinates: { ...user.details.reservationInfo.coordinates, lng: text || 0 } } } });
                  }}/>
                  <AppInput type={'number'} placeholder={'مدت زمان ویزیت حضوری'} initialvalue={user.details.reservationInfo.gapMinutes || 30} onChange={(text) => {
                    setUser({ ...user, details: { ...user.details, reservationInfo: { ...user.details.reservationInfo, gapMinutes: Number(text) } } });
                  }}/>
                </div>
        }

      {
        user.details.reservationInfo && user.details.reservationInfo.enabled &&
            <div style={{ flexDirection: 'column' }}>
              <AppButton text={'اضافه کردن ساعت ویزیت حضوری'} onClick={() => {
                setCreateReserveTimeDialogVisible(true);
              }}/>
              <div style={{ flexDirection: 'column' }}>
                {
                  ['saturday', 'sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday'].map((day) => {
                    return user.details.reservationInfo.workTimes[day].map((wt: WorkTime) => {
                      return <ReservationWorkingTimeRow
                          onAddDateExclusion={(date: string) => {
                            wt.exceptions.push(smartDate(moment(`${date.year}/${date.month}/${date.day} 00:00`, 'jYYYY/jMM/jDD HH:mm').format('jYYYY/jMM/jDD')).formatJalali('jYYYY/jMM/jDD'));
                            setUser(Object.assign({}, user));
                          }}
                          onRemoveDateExclusion={(date) => {
                            wt.exceptions.removeValue(date);
                            setUser(Object.assign({}, user));
                          }}
                          day={day}
                          workTime={wt}
                          onDelete={() => {
                            const u: User = { ...user };
                            const arr = u.details.reservationInfo.workTimes[String(day)];
                            arr.splice(arr.indexOf(wt), 1);
                            u.details.reservationInfo.workTimes[String(day)] = arr;
                            setUser(u);
                          }}/>;
                    });
                  })
                }

              </div>
            </div>
      }

      {
        hospitalModalVisible &&
          <HealthCenterPickerDialog
            type={HealthCenterType.HOSPITAL}
            onSelect={(healthCenter) => {
              const u = { ...user };
              if (!u.details.hospitals.find(s => s._id === healthCenter._id)) {
                u.details.hospitals.push(healthCenter);
                setUser(u);
              }
              setHospitalModalVisible(false);
            }}
            onClose={() => {
              setHospitalModalVisible(false);
            }}
          />
      }
      {
        clinicModalVisible &&
          <HealthCenterPickerDialog
            type={HealthCenterType.CLINIC}
            onSelect={(healthCenter) => {
              const u = { ...user };
              if (!u.details.clinics.find(s => s._id === healthCenter._id)) {
                u.details.clinics.push(healthCenter);
                setUser(u);
              }
              setClinicModalVisible(false);
            }}
            onClose={() => {
              setClinicModalVisible(false);
            }}
          />
      }
      {
        specVisible &&
          <SpecializationPickerDialog
            onSelect={(spec) => {
              setSpecVisible(false);
              setUser({ ...user, specialization: spec });
            }}
            onClose={() => {
              setSpecVisible(false);
            }}
          />
      }
        {
            createReserveTimeDialogVisible &&
            <ReserveTimeCreateDialog
              onClose={() => {
                setCreateReserveTimeDialogVisible(false);
              }}
              onCreate={(worktime, day) => {
                setCreateReserveTimeDialogVisible(false);
                const u: User = { ...user };
                console.log(day);
                u.details.reservationInfo.workTimes[String(day)].push(worktime);
                setUser(u);
              }}
            />
        }
      {
        createResponseTimeDialogVisible &&
                <ResponseTimeCreateDialog
                  onClose={() => {
                    setCreateResponseTimeDialogVisible(false);
                  }}
                  onCreate={(responseTime, day) => {
                    setCreateResponseTimeDialogVisible(false);
                    const u: User = { ...user };
                    u.details.response_days[String(day)] = [...u.details.response_days[String(day)], responseTime];
                    setUser(u);
                  }}
                />
      }
    </div>
  );
};

interface ReservationWorkingTimeProps {
  day: string,
  workTime:WorkTime,
  onDelete:()=>void,
  onAddDateExclusion: (date: string)=> void,
  onRemoveDateExclusion: (date: string)=> void
}
const ReservationWorkingTimeRow = (props: ReservationWorkingTimeProps) => {
  const { day, workTime, onDelete, onAddDateExclusion, onRemoveDateExclusion } = props;
  const [modalVisible, setModalVisible] = useState(false);

  return (
      <GridItem style={{ flexDirection: 'column', alignItems: 'center', flex: 5, marginTop: 7, marginBottom: 7 }} md={50}>
        <div style={{ width: '100%', flexDirection: 'row', justifyContent: 'space-evenly' }}>
          <AppTextView
            style={{ flex: 1 }}
            text={day}
          />
          <AppTextView
            style={{ flex: 1 }}
            text={workTime.from}
          />
          <AppTextView
            style={{ flex: 1 }}
            text={workTime.to}
          />

          <AppButton
            text={'Add Exclusion'}
            onClick={() => setModalVisible(true)}
          />

          {
            modalVisible &&
            <AppModal open={modalVisible} onClose={() => setModalVisible(false)}>
              <div style={{ width: '30vw', height: '50vh', alignItems: 'center', justifyContent: 'flex-start' }}>
                <AppDatePicker
                  onChange={(date) => {
                    onAddDateExclusion(date);
                    setModalVisible(false);
                  }}
                  value={Date.now()}
                />
              </div>
            </AppModal>
          }

          <AppButton
            style={{ flex: 1 }}
            text={'حذف'}
            color={'danger'}
            onClick={onDelete}/>
        </div>
        {
          workTime.exceptions.map((exc) => {
            return (
              <div>
                <AppTextView text={`${exc}`}/>
                <AppButton text={'remove'} onClick={() => {
                  onRemoveDateExclusion(exc);
                }}/>
              </div>
            );
          })
        }
      </GridItem>
  );
};
const WorkingDayRow = (props: WorkingDayProps) => {
  const { day, responseTime, onDelete } = props;
  return (
    <GridItem style={{ flexDirection: 'row', alignItems: 'center', flex: 5, marginTop: 7, marginBottom: 7 }} md={50}>
      <AppTextView
        style={{ flex: 1 }}
        text={Helper.dayNumberToString(day)}
      />
      <AppTextView
        style={{ flex: 1 }}
        text={responseTime.from.hour + ':' + responseTime.from.minute + ' از'}
      />
      <AppTextView
        style={{ flex: 1 }}
        text={responseTime.to.hour + ':' + responseTime.to.minute + ' تا'}
      />
      <AppTextView
        style={{ flex: 1 }}
        text={responseTime.healthCenter ? responseTime.healthCenter.name : ''}
      />

      <AppButton
        style={{ flex: 1 }}
        text={'حذف'}
        color={'danger'}
        onClick={onDelete}/>
    </GridItem>
  );
};

const HCRow = ({ text, onDelete }) => {
  return (
    <Card style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 5 }}>
      <AppTextView
        text={text}
      />
      <AppImageView
        style={{ width: 30, height: 30, curosr: 'pointer' }}
        onClick={onDelete}
        src={deleteIcon}/>
    </Card>
  );
};

const Row = ({ value, placeholder, type = 'text', onChange = undefined as any, multiline = false }) => {
  return (
    <GridItem md={50}>
      <AppInput
        placeholder={placeholder}
        initialvalue={value}
        disabled={!onChange}
        onChange={onChange}
        multiline={multiline}
        type={type}
      />
    </GridItem>
  );
};

const Settings = ({ userId }) => {
  return (
    <SettingView
      items={[
        {
          text: 'Financial Audit',
          onClick: () => { NavigationHelper.navigateTo('/user-financial', { id: userId, type: 'user' }); }
        },
        {
          text: 'Visits',
          onClick: () => { NavigationHelper.navigateTo('/user-visits', { userId }); }
        },
        {
          text: 'Reservations',
          onClick: () => { NavigationHelper.navigateTo('/doctor-reservations', { doctorId: userId }); }
        },
        {
          text: 'Logs',
          onClick: () => { NavigationHelper.navigateTo('/user-logs', { userId }); }
        }, {
          text: 'Calls',
          onClick: () => { NavigationHelper.navigateTo('/user-calls', { userId }); }
        },
        {
          text: 'Delete User!',
          onClick: () => {
            if (window.confirm('Are you sure you want to delete this user?')) {
              UsersApi.deleteUser(userId);
              NavigationHelper.navigateTo('/');
            }
          }
        }
      ]}
    />
  );
};

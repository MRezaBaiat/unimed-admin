import React, { useEffect, useRef, useState } from 'react';
import AppInput from '../../components/base/app_input/AppInput';
import AppButton from '../../components/base/app_button/AppButton';
import AppDropdownMenu from '../../components/base/app_dropdown/AppDropdownMenu';
import HealthCentersApi from '../../network/HealthCentersApi';
import GridContainer from '../../components/base/grid/GridContainer';
import GridItem from '../../components/base/grid/GridItem';
import Card from '../../components/base/app_card/Card';
import CardHeader from '../../components/base/app_card/CardHeader';
import CardBody from '../../components/base/app_card/CardBody';
import CardFooter from '../../components/base/app_card/CardFooter';
import { makeStyles } from '@material-ui/core/styles';
import { HealthCenter, HealthCenterType, User } from 'api';
import CardAvatar from '../../components/base/app_card/CardAvatar';
import SettingView from '../../components/composite/settings_view/SettingsView';
import NavigationHelper from '../../helpers/NavigationHelper';
import AppTextView from '../../components/base/app_text/AppTextView';
import CreateEditButton from '../../components/composite/privilege_managed_buttons/CreateEditButton';
import AppImageView from '../../components/base/app_image/AppImageView';
import LoadingDialog from '../../dialogs/loading_dialog/LoadingDialog';
import { defaultEmpty } from '../../assets/images';

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
    onSuccess:(center: HealthCenter)=>void,
    editableItem?: HealthCenter
}
function ManageView (props: Props) {
  const { onSuccess, editableItem } = props;
  const classes = useStyles();
  const fileRef = useRef();
  const wallpaperRef = useRef();

  const [center, setCenter] = useState(editableItem || { address: '', name: '', type: HealthCenterType.CLINIC } as HealthCenter);
  const [imageUrl, setImageUrl] = useState(center ? center.logoUrl : undefined);
  const [wallpaperUrl, setWallpaperUrl] = useState(center ? center.wallpaperUrl : undefined);
  const [members, setMembers] = useState(undefined as unknown as User[]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editableItem) {
      HealthCentersApi.getDoctorsIn(editableItem._id)
        .then((res) => {
          setMembers(res.data);
        }).catch((err) => {
          console.log(err);
        });
    }
  }, []);

  const create = () => {
    HealthCentersApi.createHealthCenter(center)
      .then((res) => {
        onSuccess(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const edit = () => {
    if (members) {
      center.priorities = members.map(s => s._id);
    }
    HealthCentersApi.updateHealthCenter(center)
      .then((res) => {
        onSuccess(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const pickFile = () => {
    // @ts-ignore
    fileRef.current.click();
  };

  const pickWallpaper = () => {
    // @ts-ignore
    wallpaperRef.current.click();
  };

  const filePicked = (event) => {
    event.stopPropagation();
    event.preventDefault();
    const file = event.target.files[0];
    setLoading(true);
    HealthCentersApi.uploadLogoImage(center._id, file)
      .then(res => {
        setImageUrl(res.data);
      })
      .catch(console.log)
      .finally(() => {
        setLoading(false);
      });
  };

  const wallpaperPicked = (event) => {
    event.stopPropagation();
    event.preventDefault();
    const file = event.target.files[0];
    setLoading(true);
    HealthCentersApi.uploadWallpaper(center._id, file).then((res) => {
      setWallpaperUrl(res.data);
    }).catch(console.log)
      .finally(() => {
        setLoading(false);
      });
  };

  const moveUp = (id: string) => {
    const user = members.find(s => s._id === id);
    if (user) {
      const currentIndex = members.indexOf(user);
      if (currentIndex === 0) {
        return;
      }
      const arr = [...members];
      const cutOut = arr.splice(currentIndex, 1)[0];
      arr.splice(currentIndex - 1, 0, cutOut);
      setMembers(arr);
    }
  };

  const moveDown = (id: string) => {
    const user = members.find(s => s._id === id);
    if (user) {
      const currentIndex = members.indexOf(user);
      if (currentIndex >= members.length - 1) {
        return;
      }
      const arr = [...members];
      const cutOut = arr.splice(currentIndex, 1)[0];
      arr.splice(currentIndex + 1, 0, cutOut);
      setMembers(arr);
    }
  };

  return (
    <div style={{ width: '50vw', height: '100vh' }}>
      <GridContainer>
        <GridItem xs={12} sm={12} md={0}>
          <Card>
            <CardHeader style={{ flexDirection: 'row', justifyContent: 'space-between' }} color="primary">
              <div>
                <h4 className={classes.cardTitleWhite}>Edit HealthCenter</h4>
                <p className={classes.cardCategoryWhite}>Manage your health center info</p>
              </div>
              {
                editableItem &&
                <div>
                  <Settings centerId={editableItem._id}/>
                </div>
              }
            </CardHeader>

            <CardBody>
              {
                editableItem &&
                <div>
                  <AppTextView text={'wallpaper:'} style={{ alignSelf: 'center' }}/>
                  <CardAvatar style={{ marginTop: '2rem', alignSelf: 'center', borderColor: 'white', borderStyle: 'solid', overflow: 'hidden' }} onClick={editableItem && pickWallpaper}>
                    <input
                      ref={(ref) => {
                        // @ts-ignore
                        wallpaperRef.current = ref;
                      }}
                      type="file"
                      id="file"
                      style={{ display: 'none' }} onChange={wallpaperPicked}/>
                    <a href="#pablo" onClick={e => e.preventDefault()}>
                      <img style={{ width: 200, height: 200 }} src={wallpaperUrl || defaultEmpty} alt="..." />
                    </a>
                  </CardAvatar>
                  <AppTextView text={'image:'} style={{ alignSelf: 'center' }}/>
                  <CardAvatar style={{ marginTop: '2rem', alignSelf: 'center', borderColor: 'white', borderRadius: 100, borderStyle: 'solid', overflow: 'hidden' }} onClick={editableItem && pickFile}>
                    <input
                      ref={(ref) => {
                        // @ts-ignore
                        fileRef.current = ref;
                      }}
                      type="file"
                      id="file"
                      style={{ display: 'none' }} onChange={filePicked}/>
                    <a href="#pablo" onClick={e => e.preventDefault()}>
                      <AppImageView style={{ width: 200, height: 200 }} src={imageUrl || defaultEmpty} alt="..." />
                    </a>
                  </CardAvatar>
                </div>
              }
              <GridContainer>

                <Row
                  value={center.name}
                  placeholder="نام"
                  type={'name'}
                  onChange={(text) => setCenter({ ...center, name: text })}/>

                <Row
                  value={center.address}
                  placeholder="آدرس"
                  onChange={(text) => setCenter({ ...center, address: text })}/>

                <Row
                  value={center.percentage}
                  placeholder="درصد"
                  type={'number'}
                  onChange={(text) => setCenter({ ...center, percentage: Number(text) })}/>

                <Row
                  value={center.shaba}
                  placeholder="شماره شبا"
                  onChange={(text) => setCenter({ ...center, shaba: text })}/>

                <Row
                  value={center.priority}
                  placeholder="اولویت"
                  type={'number'}
                  onChange={(text) => setCenter({ ...center, priority: Number(text) })}/>

                <AppDropdownMenu
                  items={[{ text: 'کلینیک', value: HealthCenterType.CLINIC }, { text: 'بیمارستان', value: HealthCenterType.HOSPITAL }]}
                  initialValue={center.type}
                  onClick={(value) => {
                    setCenter({ ...center, type: value });
                  }}
                />

                {
                  members &&
                  <AppTextView style={{ alignSelf: 'center' }} text={':اعضا'}/>
                }
                {
                  members &&
                      members.map((user) => {
                        return (
                          <div style={{ flexDirection: 'row', margin: 5, padding: 5, alignItems: 'center', border: '1px solid grey', borderRadius: 7 }}>
                            <AppTextView text={user.name} style={{ flex: 1, marginLeft: 5 }}/>
                            <div style={{ flexDirection: 'column' }}>
                              <AppButton style={{ height: 20 }} text={'بالا'} onClick={() => { moveUp(user._id); }}/>
                              <AppButton style={{ height: 20 }} text={'پایین'} onClick={() => { moveDown(user._id); }}/>
                            </div>
                          </div>
                        );
                      })
                }

                {
                  loading &&
                  <LoadingDialog/>
                }

              </GridContainer>
            </CardBody>
            <CardFooter>
              <CreateEditButton
                create={create}
                edit={edit}
                editableItem={editableItem}
                permission={privileges => privileges.healthCenters}
              />
            </CardFooter>
          </Card>
        </GridItem>
      </GridContainer>
    </div>

  );
}

const Row = ({ value, placeholder, type = 'text', onChange = undefined as any }) => {
  return (
    <GridItem md={50}>
      <AppInput
        placeholder={placeholder}
        initialvalue={value}
        disabled={!onChange}
        onChange={onChange}
        type={type}
      />
    </GridItem>
  );
};

const Settings = ({ centerId }) => {
  return (
    <SettingView
      items={[
        {
          text: 'Financial Audit',
          onClick: () => { NavigationHelper.navigateTo('/user-financial', { id: centerId, type: 'healthcenter' }); }
        },
        {
          text: 'Delete HealthCenter!',
          onClick: () => {
            if (window.confirm('Are you sure you want to delete this center?')) {
              HealthCentersApi.deleteHealthCenter(centerId);
              NavigationHelper.navigateTo('/');
            }
          }
        }
      ]}
    />
  );
};

export default React.memo(ManageView);

import React, { useState } from 'react';
// @material-ui/core components
import { makeStyles } from '@material-ui/core/styles';
import GridContainer from '../../components/base/grid/GridContainer';
import GridItem from '../../components/base/grid/GridItem';
import Card from '../../components/base/app_card/Card';
import CardHeader from '../../components/base/app_card/CardHeader';
import CardBody from '../../components/base/app_card/CardBody';
import AppInput from '../../components/base/app_input/AppInput';
import CardFooter from '../../components/base/app_card/CardFooter';
import { Admin, AdminType, PrivilegeOptions, PrivilegeOptionsDetails } from 'api';
import AdminsApi from '../../network/AdminsApi';
import Checkbox from '@material-ui/core/Checkbox';
import AppTextView from '../../components/base/app_text/AppTextView';
import CreateEditButton
  from '../../components/composite/privilege_managed_buttons/CreateEditButton';
import AppDropdownMenu from '../../components/base/app_dropdown/AppDropdownMenu';
import defaultValues from './defaultValues';
import AppImageView from '../../components/base/app_image/AppImageView';
import AppButton from '../../components/base/app_button/AppButton';
import Add from '@material-ui/icons/Add';
import HealthCenterPickerDialog from '../../dialogs/health_center_picker/HealthCenterPickerDialog';
import UserPickerDialog from '../../dialogs/user_picker_dialog/UserPickerDialog';
import { deleteIcon } from '../../assets/images';

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
    editableItem?: Partial<any>,
    onSuccess:(admin: Admin)=>void,
}
export default function ManageView (props: Props) {
  const { onSuccess, editableItem } = props;
  const classes = useStyles();

  const [admin, setAdmin] = useState(editableItem || {
    name: '',
    username: '',
    password: '',
    type: AdminType.ADMIN,
    privileges: defaultValues.ADMIN
  });

  const initAdmin = (admin) => {
    const a = {
      ...admin
    };
    const privileges = a.privileges;
    delete privileges.defaultTestFunction;
    Object.keys(privileges).forEach((privilegeKey) => {
      if (typeof privileges[privilegeKey] === 'object') {
        Object.keys(privileges[privilegeKey]).forEach((privilegeOptionKey) => {
          const object = privileges[privilegeKey][privilegeOptionKey];
          if (typeof object === 'object') {
            object.whiteList = object.whiteList.map((s) => {
              return s._id;
            });
            object.test = object.test === '' ? undefined : object.test;
          }
        });
      }
    });
    return a;
  };

  const create = () => {
    const a = initAdmin(admin);
    AdminsApi.createAdmin(a)
      .then((res) => {
        onSuccess(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const edit = () => {
    const a = initAdmin(admin);
    delete a.type;
    AdminsApi.updateAdmin(a)
      .then((res) => {
        onSuccess(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div style={{ width: '90vw', height: '100vh' }}>
      <GridContainer>
        <GridItem xs={12} sm={12} md={0}>
          <Card>
            <CardHeader style={{ flexDirection: 'row', justifyContent: 'space-between' }} color="primary">
              <div>
                <h4 className={classes.cardTitleWhite}>Edit Admin</h4>
                <p className={classes.cardCategoryWhite}>Complete your admin</p>
              </div>
              {
                editableItem &&
                <div>
                  {/* <Settings discountId={editableItem._id}/> */}
                </div>
              }
            </CardHeader>

            <CardBody>
              <GridContainer>

                <AppDropdownMenu
                  items={[{ text: 'مدیریت', value: AdminType.MANAGER }, { text: 'ادمین', value: AdminType.ADMIN }, { text: 'مرکز سلامتی', value: AdminType.HEALTHCENTER }]}
                  initialValue={admin.type}
                  onClick={(value) => { setAdmin({ ...admin, type: value, privileges: defaultValues[value] }); }}
                />

                <Row
                  value={admin.name}
                  placeholder="نام"
                  type={'name'}
                  onChange={(text) => setAdmin({ ...admin, name: text })}/>

                <Row
                  value={admin.username}
                  placeholder="نام کاربری"
                  type={'name'}
                  onChange={(text) => setAdmin({ ...admin, username: text })}/>

                <Row
                  value={admin.password}
                  placeholder="پسوورد"
                  type={'password'}
                  onChange={(text) => setAdmin({ ...admin, password: text })}/>

                <AccessesView
                  privileges={admin.privileges}
                  setPrivileges={privileges => setAdmin({ ...admin, privileges: privileges })}
                />

              </GridContainer>
            </CardBody>
            <CardFooter>
              <CreateEditButton
                editableItem={editableItem}
                create={create}
                edit={edit}
                permission={privileges => privileges.admins}
              />
            </CardFooter>
          </Card>
        </GridItem>
      </GridContainer>
    </div>
  );
}

const AccessesView = ({ privileges, setPrivileges }) => {
  const style = { border: '3px solid green', borderRadius: 7, marginTop: 7 };
  return (
    <div style={{ flexDirection: 'column', width: '100%' }}>
      <AppTextView textColor={'orange'} text={'دسترسی ها'} fontSize={18} style={{ textAlign: 'center', marginTop: 7, marginBottom: 7, borderBottom: '1px dashed lightgrey', width: '50%', marginLeft: 'auto', marginRight: 'auto' }}/>
      <div style={style}>
        <PrivilegeOptionsView title={'کاربران'} privilegeOptions={privileges.users} setPrivilegeOptions={opts => setPrivileges({ ...privileges, users: opts })} Dialog={UserPickerDialog}/>
      </div>
      <div style={style}>
        <PrivilegeOptionsView title={'ادمین ها'} privilegeOptions={privileges.admins} setPrivilegeOptions={opts => setPrivileges({ ...privileges, admins: opts })}/>
      </div>
      <div style={style}>
        <PrivilegeOptionsView title={'ویزیت ها'} privilegeOptions={privileges.visits} setPrivilegeOptions={opts => setPrivileges({ ...privileges, visits: opts })}/>
      </div>
      <div style={style}>
        <PrivilegeOptionsView title={'خدمات پزشکی'} privilegeOptions={privileges.medicalServices} setPrivilegeOptions={opts => setPrivileges({ ...privileges, medicalServices: opts })}/>
      </div>
      <div style={style}>
        <PrivilegeOptionsView title={'مراکز درمانی'} privilegeOptions={privileges.healthCenters} setPrivilegeOptions={opts => setPrivileges({ ...privileges, healthCenters: opts })} Dialog={HealthCenterPickerDialog}/>
      </div>
      <div style={style}>
        <PrivilegeOptionsView title={'لاگ ادمین ها'} privilegeOptions={privileges.adminLogs} setPrivilegeOptions={opts => setPrivileges({ ...privileges, adminLogs: opts })}/>
      </div>
      <div style={style}>
        <PrivilegeOptionsView title={'تخفیف ها'} privilegeOptions={privileges.discounts} setPrivilegeOptions={opts => setPrivileges({ ...privileges, discounts: opts })}/>
      </div>
      <div style={style}>
        <PrivilegeOptionsView title={'تنظیمات سرور'} privilegeOptions={privileges.serverConfigs} setPrivilegeOptions={opts => setPrivileges({ ...privileges, serverConfigs: opts })}/>
      </div>
      <div style={style}>
        <PrivilegeOptionsView title={'درخواست های خدمات'} privilegeOptions={privileges.serviceRequests} setPrivilegeOptions={opts => setPrivileges({ ...privileges, serviceRequests: opts })}/>
      </div>
      <div style={style}>
        <PrivilegeOptionsView title={'تخصص ها'} privilegeOptions={privileges.specializations} setPrivilegeOptions={opts => setPrivileges({ ...privileges, specializations: opts })}/>
      </div>
      <div style={style}>
        <PrivilegeOptionsView title={'حسابداری و ترنزکشن ها'} privilegeOptions={privileges.transactions} setPrivilegeOptions={opts => setPrivileges({ ...privileges, transactions: opts })}/>
      </div>
        <div style={style}>
            <PrivilegeOptionsView title={'نوتیفیکیشن ها'} privilegeOptions={privileges.notifications} setPrivilegeOptions={opts => setPrivileges({ ...privileges, notifications: opts })}/>
        </div>
        <div style={style}>
            <PrivilegeOptionsView title={'رزرو ها'} privilegeOptions={privileges.reservations} setPrivilegeOptions={opts => setPrivileges({ ...privileges, reservations: opts })}/>
        </div>
      <div style={style}>
        <PrivilegeOptionsView title={'آنالیزها'} privilegeOptions={privileges.analytics} setPrivilegeOptions={opts => setPrivileges({ ...privileges, analytics: opts })}/>
      </div>
      <div style={style}>
        <PrivilegeOptionsView title={'تماس ها'} privilegeOptions={privileges.calls} setPrivilegeOptions={opts => setPrivileges({ ...privileges, calls: opts })}/>
      </div>
    </div>
  );
};

interface PrivilegeOptionsViewProps{
    title: string,
    privilegeOptions: PrivilegeOptions,
    setPrivilegeOptions: (options)=>void,
    Dialog?: any
}
const PrivilegeOptionsView = (props: PrivilegeOptionsViewProps) => {
  const { title, privilegeOptions, setPrivilegeOptions, Dialog } = props;
  return (
    <div style={{ flexDirection: 'column', alignItems: 'center', width: '100%' }}>
      <AppTextView text={title} style={{ marginTop: 15 }}/>
      <div style={{ width: '95%', flexDirection: 'row', alignItems: 'center', borderBottom: '0.5px solid lightgrey' }}>
        <div style={{ flex: 1, alignItems: 'center', justiftContent: 'center' }}>
          <AppTextView text={'نمایش منو'}/>
        </div>
        <div style={{ flex: 1, alignItems: 'center', justiftContent: 'center' }}>
          <Checkbox
            style={{ flex: 1 }}
            color={'primary'}
            checked={privilegeOptions.menuVisible}
            onChange={(e) => {
              setPrivilegeOptions({
                ...privilegeOptions,
                menuVisible: e.target.checked
              });
            }}
          />
        </div>
      </div>
      <PrivilegeOptionDetailsView title={'مشاهده'} privilege={privilegeOptions.get} setPrivilege={priv => setPrivilegeOptions({ ...privilegeOptions, get: priv })} Dialog={Dialog}/>
      <PrivilegeOptionDetailsView title={'ساخت'} privilege={privilegeOptions.post} setPrivilege={priv => setPrivilegeOptions({ ...privilegeOptions, post: priv })} Dialog={Dialog}/>
      <PrivilegeOptionDetailsView title={'تغییر'} privilege={privilegeOptions.patch} setPrivilege={priv => setPrivilegeOptions({ ...privilegeOptions, patch: priv })} Dialog={Dialog}/>
      <PrivilegeOptionDetailsView title={'حذف'} privilege={privilegeOptions.delete} setPrivilege={priv => setPrivilegeOptions({ ...privilegeOptions, delete: priv })} Dialog={Dialog}/>
    </div>
  );
};

interface PrivilegeOptionDetailsViewProps{
    title: string,
    privilege: PrivilegeOptionsDetails,
    setPrivilege: (optionDetails)=>void,
    Dialog?: any
}
const PrivilegeOptionDetailsView = (props: PrivilegeOptionDetailsViewProps) => {
  const { title, privilege, setPrivilege, Dialog } = props;
  const [modalVisible, setModalVisible] = useState(false);
  return (
    <div style={{ width: '95%', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-around' }}>
      <div style={{ width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around' }}>
        <div style={{ flex: 1, alignItems: 'center', justiftContent: 'center' }}>
          <AppTextView text={title}/>
        </div>
        <div style={{ flex: 1, alignItems: 'center', justiftContent: 'center' }}>
          <Checkbox
            color={'primary'}
            checked={privilege.allowed}
            onChange={(e) => {
              setPrivilege({
                ...privilege,
                allowed: e.target.checked
              });
            }}
          />
        </div>
      </div>
      {
        privilege.allowed && Dialog &&
            <div style={{ flexDirection: 'column', width: '100%', justifyContent: 'center' }}>
              <div style={{ width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', borderBottom: '0.5px solid lightgrey' }}>
                <AppButton color="info" justIcon round style={{ width: 20, marginRight: 20 }} onClick={() => { setModalVisible(true); }}>
                  <Add style={{ width: 20 }}/>
                </AppButton>
                <AppTextView text={'لیست سفید'}/>
              </div>
              <div>
                {
                  // @ts-ignore
                  privilege.whiteList.map((item) => {
                    return <WhiteRow text={item.name} onDelete={() => {
                      const l = [...privilege.whiteList];
                      l.splice(l.indexOf(item), 1);
                      setPrivilege({
                        ...privilege,
                        whiteList: l
                      });
                    }}/>;
                  })
                }
              </div>
            </div>
      }
      {
        Dialog && modalVisible && <Dialog
          onClose={() => setModalVisible(false)}
          onSelect={(item) => {
            setPrivilege({ ...privilege, whiteList: [...privilege.whiteList, item] });
            setModalVisible(false);
          }}/>
      }
    </div>
  );
};

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

const WhiteRow = ({ text, onDelete }) => {
  return (
    <Card style={{ margin: 5, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 5 }}>
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

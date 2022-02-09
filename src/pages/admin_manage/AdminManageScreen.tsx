import React, { useEffect, useState } from 'react';
import NavigationHelper from '../../helpers/NavigationHelper';
import ManageView
  from './ManageView';
import AdminsApi from '../../network/AdminsApi';
import { Admin, User } from 'api';

interface Props {
    adminId: string
}
function AdminManageScreen (props: Props) {
  const adminId = NavigationHelper.getParam(props, 'adminId');
  const [admin, setAdmin] = useState(undefined as Admin | undefined);

  useEffect(() => {
    if (!adminId) {
      return;
    }
    AdminsApi.findAdmin(adminId).then((res) => {
      setAdmin(res.data);
    }).catch(err => {
      console.log(err);
    });
  }, []);

  if (adminId && !admin) {
    return null;
  }
  return (
    <div style={{ alignItems: 'center', justifyContent: 'center' }}>
      <ManageView editableItem={admin} onSuccess={NavigationHelper.goBack}/>
    </div>
  );
}

export default React.memo(AdminManageScreen);

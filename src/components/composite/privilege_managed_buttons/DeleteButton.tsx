import React from 'react';
import AppButton from '../../base/app_button/AppButton';
import { store } from '../../../index';
import { Privileges, PrivilegeOptions } from 'api';

interface Props{
    permission: (privileges: Privileges) => PrivilegeOptions
    deleteFnc:()=>void
}
function DeleteButton (props: Props) {
  const { deleteFnc, permission } = props;
  const privilegeOptions = permission(store.getState().global.admin.privileges);
  if (!privilegeOptions.delete) {
    return null;
  }
  return (
    <AppButton color="danger" text={'حذف'} onClick={deleteFnc}/>
  );
}

export default React.memo(DeleteButton);

import React from 'react';
import AppButton from '../../base/app_button/AppButton';
import { store } from '../../../index';
import { Privileges, PrivilegeOptions } from 'api';

interface Props{
    permission: (privileges: Privileges) => PrivilegeOptions
    editableItem?: any,
    create?:()=>void,
    edit?:()=>void,
    progress?: number,
    texts?: { create:string, save:string }
}
function CreateEditButton (props: Props) {
  const { editableItem, create, edit, permission, progress, texts } = props;
  const privilegeOptions = permission(store.getState().global.admin.privileges);
  if (editableItem) {
    if (!privilegeOptions.patch.allowed) {
      return null;
    }
  } else {
    if (!privilegeOptions.post.allowed) {
      return null;
    }
  }
  return (
    <AppButton progress={progress} color="primary" text={editableItem ? texts?.save : texts?.create} onClick={editableItem ? edit : create}/>
  );
}

CreateEditButton.defaultProps = {
  texts: { create: 'ساخت', save: 'ذخیره' }
};

export default React.memo(CreateEditButton);

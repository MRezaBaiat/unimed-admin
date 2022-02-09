import './styles.css';
import React, { useState } from 'react';
import Dialog from '@material-ui/core/Dialog';
import { User, UserType } from 'api';
import UsersList from 'src/components/composite/users_list/UsersList';

interface Props {
    onClose:()=>void,
    type?:UserType,
    onSelect:(user: User)=>void
}
function SpecializationPickerDialog (props: Props) {
  const { onClose, onSelect, type } = props;

  return (
    <Dialog onClose={onClose} open={true}>
      <div className='user-picker-dialog'>
        <UsersList type={type} onSelect={onSelect}/>
      </div>
    </Dialog>
  );
}

export default React.memo(SpecializationPickerDialog);

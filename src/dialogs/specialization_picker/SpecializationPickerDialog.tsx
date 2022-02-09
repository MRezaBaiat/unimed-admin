import './styles.css';
import React, { useState } from 'react';
import UsersApi from '../../network/UsersApi';
import { Specialization, UserType } from 'api';
import Dialog from '@material-ui/core/Dialog';
import AppInput from '../../components/base/app_input/AppInput';
import AppButton from '../../components/base/app_button/AppButton';
import SpecializationsApi from '../../network/SpecializationsApi';
import SpecializationsList
  from '../../components/composite/specializations_list/SpecializationsList';

interface Props {
    onClose:()=>void,
    onSelect:(spec: Specialization)=>void
}
function SpecializationPickerDialog (props: Props) {
  const { onClose, onSelect } = props;

  return (
    <Dialog onClose={onClose} open={true}>
      <div className='specialization-picker-dialog'>
        <SpecializationsList onSelect={onSelect}/>
      </div>
    </Dialog>
  );
}

export default React.memo(SpecializationPickerDialog);

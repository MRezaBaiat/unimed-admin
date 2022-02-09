import './styles.css';
import React, { useState } from 'react';
import Dialog from '@material-ui/core/Dialog';
import HealthCentersList from '../../components/composite/healthcenters_list/HealthCentersList';
import { HealthCenter, HealthCenterType } from 'api';

interface Props {
    onClose:()=>void,
    type:HealthCenterType.CLINIC | HealthCenterType.HOSPITAL | undefined,
    onSelect:(healthCenter: HealthCenter)=>void
}
function SpecializationPickerDialog (props: Props) {
  const { onClose, onSelect, type } = props;

  return (
    <Dialog onClose={onClose} open={true}>
      <div className='healthcenter-picker-dialog'>
        <HealthCentersList type={type} onSelect={onSelect}/>
      </div>
    </Dialog>
  );
}

export default React.memo(SpecializationPickerDialog);

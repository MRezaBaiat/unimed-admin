import './styles.css';
import React, { useState } from 'react';
import { Helper, WorkTime } from 'api';
import Dialog from '@material-ui/core/Dialog';
import AppInput from '../../components/base/app_input/AppInput';
import AppButton from '../../components/base/app_button/AppButton';
import HealthCenterPickerDialog from '../health_center_picker/HealthCenterPickerDialog';
import AppDropdownMenu from '../../components/base/app_dropdown/AppDropdownMenu';

interface Props {
    onClose:()=>void,
    onCreate:(wt: WorkTime, day:string)=>void
}
function ReserveTimeCreateDialog (props: Props) {
  const { onClose, onCreate } = props;
  const [worktime, setWorktime] = useState({ from: '00:00', to: '00:00', exceptions: [] } as WorkTime);
  const [day, setDay] = useState('saturday');

  return (
    <Dialog fullWidth={true} style={{ minWidth: '50vw' }} onClose={onClose} open={true}>
      <div className='responsetime-create-dialog'>
        <AppDropdownMenu
          initialValue={day}
          items={[
            { value: 'saturday', text: 'saturday' },
            { value: 'sunday', text: 'sunday' },
            { value: 'monday', text: 'monday' },
            { value: 'tuesday', text: 'tuesday' },
            { value: 'wednesday', text: 'wednesday' },
            { value: 'thursday', text: 'thursday' },
            { value: 'friday', text: 'friday' }
          ]}
          onClick={(value) => {
            setDay(value);
          }}
        />
        <AppInput
          placeholder={' از'}
          initialvalue={worktime.from}
          onChange={(text) => {
            setWorktime({ ...worktime, from: text });
          }}
        />
          <AppInput
              placeholder={' تا'}
              initialvalue={worktime.to}
              onChange={(text) => {
                setWorktime({ ...worktime, to: text });
              }}
          />
        <div>
          <AppButton text={'Create'} onClick={() => { onCreate(worktime, String(day)); }}/>
          <AppButton text={'Cancel'} onClick={onClose}/>
        </div>
      </div>
    </Dialog>
  );
}

export default React.memo(ReserveTimeCreateDialog);

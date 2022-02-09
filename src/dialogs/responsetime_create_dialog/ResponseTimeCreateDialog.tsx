import './styles.css';
import React, { useState } from 'react';
import { Helper, ResponseTime } from 'api';
import Dialog from '@material-ui/core/Dialog';
import AppInput from '../../components/base/app_input/AppInput';
import AppButton from '../../components/base/app_button/AppButton';
import HealthCenterPickerDialog from '../health_center_picker/HealthCenterPickerDialog';
import AppDropdownMenu from '../../components/base/app_dropdown/AppDropdownMenu';
import { numbersToEnglish } from '../../helpers/Utils';

interface Props {
    onClose:()=>void,
    onCreate:(responseTime: ResponseTime, day:string)=>void
}
function ResponseTimeCreateDialog (props: Props) {
  const { onClose, onCreate } = props;
  // @ts-ignore
  const [responseTime, setResponseTime] = useState({ from: { hour: '00', minute: '00' }, to: { hour: '00', minute: '00' }, healthCenter: undefined } as ResponseTime);
  const [modalVisible, setModalVisible] = useState(false);
  const [day, setDay] = useState(0);

  return (
    <Dialog fullWidth={true} style={{ minWidth: '50vw' }} onClose={onClose} open={true}>
      <div className='responsetime-create-dialog'>
        <AppDropdownMenu
          initialValue={day}
          items={[
            { value: 0, text: Helper.dayNumberToString('0') },
            { value: 1, text: Helper.dayNumberToString('1') },
            { value: 2, text: Helper.dayNumberToString('2') },
            { value: 3, text: Helper.dayNumberToString('3') },
            { value: 4, text: Helper.dayNumberToString('4') },
            { value: 5, text: Helper.dayNumberToString('5') },
            { value: 6, text: Helper.dayNumberToString('6') }
          ]}
          onClick={(value) => {
            setDay(value);
          }}
        />
        <AppInput
          placeholder={' از'}
          initialvalue={responseTime.from.hour + ':' + responseTime.from.minute}
          onChange={(text) => {
            setResponseTime({ ...responseTime, from: { hour: numbersToEnglish(text.split(':')[0]), minute: numbersToEnglish(text.split(':')[1]) } });
          }}
        />
        <AppInput
          placeholder={' تا'}
          initialvalue={responseTime.to.hour + ':' + responseTime.to.minute}
          onChange={(text) => {
            setResponseTime({ ...responseTime, to: { hour: numbersToEnglish(text.split(':')[0]), minute: numbersToEnglish(text.split(':')[1]) } });
          }}
        />
        <AppButton text={responseTime.healthCenter
          // @ts-ignore
          ? responseTime.healthCenter.name : 'Select Health Center'} onClick={() => {
            setModalVisible(true);
          }}/>
        {
          modalVisible &&
              <HealthCenterPickerDialog
                type={undefined}
                onClose={() => { setModalVisible(false); }}
                onSelect={(healthCenter) => {
                  setModalVisible(false);
                  setResponseTime({ ...responseTime, healthCenter });
                }}
              />
        }
        <div>
          <AppButton text={'Create'} onClick={() => { onCreate(responseTime, String(day)); }}/>
          <AppButton text={'Cancel'} onClick={onClose}/>
        </div>
      </div>
    </Dialog>
  );
}

export default React.memo(ResponseTimeCreateDialog);

import './styles.css';
import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import Spinner from 'react-spinkit';

interface Props {

}
function SpecializationPickerDialog (props: Props) {
  return (
    <Dialog open={true}
      PaperProps={{
        style: {
          backgroundColor: 'transparent',
          boxShadow: 'none'
        }
      }}
    >
      <Spinner style={{ flexDirection: 'row', backgroundColor: 'transparent' }} color={'white'} name='ball-beat' fadeIn="none" fadeOut="none"/>
    </Dialog>
  );
}

export default React.memo(SpecializationPickerDialog);

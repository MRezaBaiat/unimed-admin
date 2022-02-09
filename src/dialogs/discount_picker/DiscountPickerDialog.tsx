import './styles.css';
import React, { useState } from 'react';
import { DiscountCoupon, Specialization, UserType } from 'api';
import Dialog from '@material-ui/core/Dialog';
import DiscountsList from '../../components/composite/discounts_list/DiscountsList';

interface Props {
    onClose:()=>void,
    onSelect:(coupon: DiscountCoupon)=>void
}
function SpecializationPickerDialog (props: Props) {
  const { onClose, onSelect } = props;

  return (
    <Dialog onClose={onClose} open={true}>
      <div className='specialization-picker-dialog'>
        <DiscountsList onSelect={onSelect}/>
      </div>
    </Dialog>
  );
}

export default React.memo(SpecializationPickerDialog);

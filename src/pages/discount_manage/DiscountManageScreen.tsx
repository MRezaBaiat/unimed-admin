import React, { useEffect, useState } from 'react';
import NavigationHelper from '../../helpers/NavigationHelper';
import DiscountsApi from '../../network/DiscountsApi';
import ManageView
  from './ManageView';
import { DiscountCoupon } from 'api';

interface Props {
    couponId: string
}
function DiscountManageScreen (props: Props) {
  const couponId = NavigationHelper.getParam(props, 'couponId');
  const [coupon, setCoupon] = useState(undefined as unknown as DiscountCoupon);

  useEffect(() => {
    if (!couponId) {
      return;
    }
    DiscountsApi.getDiscount(couponId).then((res) => {
      // @ts-ignore
      setCoupon(res.data);
    }).catch(err => {
      console.log(err);
    });
  }, []);

  if (couponId && !coupon) {
    return null;
  }
  return (
    <div style={{ alignItems: 'center', justifyContent: 'center' }}>
      <ManageView editableItem={coupon} onSuccess={NavigationHelper.goBack}/>
    </div>
  );
}

export default React.memo(DiscountManageScreen);

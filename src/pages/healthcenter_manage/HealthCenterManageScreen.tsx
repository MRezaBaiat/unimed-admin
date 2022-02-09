import React, { useEffect, useState } from 'react';
import NavigationHelper from '../../helpers/NavigationHelper';
import ManageView
  from './ManageView';
import { HealthCenter } from 'api';
import HealthCentersApi from '../../network/HealthCentersApi';

interface Props {
    centerId: string
}
function DiscountManageScreen (props: Props) {
  const centerId = NavigationHelper.getParam(props, 'centerId');
  const [center, setCenter] = useState(undefined as HealthCenter | undefined);

  useEffect(() => {
    if (!centerId) {
      return;
    }
    HealthCentersApi.getHealthCenter(centerId).then((res) => {
      console.log(res.data);
      setCenter(res.data);
    }).catch(err => {
      console.log(err);
    });
  }, []);

  if (centerId && !center) {
    return null;
  }
  return (
    <div style={{ alignItems: 'center', justifyContent: 'center' }}>
      <ManageView editableItem={center} onSuccess={NavigationHelper.goBack}/>
    </div>
  );
}

export default React.memo(DiscountManageScreen);

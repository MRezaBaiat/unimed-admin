import React, { useEffect, useState } from 'react';
import ManageView from './ManageView';
import NavigationHelper from '../../helpers/NavigationHelper';
import { Visit } from 'api';
import VisitsApi from '../../network/VisitsApi';

interface Props {
    visitId: string
}
function VisitManageScreen (props: Props) {
  const visitId = NavigationHelper.getParam(props, 'visitId');

  const [visit, setVisit] = useState(undefined as Visit | undefined);

  useEffect(() => {
    VisitsApi.getVisit(visitId).then((res) => {
      res.data.patient = res.data.patient || { mobile: 'Deleted User!', name: 'Deleted User!' };
      res.data.doctor = res.data.doctor || { mobile: 'Deleted User!', name: 'Deleted User!' };
      setVisit(res.data);
    }).catch(err => {
      console.log(err);
    });
  }, []);

  if (!visit) {
    return null;
  }
  return (
    <div style={{ alignItems: 'center', justifyContent: 'center' }}>
      <ManageView editableItem={visit} onSuccess={NavigationHelper.goBack}/>
    </div>
  );
}

export default React.memo(VisitManageScreen);

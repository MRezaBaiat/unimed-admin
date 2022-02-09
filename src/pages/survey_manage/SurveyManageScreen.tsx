import React, { useEffect, useState } from 'react';
import NavigationHelper from '../../helpers/NavigationHelper';
import { Visit } from 'api';
import VisitsApi from '../../network/VisitsApi';
import ManageView from './ManageView';

interface Props {
  visitId: string
}
function SurveyManageScreen (props: Props) {
  const visitId = NavigationHelper.getParam(props, 'visitId');

  const [visit, setVisit] = useState(undefined as Visit | undefined);

  useEffect(() => {
    VisitsApi.getVisit(visitId).then((res) => {
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

export default React.memo(SurveyManageScreen);

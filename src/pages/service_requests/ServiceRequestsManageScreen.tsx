import React, { useEffect, useState } from 'react';
import ManageView from './ManageView';
import NavigationHelper from '../../helpers/NavigationHelper';
import { ServiceRequest } from 'api';
import ServiceRequestsApi from '../../network/ServiceRequestsApi';

interface Props {
  requestId: string
}
function ServiceRequestsManageScreen (props: Props) {
  // @ts-ignore
  const requestId = NavigationHelper.getParam(props, 'requestId');

  const [visit, setVisit] = useState(undefined as ServiceRequest | undefined);

  useEffect(() => {
    ServiceRequestsApi.getServiceRequest(requestId).then((res) => {
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

export default React.memo(ServiceRequestsManageScreen);

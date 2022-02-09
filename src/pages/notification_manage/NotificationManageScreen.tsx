import React, { useEffect, useState } from 'react';
import ManageView from './ManageView';
import NavigationHelper from '../../helpers/NavigationHelper';
import { Notification } from 'api';
import NotificationsApi from '../../network/NotificationsApi';

interface Props {
    requestId: string
}
function ServiceRequestsManageScreen (props: Props) {
  const notificationId = NavigationHelper.getParam(props, 'notificationId');

  const [notification, setNotification] = useState(undefined as unknown as Notification);

  useEffect(() => {
    if (notificationId) {
      NotificationsApi.findNotification(notificationId).then((res) => {
        setNotification(res.data);
      }).catch(err => {
        console.log(err);
      });
    }
  }, []);

  if (notificationId && !notification) {
    return null;
  }
  return (
    <div style={{ alignItems: 'center', justifyContent: 'center' }}>
      <ManageView editableItem={notification} onSuccess={NavigationHelper.goBack}/>
    </div>
  );
}

export default React.memo(ServiceRequestsManageScreen);

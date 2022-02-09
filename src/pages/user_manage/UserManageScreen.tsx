import React, { useEffect, useState } from 'react';
import UsersApi from '../../network/UsersApi';
import { User } from 'api';
import ManageView from './ManageView';
import NavigationHelper from '../../helpers/NavigationHelper';

interface Props {
    userId: string
}
function UserManageScreen (props: Props) {
  // @ts-ignore
  const userId = NavigationHelper.getParam(props, 'userId');
  // @ts-ignore
  const [user, setUser] = useState(undefined as User);

  useEffect(() => {
    if (!userId) {
      return;
    }
    UsersApi.getUser(userId).then((res) => {
      setUser(res.data);
    }).catch(err => {
      console.log(err);
    });
  }, []);

  if (userId && !user) {
    return null;
  }
  // TODO
  // delete this
  // @ts-ignore
  // user.details.response_days = {};
  return (
    <div style={{ alignItems: 'center', justifyContent: 'center' }}>
      <ManageView editableItem={user} onSuccess={NavigationHelper.goBack}/>
    </div>
  );
}

export default React.memo(UserManageScreen);

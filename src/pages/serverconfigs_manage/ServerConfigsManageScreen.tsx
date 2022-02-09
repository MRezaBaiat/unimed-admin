import React, { useEffect, useState } from 'react';
import ManageView from './ManageView';
import NavigationHelper from '../../helpers/NavigationHelper';
import { ServerConfig } from 'api';
import ServerConfigsApi from '../../network/ServerConfigsApi';

interface Props {

}
function UserManageScreen (props: Props) {
  // @ts-ignore
  const [config, setConfig] = useState(undefined as ServerConfig);

  useEffect(() => {
    ServerConfigsApi.getServerConfigs().then((res) => {
      setConfig(res.data);
    }).catch(err => {
      console.log(err);
    });
  }, []);

  if (!config) {
    return null;
  }
  return (
    <div style={{ alignItems: 'center', justifyContent: 'center' }}>
      <ManageView editableItem={config} onSuccess={NavigationHelper.goBack}/>
    </div>
  );
}

export default React.memo(UserManageScreen);

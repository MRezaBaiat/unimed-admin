import React, { useEffect, useState } from 'react';
import ManageView from './ManageView';
import NavigationHelper from '../../helpers/NavigationHelper';
import SpecializationsApi from '../../network/SpecializationsApi';
import { User } from 'api';

interface Props {
    specId: string
}
function UserManageScreen (props: Props) {
  const specId = NavigationHelper.getParam(props, 'specId');
  const [spec, setSpec] = useState(undefined as unknown as User);

  useEffect(() => {
    if (!specId) {
      return;
    }
    SpecializationsApi.getSpecialization(specId).then((res) => {
      // @ts-ignore
      setSpec(res.data);
    }).catch(err => {
      console.log(err);
    });
  }, []);

  if (specId && !spec) {
    return null;
  }
  return (
    <div style={{ alignItems: 'center', justifyContent: 'center' }}>
      <ManageView editableItem={spec} onSuccess={NavigationHelper.goBack}/>
    </div>
  );
}

export default React.memo(UserManageScreen);

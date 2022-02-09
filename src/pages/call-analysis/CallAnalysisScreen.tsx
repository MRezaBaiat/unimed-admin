import React, { useEffect, useState } from 'react';
import NavigationHelper from '../../helpers/NavigationHelper';
import ManageView
  from './ManageView';
import { Conference } from 'api';
import ConferenceApi from '../../network/ConferenceApi';

interface Props {
  conferenceId: string
}
function CallAnalysisScreen (props: Props) {
  const conferenceId = NavigationHelper.getParam(props, 'conferenceId');
  const [conference, setConference] = useState(undefined as Conference | undefined);

  useEffect(() => {
    if (!conferenceId) {
      return;
    }
    ConferenceApi.getConference(conferenceId).then((res) => {
      setConference(res.data as any);
    }).catch(err => {
      console.log(err);
    });
  }, []);

  if (!conference) {
    return null;
  }
  return (
    <div style={{ alignItems: 'center', justifyContent: 'center' }}>
      <ManageView editableItem={conference}/>
    </div>
  );
}

export default React.memo(CallAnalysisScreen);

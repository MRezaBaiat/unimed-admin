import React, { useState } from 'react';
import CallsList from '../../components/composite/calls_list/CallsList';
import NavigationHelper from '../../helpers/NavigationHelper';

interface Props {
  userId: string
}
export default function UserCallsScreen (props: Props) {
  const userId = NavigationHelper.getParam(props, 'userId');

  return (
   <CallsList
    userId={userId}
   />
  );
}

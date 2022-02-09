import React, { useEffect, useState } from 'react';
import Card from '../../components/base/app_card/Card';
import CardHeader from '../../components/base/app_card/CardHeader';
import CardIcon from '../../components/base/app_card/CardIcon';
import { makeStyles } from '@material-ui/core/styles';
import styles from '../../assets/jss/material-dashboard-react/views/dashboardStyle.js';
import GridContainer from '../../components/base/grid/GridContainer';
import NavigationHelper from '../../helpers/NavigationHelper';
import { Visit } from 'api';
import VisitsApi from '../../network/VisitsApi';
import VisitsList from '../../components/composite/visits_list/VisitsList';

// @ts-ignore
const useStyles = makeStyles(styles);

interface Props {
    userId: string
}
function UserVisitsScreen (props: Props) {
  const userId = NavigationHelper.getParam(props, 'userId');
  const classes = useStyles();

  const onSelect = (visit: Visit) => {
    NavigationHelper.navigateTo('/visit', { visitId: visit._id });
  };

  return (
    <div style={{ alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: '70vw', height: '100vh', direction: 'rtl' }}>
        <GridContainer>
          <Card>
            <CardHeader color="warning" stats icon>
              <CardIcon color="warning">
                  Visits
              </CardIcon>
            </CardHeader>
            <VisitsList userId={userId} onSelect={onSelect}/>
          </Card>
        </GridContainer>
      </div>
    </div>
  );
}

export default React.memo(UserVisitsScreen);

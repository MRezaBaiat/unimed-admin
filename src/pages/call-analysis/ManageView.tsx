import React from 'react';
// @material-ui/core components
import { makeStyles } from '@material-ui/core/styles';
import GridContainer from '../../components/base/grid/GridContainer';
import GridItem from '../../components/base/grid/GridItem';
import Card from '../../components/base/app_card/Card';
import CardHeader from '../../components/base/app_card/CardHeader';
import CardBody from '../../components/base/app_card/CardBody';
import CardFooter from '../../components/base/app_card/CardFooter';
import { AbstractCallMetric, CallMetricsEvent, Conference } from 'api';
import AppTextView from '../../components/base/app_text/AppTextView';
import { numbersToEnglish } from '../../helpers/Utils';
import { smartDate } from 'javascript-dev-kit';

const styles = {
  cardCategoryWhite: {
    color: 'rgba(255,255,255,.62)',
    margin: '0',
    fontSize: '14px',
    marginTop: '0',
    marginBottom: '0'
  },
  cardTitleWhite: {
    color: '#FFFFFF',
    marginTop: '0px',
    minHeight: 'auto',
    fontWeight: '300',
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    marginBottom: '3px',
    textDecoration: 'none'
  }
};

// @ts-ignore
const useStyles = makeStyles(styles);

interface Props {
    editableItem: Conference
}
export default function ManageView (props: Props) {
  const { editableItem } = props;
  const classes = useStyles();
  console.log(editableItem);
  return (
    <div style={{ width: '90vw', height: '100vh' }}>
      <GridContainer>
        <GridItem xs={12} sm={12} md={0}>
          <Card>
            <CardHeader style={{ flexDirection: 'row', justifyContent: 'space-between' }} color="primary">
              <div>
                <h4 className={classes.cardTitleWhite}>Conference Analysis</h4>
                <p className={classes.cardCategoryWhite}>Analyse conference details</p>
              </div>
            </CardHeader>

            <CardBody>
              <GridContainer>
                <div style={{ alignItems: 'center' }}>
                  <div style={{ flexDirection: 'row', width: '100%', justifyContent: 'space-evenly' }}>
                    {
                      renderInfo(editableItem.initiator)
                    }
                    {
                      renderInfo(editableItem.receiver)
                    }
                  </div>
                  <br/>
                  <AppTextView text={'EVENTS:'}/>
                  <br/>
                  <div style={{ flexDirection: 'row', overflowX: 'hidden' }}>
                    {
                      renderEvents(editableItem.initiator, editableItem)
                    }
                    {
                      renderEvents(editableItem.receiver, editableItem)
                    }
                  </div>
                </div>
              </GridContainer>
            </CardBody>
            <CardFooter>

            </CardFooter>
          </Card>
        </GridItem>
      </GridContainer>
    </div>
  );
}

const renderInfo = (participant) => {
  return (
    <div style={{ flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <AppTextView text={`Initiator (${participant.mobile} - ${participant.userType} - ${participant.name})`}/>
      <br/>
      {
        participant.deviceInfo && Object.keys(participant.deviceInfo).map((i) => {
          return (
              <AppTextView english fontSize={10} text={`${i}: ${numbersToEnglish(participant.deviceInfo[i])}`}/>
          );
        })
      }
    </div>
  );
};

const renderEvents = (participant, data) => {
  return (
    <div style={{ flexDirection: 'column', alignItems: 'flex-start', flex: 1, overflowX: 'scroll', padding: 5 }}>
      {
        data.events.filter(event => event.userId === participant.id).map((e) => {
          return (
            <div style={{ width: '40vw', flexDirection: 'column' }}>
              <AppTextView text={e.event}/>
              {
                e.data && <AppTextView english text={numbersToEnglish(JSON.stringify(e.data))}/>
              }
              {
                renderExtras(data, e)
              }
              <br/>
            </div>
          );
        })
      }
    </div>
  );
};

const searchEvent = (events: AbstractCallMetric<any>[], before: string, search: CallMetricsEvent[]) => {
  return events.find(e => search.includes(e.event) && smartDate(e.timeStamp).getTime() <= smartDate(before).getTime());
};

const findBy = (conference: Conference, metric: AbstractCallMetric<any>) => {
  return metric.userId === conference.initiator.id ? conference.initiator.userType : conference.receiver.userType;
};

const renderExtras = (conference: Conference, e: AbstractCallMetric<any>) => {
  let text;
  let color;
  switch (e.event) {
    case CallMetricsEvent.RTC_CONNECTION_STATE_CHANGED:
      return;
    case CallMetricsEvent.RTC_SIGNALING_STATE_CHANGED:
      return;
    case CallMetricsEvent.RTC_ICE_GATHERING_STATE_CHANGED:
      return;
    case CallMetricsEvent.CALL_CLOSED:
      {
        const metric = searchEvent(conference.events, e.timeStamp, [CallMetricsEvent.REJECT_CLICKED, CallMetricsEvent.END_CALL_CLICKED]);
        if (metric) {
          text = 'call ended for ' + metric.event + ' by ' + findBy(conference, e);
          color = 'green';
        } else {
          text = 'call ended for unknown reason';
          color = 'red';
        }
      }
      break;
  }
  if (text) {
    return <AppTextView english fontSize={10} textColor={color} text={text}/>;
  }
  return null;
};

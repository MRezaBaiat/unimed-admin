import React, { useState } from 'react';
// @material-ui/core components
import { makeStyles } from '@material-ui/core/styles';
import GridContainer from '../../components/base/grid/GridContainer';
import GridItem from '../../components/base/grid/GridItem';
import Card from '../../components/base/app_card/Card';
import CardHeader from '../../components/base/app_card/CardHeader';
import CardBody from '../../components/base/app_card/CardBody';
import AppInput from '../../components/base/app_input/AppInput';
import CardAvatar from '../../components/base/app_card/CardAvatar';
import { formatDateShamsi } from '../../helpers/index';
import { Visit, VisitStatus } from 'api';
import AppButton from '../../components/base/app_button/AppButton';
import { Modal } from '@material-ui/core';
import VisitsApi from '../../network/VisitsApi';
import NavigationHelper from '../../helpers/NavigationHelper';
import { store } from '../../index';
import { defaultEmpty } from '../../assets/images';
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
  editableItem?: Visit
}
export default function ManageView (props: Props) {
  const { editableItem } = props;
  const classes = useStyles();
  const [visit, setVisit] = useState(editableItem as Visit);
  const [endModalVisible, setEndModalVisible] = useState(false);

  return (
    <div style={{ width: '50vw', height: '100vh' }}>
      <GridContainer>
        <GridItem xs={12} sm={12} md={0}>
          <Card>
            <CardHeader style={{ flexDirection: 'row', justifyContent: 'space-between' }} color="primary">
              <div>
                <h4 className={classes.cardTitleWhite}>Visit</h4>
                <p className={classes.cardCategoryWhite}>Complete your profile</p>
              </div>
            </CardHeader>
            <CardBody>
              <GridContainer>
                <CardAvatar profile style={{ marginTop: '2rem' }}>
                  <a href="#pablo" onClick={e => e.preventDefault()}>
                    <img src={defaultEmpty} alt="..." />
                  </a>
                </CardAvatar>

                <Row
                  value={visit._id}
                  placeholder="ID"/>

                <Row
                  value={visit.doctor.name}
                  placeholder="????????"/>

                <Row
                  value={visit.patient.mobile}
                  placeholder="??????????"/>

                <Row
                  value={formatDateShamsi(visit.createdAt)}
                  placeholder="?????????? ??????????????"/>

                <Row
                  value={formatDateShamsi(visit.startDate)}
                  placeholder="?????????? ????????"/>

                <Row
                    value={formatDateShamsi(visit.endDate)}
                    placeholder="?????????? ??????????"/>

                {
                  visit.state === VisitStatus.ENDED &&
                  <Row
                      value={`${Math.round((smartDate(visit.endDate).getTime() - smartDate(visit.startDate).getTime()) / 1000 / 60)}` + ' ?????????? '}
                      placeholder="?????? ????????"/>
                }

                <Row
                  value={visit.state !== VisitStatus.ENDED && visit.chatting ? 'CHATTING' : visit.state}
                  placeholder="??????????"/>

                {
                  visit.receipt &&
                  <div>
                    <Row
                      value={String(visit.receipt.total)}
                      placeholder="?????????? ??????"/>

                    <Row
                      value={String(visit.receipt.doctorCut)}
                      placeholder="?????? ????????"/>

                    <Row
                      value={String(visit.receipt.paid)}
                      placeholder="?????????? ???????????? ??????"/>

                    <Row
                      value={String(visit.receipt.discount)}
                      placeholder="??????????"/>

                    <Row
                      value={visit.receipt.returnTransactionId ? '??????' : '??????'}
                      placeholder="???????????? ??????????"/>
                  </div>
                }

                {
                  (visit.state === VisitStatus.ENDED) && !visit.receipt.returnTransactionId && store.getState().global.admin.privileges.visits.patch &&
                  <AppButton text={'???????????? ??????????'} color={'danger'} onClick={() => {
                    VisitsApi.returnVisitPayment(visit._id);
                    NavigationHelper.goBack();
                  }}/>
                }

                {
                  (visit.state === VisitStatus.STARTED || visit.state === VisitStatus.IN_QUEUE) && store.getState().global.admin.privileges.visits.patch &&
                  <AppButton text={'?????????? ????????????'} color={'danger'} onClick={() => {
                    setEndModalVisible(true);
                  }}/>
                }

                {
                  endModalVisible &&
                      <Modal style={{ alignItems: 'center', justifyContent: 'center' }} open={endModalVisible} onClose={() => setEndModalVisible(false)}>
                        <div style={{ flexDirection: 'row' }}>
                          <AppButton text={'???? ??????????'} onClick={() => VisitsApi.endVisit(visit._id, false).then(NavigationHelper.goBack).catch(console.log)}/>
                          <AppButton text={'???????? ??????????'} onClick={() => VisitsApi.endVisit(visit._id, true).then(NavigationHelper.goBack).catch(console.log)}/>
                          <AppButton text={'????????????'} onClick={() => setEndModalVisible(false)}/>
                        </div>
                      </Modal>
                }

              </GridContainer>
            </CardBody>
          </Card>
        </GridItem>
      </GridContainer>
    </div>
  );
}

const Row = ({ value, placeholder, multiline = false }) => {
  return (
    <GridItem md={50}>
      <AppInput
        placeholder={placeholder}
        initialvalue={value || ''}
        disabled={true}
        inputProps={{
          multiline: multiline,
          rows: 5
        }}
      />
    </GridItem>
  );
};

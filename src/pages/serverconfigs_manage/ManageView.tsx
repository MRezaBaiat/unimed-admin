import AppInput from '../../components/base/app_input/AppInput';
import AppButton from '../../components/base/app_button/AppButton';
import GridContainer from '../../components/base/grid/GridContainer';
import GridItem from '../../components/base/grid/GridItem';
import Card from '../../components/base/app_card/Card';
import CardHeader from '../../components/base/app_card/CardHeader';
import CardBody from '../../components/base/app_card/CardBody';
import CardFooter from '../../components/base/app_card/CardFooter';
import { makeStyles } from '@material-ui/core/styles';
import { ServerConfig } from 'api';
import ServerConfigsApi from '../../network/ServerConfigsApi';
import React, { useEffect, useRef, useState } from 'react';
import './styles.css';
import Add from '@material-ui/icons/Add';
import { Modal } from '@material-ui/core';
import CreateEditButton from '../../components/composite/privilege_managed_buttons/CreateEditButton';
import Checkbox from '@material-ui/core/Checkbox';
import AppTextView from '../../components/base/app_text/AppTextView';
import TransactionsApi from '../../network/TransactionsApi';
import AppModal from '../../components/base/app_modal/AppModal';
import AppDatePicker from '../../components/base/app_date_picker/AppDatePicker';
import { smartDate } from 'javascript-dev-kit';
import moment from 'jalali-moment';

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
    onSuccess:(config: ServerConfig)=>void,
    editableItem: ServerConfig
}
function ManageView (props: Props) {
  const { onSuccess, editableItem } = props;
  const classes = useStyles();
  const [config, setConfig] = useState(editableItem);
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [verifyTransactions, setVerifyTransactions] = useState(0);
  console.log('config', config);
  const edit = () => {
    const p = config;
    ServerConfigsApi.patchServerConfigs(p)
      .then((res) => {
        onSuccess(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div style={{ width: '70vw', height: '100vh' }}>
      <GridContainer>
        <GridItem xs={12} sm={12} md={0}>
          <Card>
            <CardHeader color="primary">
              <h4 className={classes.cardTitleWhite}>Server Configs</h4>
              <p className={classes.cardCategoryWhite}>Edit or view server configs</p>
            </CardHeader>

            <CardBody>
              <GridContainer>

                <AppButton progress={verifyTransactions} text={'Verify Transactions'} color={'info'} onClick={() => {
                  setVerifyTransactions(50);
                  TransactionsApi.verifyUnverifiedTransactions().then((res) => {
                    const { data } = res;
                    setVerifyTransactions(100);
                    console.log(data);
                    // https://docs.zarinpal.com/paymentGateway/error.html
                    const text = ''.concat('deposit success = ' + data.deposit.success.length + ' \n')
                      .concat('deposit fails = ' + data.deposit.fails.length + ' \n')
                      .concat('service success = ' + data.services.success.length + ' \n')
                      .concat('services fails = ' + data.services.fails.length);
                    alert(text);
                  }).catch((e) => {
                    console.log(e);
                    setVerifyTransactions(-1);
                  });
                }}/>

                {
                  config.iceServers.map((turn, index) => {
                    return (
                      <Row
                        value={JSON.stringify(turn)}
                        placeholder="Turn Server"
                        type={'name'}
                        onChange={(text) => {
                          config.iceServers[index] = JSON.parse(text);
                          setConfig({ ...config, iceServers: config.iceServers });
                        }}/>
                    );
                  })
                }
                <Row
                  value={config.forceSpeaker}
                  placeholder="Force speaker"
                  type={'name'}
                  onChange={(text) => {
                    setConfig({ ...config, forceSpeaker: JSON.parse(text) });
                  }}/>
                <Row
                  value={JSON.stringify(config.mediaConstraints)}
                  placeholder="Media Constraints"
                  type={'name'}
                  onChange={(text) => {
                    setConfig({ ...config, mediaConstraints: JSON.parse(text) });
                  }}/>
                <Row
                  value={config.termsandconditions}
                  placeholder="Terms & Conditions"
                  type={'name'}
                  onChange={(text) => {
                    setConfig({ ...config, termsandconditions: text });
                  }}/>
                <CardFooter>
                  <CreateEditButton
                    editableItem={config}
                    edit={edit}
                    permission={privileges => privileges.serverConfigs}
                  />
                </CardFooter>

                <DevicesUpdateSection config={config}/>
                <ReservationDateExclusionView config={config}/>

                <CardHeader color="primary" style={{ marginTop: 20, flexDirection: 'row' }}>
                  <AppTextView text={'?????????? ??????????'} className={classes.cardTitleWhite}/>
                  <AppButton color="info" justIcon round style={{ marginRight: 'auto' }} onClick={() => { setCreateModalVisible(true); }}>
                    <Add />
                  </AppButton>
                </CardHeader>

              </GridContainer>
            </CardBody>
          </Card>
        </GridItem>
      </GridContainer>
    </div>

  );
}

const Row = ({ value, placeholder, type = 'text', onChange = undefined as any }) => {
  return (
    <GridItem md={50}>
      <AppInput
        placeholder={placeholder}
        initialvalue={value}
        disabled={!onChange}
        onChange={onChange}
        multiline={true}
        inputProps={{
          disabled: !onChange
        }}
        type={type}
      />
    </GridItem>
  );
};

interface DevicesUpdateSectionProps{
    config: ServerConfig
}
const DevicesUpdateSection = (props:DevicesUpdateSectionProps) => {
  const { config } = props;
  const classes = useStyles();
  const [android, setAndroid] = useState(config.android || { versionCode: '0.0.0', forceUpdate: false, downloadLink: '', changeLog: '' });
  const [ios, setIos] = useState(config.ios || { versionCode: '0.0.0', forceUpdate: false, downloadLink: '', changeLog: '' });
  const [psave, setpsave] = useState(0);

  return (
    <div style={{ flexDirection: 'column', margin: 10 }}>
      <CardHeader color="primary" style={{ marginTop: 20, flexDirection: 'row' }}>
        <AppTextView text={'?????????????? ???? ?????? ??????????'} className={classes.cardTitleWhite}/>
      </CardHeader>

      <AppTextView text={'Android'} style={{ marginTop: 10 }}/>
      <div style={{ backgroundColor: 'white', borderWidth: 2, borderColor: '#26c6da', borderStyle: 'solid', borderRadius: 15 }}>
        <div style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Checkbox
            color={'primary'}
            checked={android.forceUpdate}
            onChange={(e) => {
              setAndroid({
                ...android,
                forceUpdate: e.target.checked
              });
            }}
          />
          <AppTextView text={'Force Update'}/>
        </div>
        <div style={{ flexDirection: 'row', alignItems: 'center' }}>
          <AppInput formControlProps={{ fullWidth: false, style: { marginRight: 10 } }} placeholder={'Version Code'} onChange={t => setAndroid({ ...android, versionCode: t })} initialvalue={android.versionCode}/>
        </div>
        <AppInput formControlProps={{ style: { marginRight: 10, marginLeft: 10 } }} initialvalue={android.downloadLink} placeholder={'Download Link'} onChange={l => setAndroid({ ...android, downloadLink: l })}/>
        <AppInput formControlProps={{ style: { marginRight: 10, marginLeft: 10 } }} initialvalue={android.changeLog} multiline={true} placeholder={'Change Log'} onChange={t => setAndroid({ ...android, changeLog: t })}/>
      </div>
      <AppTextView text={'IOS'} style={{ marginTop: 10 }}/>
      <div style={{ backgroundColor: 'white', borderWidth: 2, borderColor: '#26c6da', borderStyle: 'solid', borderRadius: 15 }}>
        <div style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Checkbox
            color={'primary'}
            checked={ios.forceUpdate}
            onChange={(e) => {
              setIos({
                ...ios,
                forceUpdate: e.target.checked
              });
            }}
          />
          <AppTextView text={'Force Update'}/>
        </div>
        <div style={{ flexDirection: 'row', alignItems: 'center' }}>
          <AppInput formControlProps={{ fullWidth: false, style: { marginRight: 10 } }} placeholder={'Version Code'} onChange={t => setIos({ ...ios, versionCode: t })} initialvalue={ios.versionCode}/>
        </div>
        <AppInput formControlProps={{ style: { marginRight: 10, marginLeft: 10 } }} initialvalue={ios.downloadLink} placeholder={'Download Link'} onChange={l => setIos({ ...ios, downloadLink: l })}/>
        <AppInput formControlProps={{ style: { marginRight: 10, marginLeft: 10 } }} initialvalue={ios.changeLog} multiline={true} placeholder={'Change Log'} onChange={t => setIos({ ...ios, changeLog: t })}/>
      </div>
      <CardFooter>
        <CreateEditButton
          progress={psave}
          editableItem={config}
          edit={() => {
            setpsave(50);
            ServerConfigsApi.patchServerConfigs({ android, ios }).then(() => {
              setpsave(0);
            }).catch((e) => {
              console.log(e);
              setpsave(0);
            });
          }}
          permission={privileges => privileges.serverConfigs}
        />
      </CardFooter>
    </div>
  );
};

const ReservationDateExclusionView = (props: {config: ServerConfig}) => {
  const classes = useStyles();
  const [modalVisible, setModalVisible] = useState(false);
  const [dates, setDates] = useState(props.config.excludedReservationDates);

  const edit = () => {
    ServerConfigsApi.patchServerConfigs({ excludedReservationDates: dates })
      .then((res) => {
        window.location.reload();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div>
      <CardHeader color="primary" style={{ marginTop: 20, flexDirection: 'row' }}>
        <AppTextView text={'?????????????? ?????????? ???????? ?????????? ????????'} className={classes.cardTitleWhite}/>
      </CardHeader>
      <AppButton
        text={'Add Exclusion'}
        onClick={() => setModalVisible(true)}
      />
      {
        dates.map((exc) => {
          return (
            <div style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <AppTextView text={`${exc}`}/>
              <AppButton text={'remove'} onClick={() => {
                setDates([...dates].removeValue(exc));
              }}/>
            </div>
          );
        })
      }
      {
        modalVisible &&
        <AppModal open={modalVisible} onClose={() => setModalVisible(false)}>
          <div style={{ width: '30vw', height: '50vh', alignItems: 'center', justifyContent: 'flex-start' }}>
            <AppDatePicker
              onChange={(date) => {
                setDates([...dates, smartDate(moment(`${date.year}/${date.month}/${date.day} 00:00`, 'jYYYY/jMM/jDD HH:mm').format('jYYYY/jMM/jDD')).formatJalali('jYYYY/jMM/jDD')].uniquify());
                setModalVisible(false);
              }}
              value={Date.now()}
            />
          </div>
        </AppModal>
      }
      <CardFooter>
      <CreateEditButton
        editableItem={props.config}
        edit={edit}
        permission={privileges => privileges.serverConfigs}
      />
      </CardFooter>
    </div>
  );
};

export default React.memo(ManageView);

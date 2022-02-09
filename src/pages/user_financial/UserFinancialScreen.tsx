import React, { useEffect, useState } from 'react';
import Card from '../../components/base/app_card/Card';
import CardHeader from '../../components/base/app_card/CardHeader';
import CardIcon from '../../components/base/app_card/CardIcon';
import { makeStyles } from '@material-ui/core/styles';
import styles from '../../assets/jss/material-dashboard-react/views/dashboardStyle.js';
import GridContainer from '../../components/base/grid/GridContainer';
import TransactionsApi from '../../network/TransactionsApi';
import { FinancialAudit, Transaction, Visit } from 'api';
import Checkbox from '@material-ui/core/Checkbox';
import TransactionsList from '../../components/composite/transactions_list/TransactionsList';
import NavigationHelper from '../../helpers/NavigationHelper';
import { grayColor } from '../../assets/jss/material-dashboard-react';
import jMoment from 'moment-jalaali';
import AppButton from '../../components/base/app_button/AppButton';
import Modal from '@material-ui/core/Modal';
import AppTextView from '../../components/base/app_text/AppTextView';
import AppInput from '../../components/base/app_input/AppInput';
import AppDatePicker from '../../components/base/app_range_date_picker/AppRangeDatePicker';
import AppScrollable from '../../components/base/app_scrollable/AppScrollable';
import { numberWithCommas } from '../../helpers';

jMoment.loadPersian({ dialect: 'persian-modern', usePersianDigits: true });
const oneMonth = 1 * 30 * 24 * 60 * 60 * 1000;

// @ts-ignore
const useStyles = makeStyles(styles);

interface Props {
    id: string,
    type: 'user' | 'healthcenter'
}
function UserFinancialScreen (props: Props) {
  const id = NavigationHelper.getParam(props, 'id');
  const type = NavigationHelper.getParam(props, 'type') as any;
  const [audit, setAudit] = useState(undefined as FinancialAudit | undefined);
  const [settleModalVisible, setSettleModalVisible] = useState(false);
  const [filters, setFilters] = useState({
    from: new Date().getTime() - oneMonth,
    to: new Date().getTime() + oneMonth
  });

  const load = () => {
    TransactionsApi
      .getFinancialAudit(id, type, filters.from, filters.to)
      .then(res => setAudit(res.data))
      .catch(err => console.log(err));
  };

  useEffect(load, [filters]);

  const onSelect = (transaction: Transaction) => {
    NavigationHelper.navigateTo('/transaction', { transactionId: transaction._id });
  };

  const onPay = (total: number, type: string, details: string, trackingCode: string, visits:Visit[]) => {
    TransactionsApi.postSettlement(visits.map(v => v._id), id, type, total, details, trackingCode)
      .then((res) => {
        alert('success');
      }).catch(() => {
        alert('fail');
      });
  };

  return (
    <div style={{ alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: '90vw', height: '100vh' }}>
        <GridContainer>
          <Card>
            <CardHeader color="warning" stats icon>
              <CardIcon color="warning">
                Financial Audit
                <div style={{ marginTop: 'auto', flexDirection: 'row' }}>
                  <AppDatePicker
                    onChange={(start, end) => {
                      setFilters({
                        ...filters,
                        from: start,
                        to: end
                      });
                    }}
                    start={filters.from}
                    end={filters.to}
                  />
                </div>
              </CardIcon>
              {
                audit && <AuditView audit={audit}/>
              }
            </CardHeader>
            <AppButton text={'تصویه حساب'} color={'info'} size={'lg'} onClick={() => {
              audit && setSettleModalVisible(true);
            }}/>
            <TransactionsList id={id} type={type} onSelect={onSelect} fromDate={filters.from} toDate={filters.to}/>
          </Card>
          {
            settleModalVisible && <SettlementModal visits={audit && audit.unsettledVisits} type={type} onPay={onPay} onClose={() => { setSettleModalVisible(false); }}/>
          }
        </GridContainer>
      </div>
    </div>
  );
}

const AuditView = ({ audit }) => {
  const classes = useStyles();
  return (
    <div style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
      <div style={{ margin: '1%', alignItems: 'center' }}>
        <p className={classes.cardCategory}>مجموع هزینه ویزیت ها</p>
        <h1 style={{ fontSize: 25, color: grayColor[2] }}>
          {numberWithCommas(String(audit.total))} <small>T</small>
        </h1>
      </div>
      <div style={{ margin: '1%', alignItems: 'center' }}>
        <p className={classes.cardCategory}>کل مبلغ پرداخت شده به پزشک</p>
        <h1 style={{ fontSize: 25, color: grayColor[2] }}>
          {numberWithCommas(String(audit.paid))} <small>T</small>
        </h1>
      </div>
      <div style={{ margin: '1%', alignItems: 'center' }}>
        <p className={classes.cardCategory}>سهم مطپ</p>
        <h1 style={{ fontSize: 25, color: grayColor[2] }}>
          {numberWithCommas(String(audit.companyCut))} <small>T</small>
        </h1>
      </div>
      <div style={{ margin: '1%', alignItems: 'center' }}>
        <p className={classes.cardCategory}>سهم دکتر</p>
        <h1 style={{ fontSize: 25, color: grayColor[2] }}>
          {numberWithCommas(String(audit.doctorCut))} <small>T</small>
        </h1>
      </div>
      <div style={{ margin: '1%', alignItems: 'center' }}>
        <p className={classes.cardCategory}>میزان تخفیف ها</p>
        <h1 style={{ fontSize: 25, color: grayColor[2] }}>
          {numberWithCommas(String(audit.discountAmounts))} <small>T</small>
        </h1>
      </div>
      <div style={{ margin: '1%', alignItems: 'center' }}>
        <p className={classes.cardCategory}>سهم بیمارستان</p>
        <h1 style={{ fontSize: 25, color: grayColor[2] }}>
          {numberWithCommas(String(audit.medicalCenterCut))} <small>T</small>
        </h1>
      </div>
      <div style={{ margin: '1%', alignItems: 'center' }}>
        <p className={classes.cardCategory}>قابل پرداخت</p>
        <h1 style={{ fontSize: 25, color: grayColor[2] }}>
          {numberWithCommas(String(audit.payable))} <small>T</small>
        </h1>
      </div>
    </div>
  );
};

const SettlementModal = ({ visits, type, onClose, onPay }) => {
  const [selection, setSelection] = useState([...visits]);
  const [details, setDetails] = useState('');
  const [trackingCode, setTrackingCode] = useState('');

  const total = selection.map(v => type === 'user' ? v.receipt.doctorCut : v.receipt.healthCenterCut).reduce((a, b) => a + b, 0);

  return (
    <Modal style={{ width: '50vw', height: '80vh', margin: 'auto', justifyContent: 'center' }} open={true} onClose={onClose}>
      <AppScrollable style={{ backgroundColor: 'white', borderRadius: 7, padding: 10, alignItems: 'center', justifyContent: 'center' }}>
        <CardHeader color="warning" stats icon>
          <CardIcon color="warning">
                    Settlement
          </CardIcon>
        </CardHeader>

        <div style={{ width: '100%', marginTop: 5, 'overflow-y': 'scroll', overflowX: 'hidden' }}>
          {
            visits.map((visit: Visit) => {
              return (
                <div style={{ flexDirection: 'row', width: '100%', margin: 2, justifyContent: 'space-between', alignItems: 'center', border: '1px solid gray', borderRadius: 5 }}>
                  <AppTextView
                    style={{ marginLeft: 10 }}
                    text={(type === 'user' ? visit.receipt.doctorCut : visit.receipt.healthCenterCut) + ' تومان '}
                  />
                  <Checkbox
                    checked={selection.includes(visit)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        !selection.includes(visit) && setSelection([...selection, visit]);
                      } else {
                        const s = [...selection];
                        s.splice(s.indexOf(visit), 1);
                        setSelection(s);
                      }
                    }}
                  />
                </div>
              );
            })
          }
        </div>
        <AppTextView
          style={{ margin: 20 }}
          fontSize={20}
          text={total + ' تومان '}
        />
        <AppInput
          type={'number'}
          placeholder={'کد رهگیری'}
          onChange={(text) => {
            setTrackingCode(text);
          }}
        />
        <AppInput
          placeholder={'توضیحات'}
          onChange={(text) => {
            setDetails(text);
          }}
          multiline={true}
        />
        <AppButton
          color={'primary'}
          text={'پرداخت'}
          onClick={() => {
            onClose();
            onPay(total, type, details, trackingCode, selection);
          }}
        />
      </AppScrollable>
    </Modal>
  );
};

export default React.memo(UserFinancialScreen);

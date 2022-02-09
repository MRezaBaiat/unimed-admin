import React, { useState } from 'react';
import Dialog from '@material-ui/core/Dialog';
import GridItem from 'src/components/base/grid/GridItem';
import CardFooter from 'src/components/base/app_card/CardFooter';
import Card from 'src/components/base/app_card/Card';
import CardHeader from 'src/components/base/app_card/CardHeader';
import CardIcon from 'src/components/base/app_card/CardIcon';
import { Icon, Modal } from '@material-ui/core';
import GridContainer from 'src/components/base/grid/GridContainer';
import styles from './styles';
import { makeStyles } from '@material-ui/core/styles';
import AppInput from '../../components/base/app_input/AppInput';
import AppButton from '../../components/base/app_button/AppButton';
import TransactionsApi from '../../network/TransactionsApi';
import { TransactionType } from 'api';

// @ts-ignore
const useStyles = makeStyles(styles);

interface Props {
    onClose:()=>void,
    onSuccess:()=>void,
    userId: string,
    name:string
}
function CurrencyChargeDialog (props: Props) {
  const { onClose, onSuccess, userId, name } = props;
  const classes = useStyles();
  const [amount, setAmount] = useState(0);
  const [note, setNote] = useState('');

  const increase = async () => {
    TransactionsApi.sendTransaction(userId, { amount, hint: note, type: TransactionType.CHARGE_BY_ADMIN })
      .then((res) => {
        onSuccess();
      }).catch(err => {
        console.log(err);
      });
  };

  const decrease = () => {
    TransactionsApi.sendTransaction(userId, { amount, hint: note, type: TransactionType.REDUCE_BY_ADMIN })
      .then((res) => {
        onSuccess();
      }).catch(err => {
        console.log(err);
      });
  };

  return (
    <Modal style={{ alignItems: 'center', justifyContent: 'center' }} onClose={onClose} open={true}>
      <GridContainer>
        <GridItem>
          <Card style={{ width: '50vw' }}>
            <CardHeader color="warning" stats icon>
              <CardIcon color="warning">
                <h3 className={classes.cardTitle}>
                      Change currency for {name}
                </h3>
              </CardIcon>
            </CardHeader>
            <GridItem md={50}>
              <AppInput
                placeholder={'Amount'}
                initialvalue={String(amount)}
                onChange={(text) => { setAmount(Number(text)); }}
              />
              <AppInput
                placeholder={'Note'}
                initialvalue={note}
                inputProps={{
                  multiline: true,
                  rows: 5
                }}
                onChange={(text) => { setNote(text); }}
              />
            </GridItem>
            <CardFooter stats>
              <AppButton color="primary" text={'Increase'} onClick={increase}/>
              <AppButton color="primary" text={'Reduce'} onClick={decrease}/>
            </CardFooter>
          </Card>
        </GridItem>
      </GridContainer>
    </Modal>
  );
}

export default React.memo(CurrencyChargeDialog);

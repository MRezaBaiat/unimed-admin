import React, { useEffect, useState } from 'react';
import ManageView from './ManageView';
import NavigationHelper from '../../helpers/NavigationHelper';
import TransactionsApi from '../../network/TransactionsApi';
import { Transaction } from 'api';

interface Props {
    transactionId: string
}
function TransactionDetailsScreen (props: Props) {
  const transactionId = NavigationHelper.getParam(props, 'transactionId');
  const [transaction, setTransaction] = useState(undefined as Transaction | undefined);

  useEffect(() => {
    TransactionsApi.getTransaction(transactionId).then((res) => {
      setTransaction(res.data);
    }).catch(err => {
      console.log(err);
    });
  }, []);

  if (!transaction) {
    return null;
  }
  return (
    <div style={{ alignItems: 'center', justifyContent: 'center' }}>
      <ManageView editableItem={transaction}/>
    </div>
  );
}

export default React.memo(TransactionDetailsScreen);

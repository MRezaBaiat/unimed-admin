import React, { useEffect, useState } from 'react';
import { QueryResponse, Transaction, TransactionType } from 'api';
import GridContainer from '../../base/grid/GridContainer';
import GridItem from '../../base/grid/GridItem';
import Card from '../../base/app_card/Card';
import CardHeader from '../../base/app_card/CardHeader';
import CardBody from '../../base/app_card/CardBody';
import AppTable from '../../base/app_table/AppTable';
import styles from '../../../assets/jss/material-dashboard-react/components/listStyles';
import { makeStyles } from '@material-ui/core/styles';
import TransactionsApi from '../../../network/TransactionsApi';
import AppPagination from '../../base/app_pagination/AppPagination';
import AppButton from '../../base/app_button/AppButton';
import Search from '@material-ui/icons/Search';
import AppInput from '../../base/app_input/AppInput';
import SearchView from '../search_view/SearchView';
import { formatDateShamsi } from '../../../helpers';

// @ts-ignore
const useStyles = makeStyles(styles);

interface Props {
    id: string,
    type: 'user' | 'healthcenter',
    onSelect?:(transaction: Transaction)=>void,
    fromDate:number,
    toDate:number
}
function TransactionsList (props: Props) {
  const { onSelect, id, type, fromDate, toDate } = props;
  const classes = useStyles();
  const [searchText, setSearchText] = useState('');
  const [data, setData] = useState({ results: [], total: 0, maxPageIndex: 0, currentPageIndex: 0 } as QueryResponse<Transaction>);
  const [pageIndex, setPageIndex] = useState(0);

  const limit = 10;

  const load = () => {
    TransactionsApi
      .getTransactions(id, type, pageIndex * limit, limit, searchText, fromDate, toDate)
      .then(res => setData(res.data))
      .catch(err => console.log(err));
  };

  useEffect(load, [pageIndex, fromDate, toDate]);

  const columns : any = data.results.map((value) => {
    const columnStyle = { color: getColorForType(value.type) };
    return { keys: [<text style={columnStyle}>{value.type}</text>, value.amount, value.discount, value.issuer.name, value.target.name, value.tracking_code, formatDateShamsi(value.date)], value };
  });

  return (
    <GridContainer>
      <GridItem xs={12} sm={12} md={12}>
        <Card>
          {/* <CardHeader style={{ flexDirection: 'row-reverse', justifyContent: 'space-between', alignItems: 'space-between' }} color="primary">
            <div>
              <h4 className={classes.cardTitleWhite}>Transactions Table</h4>
              <p className={classes.cardCategoryWhite}>
                List of transactions related to the user or health center
              </p>
            </div>
            <SearchView
              onChange={setSearchText}
              onClick={load}
            />
          </CardHeader> */}
          <CardBody>
            <AppTable
              onClick={onSelect}
              tableHeaderColor="primary"
              tableHead={['Type', 'Amount', 'Discount', 'Issuer', 'Target', 'Tracking Code', 'Date']}
              tableData={columns}
            />
            <AppPagination
              maxPageIndex={data.maxPageIndex}
              onChange={setPageIndex}
            />
          </CardBody>
        </Card>
      </GridItem>
    </GridContainer>
  );
}

const getColorForType = (type: TransactionType) => {
  switch (type) {
    case TransactionType.CHARGE_BY_ADMIN:
      return 'darkgreen';
    case TransactionType.CHARGE_BY_GATEWAY:
      return 'green';
    case TransactionType.PAYROLL:
      return 'blue';
    case TransactionType.REDUCE_BY_ADMIN:
      return 'red';
    case TransactionType.STARTER_CHARGE:
      return 'black';
    case TransactionType.VISIT_PAYMENT:
      return 'orange';
    case TransactionType.RETURN_VISIT_PAYMENT:
      return '#50BCBD';
    default:
      return 'black';
  }
};

export default React.memo(TransactionsList);

import React, { useEffect, useState } from 'react';
import AppButton from '../../base/app_button/AppButton';
import { QueryResponse } from 'api';
import AppTextView from '../../base/app_text/AppTextView';
import GridItem from '../../base/grid/GridItem';
import Card from '../../base/app_card/Card';
import CardHeader from '../../base/app_card/CardHeader';
import CardBody from '../../base/app_card/CardBody';
import AppTable from '../../base/app_table/AppTable';
import GridContainer from '../../base/grid/GridContainer';
import styles from '../../../assets/jss/material-dashboard-react/components/listStyles';
import { makeStyles } from '@material-ui/core/styles';
import AppPagination from '../../base/app_pagination/AppPagination';
import SearchView from '../search_view/SearchView';
import TransactionsApi from '../../../network/TransactionsApi';
import AppDropdownMenu from '../../base/app_dropdown/AppDropdownMenu';
import AppDatePicker from '../../base/app_range_date_picker/AppRangeDatePicker';
import { exportToCSV } from '../../../helpers/Utils';

// @ts-ignore
const useStyles = makeStyles(styles);

const oneMonth = 1 * 30 * 24 * 60 * 60 * 1000;
let filters = {
  from: new Date().getTime() - oneMonth,
  to: new Date().getTime() + oneMonth
};
interface Props {
    onSelect?:(id: string, type:'user' | 'healthcenter')=>void
}
function AccountingsList (props: Props) {
  const { onSelect } = props;
  const [searchText, setSearchText] = useState('');
  const [type, setType] = useState('user' as 'user' | 'healthcenter');
  const [data, setData] = useState({ results: [], maxPageIndex: 0, total: 0, currentPageIndex: 0 } as QueryResponse<{_id:string, name:string, payable:number}>);
  const [pageIndex, setPageIndex] = useState(0);
  const limit = 50;

  const load = () => {
    TransactionsApi.getAccountings(pageIndex * limit, limit, searchText, filters.from, filters.to, type)
      .then(res => setData(res.data))
      .catch(err => console.log(err));
  };

  useEffect(load, [pageIndex, type]);

  const classes = useStyles();
  // @ts-ignore
  const columns : any = data.results.map((value) => {
    return { keys: [value.payable + ' تومان', value.name], value };
  });

  return (
    <GridContainer>
      <GridItem xs={12} sm={12} md={12}>
        <Card>
          <CardHeader style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'space-between' }} color="primary">
            <div>
              <h4 className={classes.cardTitleWhite}>لیست حسابداری</h4>
              <p className={classes.cardCategoryWhite}>
                                مدیریت حسابداری کاربرها و مراکز سلامتی
              </p>
            </div>
            {/* <SearchView
              onChange={setSearchText}
              onClick={load}
            /> */}
            <div style={{ marginTop: 'auto', flexDirection: 'row' }}>
              <AppDatePicker
                onChange={(start, end) => {
                  filters = {
                    from: start,
                    to: end
                  };
                }}
                start={filters.from}
                end={filters.to}
              />
            </div>
            <SearchView
              onClick={load}
              onChange={setSearchText}
            />
          </CardHeader>
          <AppDropdownMenu
            initialValue={type}
            items={[{ text: 'کابران', value: 'user' }, { text: 'مراکز سلامتی', value: 'healthcenter' }]}
            onClick={(value) => {
              setPageIndex(0);
              setType(value);
            }}
          />
          <CardBody>
            <AppTable
              tableHeaderColor="primary"
              onClick={(value) => {
                onSelect && onSelect(value._id, type);
              }}
              tableHead={['Payable', 'Name']}
              tableData={columns}
            />
            <AppPagination
              maxPageIndex={data.maxPageIndex}
              onChange={setPageIndex}
            />
          </CardBody>
        </Card>
      </GridItem>
      {
        data &&
        <Download type={type} searchText={searchText}/>
      }
    </GridContainer>
  );
}

const Download = ({ type, searchText }) => {
  const download = () => {
    TransactionsApi.getAccountings(0, Number.MAX_SAFE_INTEGER, searchText, filters.from, filters.to, type)
      .then(res => {
        const exportables = res.data.results.map((value) => {
          return {
            نام: value.name,
            'قابل پرداخت': value.payable
          };
        });
        exportToCSV(exportables, 'AccountingsList');
      })
      .catch(err => console.log(err));
  };

  return <AppButton color={'primary'} text={'دانلود فایل excel'} onClick={download}/>;
};

export default React.memo(AccountingsList);

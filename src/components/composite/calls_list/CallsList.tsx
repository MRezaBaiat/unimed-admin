import React, { useEffect, useState } from 'react';
import { Conference, QueryResponse } from 'api';
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
import ConferenceApi from '../../../network/ConferenceApi';
import { smartDate } from 'javascript-dev-kit';
import AppDatePicker from '../../base/app_range_date_picker/AppRangeDatePicker';

// @ts-ignore
const useStyles = makeStyles(styles);

const oneMonth = 1 * 30 * 24 * 60 * 60 * 1000;
let filters = {
  from: new Date().getTime() - oneMonth,
  to: new Date().getTime() + oneMonth
};
const setFilters = (f) => {
  filters = f;
};

interface Props {
  onSelect?:(conference: Conference)=>void,
  userId?: string
}
function CallsList (props: Props) {
  const { onSelect, userId } = props;
  const [searchText, setSearchText] = useState('');
  const [data, setData] = useState({ results: [], maxPageIndex: 0, total: 0, currentPageIndex: 0 } as QueryResponse<Conference>);
  const [pageIndex, setPageIndex] = useState(0);
  const limit = 50;
  const load = () => {
    ConferenceApi.query(pageIndex * limit, limit, filters.from, filters.to, searchText, userId)
      .then(res => setData(res.data as any))
      .catch(err => console.log(err));
  };

  useEffect(load, [pageIndex]);

  const classes = useStyles();
  const columns : any = data.results.map((value) => {
    const conference: Conference = value;
    return { keys: [conference.state, smartDate(conference.createdAt).formatJalali(), `${conference.initiator.mobile} (${conference.initiator.name})`, `${conference.receiver.mobile} (${conference.receiver.name})`], value };
  });

  return (
    <GridContainer>
      <GridItem xs={12} sm={12} md={12}>
  <Card>
    <CardHeader style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'space-between' }} color="primary">
  <div>
    <h4 className={classes.cardTitleWhite}>لیست تماس ها</h4>
  <p className={classes.cardCategoryWhite}>
    مدیریت تماس های کاربران
  </p>
  </div>

      <div style={{ marginTop: 'auto', flexDirection: 'row' }}>
        <AppTextView
          textColor={'black'}
          text={'جستجو در تاریخ : '}
          style={{ marginLeft: 10 }}
        />
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
  <SearchView
    onChange={setSearchText}
    onClick={load}
  />
  </CardHeader>
  <CardBody>
  <AppTable
    tableHeaderColor="primary"
    onClick={onSelect}
    tableHead={['State', 'Created at', 'Initiator', 'Receiver']}
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

export default React.memo(CallsList);

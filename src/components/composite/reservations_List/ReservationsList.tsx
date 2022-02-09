import React, { useEffect, useState } from 'react';
import GridContainer from '../../base/grid/GridContainer';
import GridItem from '../../base/grid/GridItem';
import Card from '../../base/app_card/Card';
import CardHeader from '../../base/app_card/CardHeader';
import CardBody from '../../base/app_card/CardBody';
import AppTable from '../../base/app_table/AppTable';
import { makeStyles } from '@material-ui/core/styles';
import AppPagination from '../../base/app_pagination/AppPagination';
import styles from '../../../assets/jss/material-dashboard-react/components/listStyles';
import SearchView from '../search_view/SearchView';
import {
  Colors,
  Notification,
  QueryResponse,
  Reservation,
  Translations,
  Visit,
  VisitStatus
} from 'api';
import { formatDateShamsi } from '../../../helpers';
import NotificationsApi from '../../../network/NotificationsApi';
import ReservationsApi from '../../../network/ReservationsApi';
import VisitsApi from '../../../network/VisitsApi';
import AppTextView from '../../base/app_text/AppTextView';
import AppDatePicker from '../../base/app_range_date_picker/AppRangeDatePicker';
import AppDropdownMenu from '../../base/app_dropdown/AppDropdownMenu';
import { smartDate } from 'javascript-dev-kit';

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
  onSelect?:(reservation: Reservation)=>void
}
function ReservationsList (props: Props) {
  const { onSelect } = props;
  const classes = useStyles();
  const [searchText, setSearchText] = useState('');
  const [data, setData] = useState({ results: [], total: 0, maxPageIndex: 0, currentPageIndex: 0 } as QueryResponse<Reservation>);
  const [pageIndex, setPageIndex] = useState(0);

  const limit = 20;
  const load = () => {
    ReservationsApi
      .query(pageIndex * limit, limit, filters.from, filters.to, searchText)
      .then(res => setData(res.data))
      .catch(err => console.log(err));
  };

  useEffect(load, [pageIndex]);

  console.log(data);

  const columns : any = data.results.map((value) => {
    return { keys: [value.doctor.name, value.issuer.type === 'user' ? value.issuer.user.name : value.issuer.admin.name, smartDate(value.due.date.from).formatJalali(), <AppTextView text={Translations.reservations[value.state]} textColor={Colors.reservations[value.state]}/>], value };
  });

  return (
    <GridContainer>
      <GridItem xs={12} sm={12} md={12}>
        <Card>
          <CardHeader style={{ flexDirection: 'column', justifyContent: 'space-between', alignItems: 'space-between' }} color="primary">
            <div>
              <h4 className={classes.cardTitleWhite}>لیست رزروها {'(' + (data && data.total) + ')'}</h4>
              <p className={classes.cardCategoryWhite}>
                مدیریت و جستجوی رزروهای قدیم و جدید
              </p>
            </div>
            <div style={{ flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between' }}>
              <AppTextView
                textColor={'black'}
                text={'جستجو در تاریخ : '}
              />
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
              <SearchView
                onClick={load}
                onChange={setSearchText}
              />
            </div>
          </CardHeader>
          <CardBody>
            <AppTable
              onClick={onSelect}
              tableHeaderColor="primary"
              tableHead={['پزشک', 'بیمار', 'شروع', 'وضعیت']}
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

export default React.memo(ReservationsList);

import React, { useEffect, useState } from 'react';
import { QueryResponse, Visit, VisitStatus } from 'api';
import GridContainer from '../../base/grid/GridContainer';
import GridItem from '../../base/grid/GridItem';
import Card from '../../base/app_card/Card';
import CardHeader from '../../base/app_card/CardHeader';
import CardBody from '../../base/app_card/CardBody';
import AppTable from '../../base/app_table/AppTable';
import { makeStyles } from '@material-ui/core/styles';
import AppPagination from '../../base/app_pagination/AppPagination';
import VisitsApi from '../../../network/VisitsApi';
import styles from '../../../assets/jss/material-dashboard-react/components/listStyles';
import SearchView from '../search_view/SearchView';
import { formatDateShamsi } from '../../../helpers';
import { exportToCSV } from '../../../helpers/Utils';
import AppDropdownMenu from '../../base/app_dropdown/AppDropdownMenu';
import AppTextView from '../../base/app_text/AppTextView';
import AppButton from '../../base/app_button/AppButton';
import AppDatePicker from '../../base/app_range_date_picker/AppRangeDatePicker';
import SurveysApi from '../../../network/SurveysApi';

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
    userId?: string,
    onSelect?:(visit: Visit)=>void
}
function SurveysList (props: Props) {
  const { onSelect, userId } = props;
  const classes = useStyles();
  const [searchText, setSearchText] = useState('');
  const [data, setData] = useState({ results: [], currentPageIndex: 0, maxPageIndex: 0, total: 0 } as QueryResponse<Visit>);
  const [pageIndex, setPageIndex] = useState(0);

  const limit = 10;
  const load = () => {
    SurveysApi
      .querySurveys(pageIndex * limit, limit, { from: filters.from, to: filters.to, search: searchText })
      .then(res => setData(res.data))
      .catch(err => console.log(err));
  };

  useEffect(load, [pageIndex]);

  console.log(data.results);

  const columns : any = data.results.map((value) => {
    const { rating } = value;
    return { keys: [rating.doctorDetailedConsequences + rating.doctorDetailsClearity + rating.doctorSolutions + rating.environmentDetails + rating.serviceQuality + rating.videoCallSatisfaction, value._id], value };
  });

  return (
    <GridContainer>
      <GridItem xs={12} sm={12} md={12}>
        <Card>
          <CardHeader style={{ flexDirection: 'column', justifyContent: 'space-between', alignItems: 'space-between' }} color="primary">
            <div>
              <h4 className={classes.cardTitleWhite}>لیست نظر سنجی ها {'(' + (data && data.total) + ')'}</h4>
              <p className={classes.cardCategoryWhite}>
                                مدیریت و جستجوی نظرسنجی ها
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
              tableHead={['Sum', 'id']}
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

export default React.memo(SurveysList);

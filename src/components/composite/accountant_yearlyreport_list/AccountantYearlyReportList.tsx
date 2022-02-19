import React, { useEffect, useState } from 'react';
import AppButton from '../../base/app_button/AppButton';
import { QueryResponse, VisitStatus } from 'api';
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
import { convertToDate, exportToCSV, formatDateShamsi } from '../../../helpers/Utils';
import AppDatePicker from '../../base/app_range_date_picker/AppRangeDatePicker';
import AppTextView from '../../base/app_text/AppTextView';
import AppDropdownMenu from '../../base/app_dropdown/AppDropdownMenu';
import moment from 'moment-jalali';
import { smartDate } from 'javascript-dev-kit';

// @ts-ignore
const useStyles = makeStyles(styles);

let filters = {
  from: moment().jYear(1399).jMonth(1).jDate(1).hour(0).minute(0).toDate().getTime(),
  to: moment().jYear(1399).jMonth(12).jDate(30).hour(24).minute(59).toDate().getTime()
};
function AccountantYearlyReportsList () {
  const [searchText, setSearchText] = useState('');
  const [type, setType] = useState('user' as 'user' | 'healthcenter');
  const [data, setData] = useState({ results: [], total: 0, maxPageIndex: 0, currentPageIndex: 0 } as QueryResponse<{ userId: string, name: string, monthsDatas: any}>);
  const [pageIndex, setPageIndex] = useState(0);
  const limit = 50;

  const load = () => {
    TransactionsApi.getReports(pageIndex * limit, limit, searchText, filters.from, filters.to, type)
      .then(res => {
        console.log(res);
        // @ts-ignore
        res.data.results = res.data.results.map((value) => {
          const monthsDatas = {};
          [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].forEach((k) => {
            monthsDatas[k] = { successful: 0, cancelled: 0 };
          });
          value.visits.forEach((visit) => {
            const month = smartDate(visit.endDate).jMonth();
            console.log(month);
            if (visit.state === VisitStatus.CANCELLED) {
              monthsDatas[month].cancelled += 1;
            } else if (visit.state === VisitStatus.ENDED) {
              monthsDatas[month].successful += 1;
            }
          });
          return { userId: value._id, name: value.name, monthsDatas };
        });
        // @ts-ignore
        setData(res.data);
      })
      .catch(err => console.log(err));
  };

  useEffect(load, [pageIndex]);

  const classes = useStyles();
  // @ts-ignore
  const columns : any = data.results.map((value) => {
    const { monthsDatas } = value;
    const keys: any[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((month) => {
      const findColor = (now, before, higherBetter) => {
        if (now === 0) {
          return '#A9A9A9';
        }
        if (before === undefined || now === before) {
          return 'black';
        }
        if (higherBetter) {
          if (now > before) {
            return 'green';
          } else {
            return 'red';
          }
        } else {
          if (now > before) {
            return 'red';
          } else {
            return 'green';
          }
        }
      };
      return <div style={{ flexDirection: 'column', justfiyContent: 'flex-end' }}>
        <AppTextView text={`✔ : ${monthsDatas[month].successful}`} textColor={findColor(monthsDatas[month].successful, month > 1 ? monthsDatas[month - 1].successful : undefined, true)}/>
        <AppTextView text={`✘ : ${monthsDatas[month].cancelled}`} textColor={findColor(monthsDatas[month].cancelled, month > 1 ? monthsDatas[month - 1].cancelled : undefined, false)}/>
      </div>;
    });
    keys.push(value.name);
    return {
      keys,
      value
    };
  });

  return (
    <GridContainer>
      <GridItem xs={12} sm={12} md={12}>
        <Card>
          <CardHeader style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'space-between' }} color="primary">
            <div>
              <h4 className={classes.cardTitleWhite}>گزارش سالیانه</h4>
              <p className={classes.cardCategoryWhite}>
                  گزارش سالیانه پزشکان و مراکز پزشکی
              </p>
            </div>
            {/* <SearchView
              onChange={setSearchText}
              onClick={load}
            /> */}
            <div style={{ marginTop: 'auto', flexDirection: 'row' }}>
              <AppDropdownMenu
                items={[{ text: '1399', value: 1399 }, { text: '1400', value: 1400 }, { text: '1401', value: 1401 }, { text: '1402', value: 1402 }]}
                initialValue={1399}
                onClick={(value) => {
                  filters = {
                    from: moment().jYear(value).jMonth(1).jDate(1).hour(0).minute(0).toDate().getTime(),
                    to: moment().jYear(value).jMonth(12).jDate(30).hour(24).minute(59).toDate().getTime()
                  };
                }}
              />

            </div>
            <SearchView
              onClick={load}
              onChange={setSearchText}
            />
          </CardHeader>
          <CardBody>
            <AppTable
              tableHeaderColor="primary"
              onClick={(value) => {}}
              tableHead={['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', 'Name']}
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
    TransactionsApi.getReports(0, Number.MAX_SAFE_INTEGER, searchText, filters.from, filters.to, type)
      .then(res => {
        const exportables = res.data.results.map((value) => {
          return {
            نام: value.name,
            'هزینه ویزیت ها': value.total,
            'تعداد ویزیت ها': value.totalVisits
          };
        });
        exportToCSV(exportables, 'AccountantReportsList');
      })
      .catch(err => console.log(err));
  };

  return <AppButton color={'primary'} text={'دانلود فایل excel'} onClick={download}/>;
};

export default React.memo(AccountantYearlyReportsList);

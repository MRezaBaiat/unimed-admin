import React, { useEffect, useState } from 'react';
import AppButton from '../../base/app_button/AppButton';
import { QueryResponse, Visit, VisitStatus } from 'api';
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
import { exportToCSV } from '../../../helpers/Utils';
import AppDatePicker from '../../base/app_range_date_picker/AppRangeDatePicker';
import { numberWithCommas } from '../../../helpers';

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
function AccountantReportsList (props: Props) {
  const { onSelect } = props;
  const [searchText, setSearchText] = useState('');
  const [type, setType] = useState('user' as 'user' | 'healthcenter');
  const [data, setData] = useState({ results: [], currentPageIndex: 0, maxPageIndex: 0, total: 0 } as QueryResponse<{_id:string, name:string, total: number, totalVisits:number, visits: Visit[]}>);
  const [pageIndex, setPageIndex] = useState(0);
  const limit = 50;

  const load = () => {
    TransactionsApi.getReports(pageIndex * limit, limit, searchText, filters.from, filters.to, type)
      .then(res => {
        setData(res.data);
      })
      .catch(err => console.log(err));
  };

  useEffect(load, [pageIndex, type]);

  const classes = useStyles();
  // @ts-ignore
  const columns : any = data.results.map((value) => {
    return { keys: [value.visits.filter(v => v.state === VisitStatus.ENDED).length, value.total + ' ??????????', value.name], value };
  });

  return (
    <GridContainer>
      <GridItem xs={12} sm={12} md={12}>
        <Card>
          <CardHeader style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'space-between' }} color="primary">
            <div>
              <h4 className={classes.cardTitleWhite}>???????? ??????????????</h4>
              <p className={classes.cardCategoryWhite}>
                                ?????????? ???????????????? ?????????????? ?? ?????????? ????????????
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
            items={[{ text: '????????????', value: 'user' }, { text: '?????????? ????????????', value: 'healthcenter' }]}
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
              tableHead={['Visits', 'Total', 'Name']}
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
    alert('?????????? ????????????...');
    TransactionsApi.getReports(0, Number.MAX_SAFE_INTEGER, searchText, filters.from, filters.to, type)
      .then(async res => {
        const exportables = [];
        for (const value of res.data.results) {
          const detailsRes = await TransactionsApi.getFinancialAudit(value._id, type, filters.from, filters.to);
          const audit = detailsRes.data;
          exportables.push({
            // @ts-ignore
            ??????: value.name,
            // @ts-ignore
            '?????????? ?????????? ????': value.total,
            // @ts-ignore
            '?????????? ?????????? ????': value.visits.filter(s => s.state === VisitStatus.ENDED).length,
            // @ts-ignore
            '?????????? ?????????? ?????????? ????': numberWithCommas(String(audit.total)),
            // @ts-ignore
            '???? ???????? ???????????? ?????? ???? ????????': numberWithCommas(String(audit.paid)),
            // @ts-ignore
            '?????? ??????': numberWithCommas(String(audit.companyCut)),
            // @ts-ignore
            '?????? ????????': numberWithCommas(String(audit.doctorCut)),
            // @ts-ignore
            '?????????? ?????????? ????': numberWithCommas(String(audit.discountAmounts)),
            // @ts-ignore
            '?????? ??????????????????': numberWithCommas(String(audit.medicalCenterCut)),
            // @ts-ignore
            '???????? ????????????': numberWithCommas(String(audit.payable))
          });
        }
        exportToCSV(exportables, 'AccountantReportsList');
      })
      .catch(err => console.log(err));
  };

  return <AppButton color={'primary'} text={'???????????? ???????? excel'} onClick={download}/>;
};

export default React.memo(AccountantReportsList);

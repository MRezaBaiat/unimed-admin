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

// @ts-ignore
const useStyles = makeStyles(styles);

const oneMonth = 1 * 30 * 24 * 60 * 60 * 1000;
let filters = {
  from: new Date().getTime() - oneMonth,
  to: new Date().getTime() + oneMonth,
  moneyReturned: undefined,
  visitStatus: undefined,
  discount: undefined
};
const setFilters = (f) => {
  filters = f;
};

interface Props {
    userId?: string,
    onSelect?:(visit: Visit)=>void
}
function VisitsList (props: Props) {
  const { onSelect, userId } = props;
  const classes = useStyles();
  const [searchText, setSearchText] = useState('');
  const [data, setData] = useState({ results: [], total: 0, maxPageIndex: 0, currentPageIndex: 0, uniquePatients: 0, uniqueDoctors: 0 } as QueryResponse<Visit>& {uniquePatients: number, uniqueDoctors: number});
  const [pageIndex, setPageIndex] = useState(0);

  const limit = 20;
  const load = () => {
    VisitsApi
      .getAllVisits(userId, pageIndex * limit, limit, { discount: filters.discount, visitStatus: filters.visitStatus, moneyReturned: filters.moneyReturned, from: filters.from, to: filters.to, search: searchText })
      .then(res => setData(res.data))
      .catch(err => console.log(err));
  };

  useEffect(load, [pageIndex]);

  console.log(data);

  const columns : any = data.results.map((value) => {
    value.patient = value.patient || { mobile: 'Deleted User!' };
    value.doctor = value.doctor || { name: 'Deleted User!' };
    return { keys: [value.receipt?.returnTransactionId ? 'yes' : 'no', value.patient.name ? value.patient.name : value.patient.mobile, value.doctor.name, formatDateShamsi(value.createdAt), formatDateShamsi(value.startDate), value.state !== VisitStatus.ENDED && value.chatting ? 'CHATTING' : value.state], value };
  });

  return (
    <GridContainer>
      <GridItem xs={12} sm={12} md={12}>
        <Card>
          <CardHeader style={{ flexDirection: 'column', justifyContent: 'space-between', alignItems: 'space-between' }} color="primary">
            <div>
              <h4 className={classes.cardTitleWhite}>لیست ویزیت ها - {`${(data && data.total)} ویزیت توسط ${data.uniqueDoctors} پزشک و ${data.uniquePatients} بیمار `}</h4>
              <p className={classes.cardCategoryWhite}>
                                مدیریت و جستجوی ویزیت های قدیم و جدید
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
              <AppDropdownMenu
                title={'برگشت هزینه'}
                style={{ marginBottom: -20, maxWidth: 150 }}
                fontSize={15}
                initialValue={filters.moneyReturned}
                items={[
                  { text: 'همه', value: undefined },
                  { text: 'فقط بازگشت داده شده', value: 'true' },
                  { text: 'فقط بازگشت داده نشده', value: 'false' }
                ]}
                onClick={(value) => {
                  setFilters({ ...filters, moneyReturned: value });
                }}
              />

              <AppDropdownMenu
                title={'وضعیت ویزیت'}
                style={{ marginBottom: -20, maxWidth: 150 }}
                initialValue={filters.visitStatus}
                items={[
                  { text: 'همه', value: undefined },
                  { text: VisitStatus.CANCELLED, value: VisitStatus.CANCELLED },
                  { text: VisitStatus.ENDED, value: VisitStatus.ENDED },
                  { text: VisitStatus.IN_QUEUE, value: VisitStatus.IN_QUEUE },
                  { text: VisitStatus.STARTED, value: VisitStatus.STARTED }
                ]}
                onClick={(value) => {
                  setFilters({ ...filters, visitStatus: value });
                }}
              />
              <AppDropdownMenu
                title={'وضعیت تخفیف'}
                style={{ marginBottom: -20, maxWidth: 150 }}
                initialValue={filters.discount}
                items={[
                  { text: 'همه', value: undefined },
                  { text: 'فقط تخفیف دار ها', value: 'true' },
                  { text: 'فقط بدون تخفیف ها', value: 'false' }
                ]}
                onClick={(value) => {
                  setFilters({ ...filters, discount: value });
                }}
              />
              <SearchView
                onClick={load}
                onChange={setSearchText}
              />
            </div>

            {/* <MuiPickersUtilsProvider utils={JalaliUtils} locale="fa">
              <KeyboardDatePicker
                clearable
                okLabel="تأیید"
                cancelLabel="لغو"
                clearLabel="پاک کردن"
                labelFunc={date => (date ? date.format('jYYYY/jMM/jDD') : '')}
                value={filters.from}
                onChange={() => {}}
              />
            </MuiPickersUtilsProvider> */}
          </CardHeader>
          <CardBody>
            <AppTable
              onClick={onSelect}
              tableHeaderColor="primary"
              tableHead={['Money Returned', 'Patient', 'Doctor', 'Initiate Date', 'Start Date', 'State']}
              tableData={columns}
            />
            <AppPagination
              maxPageIndex={data.maxPageIndex}
              onChange={setPageIndex}
            />
          </CardBody>
          {
            data &&
            <Download userId={userId} searchText={searchText}/>
          }
        </Card>
      </GridItem>
    </GridContainer>
  );
}

const Download = ({ userId, searchText }) => {
  const download = () => {
    VisitsApi
      .getAllVisits(userId, 0, Number.MAX_SAFE_INTEGER, { discount: filters.discount, visitStatus: filters.visitStatus, moneyReturned: filters.moneyReturned, from: filters.from, to: filters.to, search: searchText })
      .then(res => {
        const exportables = res.data.results.map((value) => {
          return {
            _id: value._id,
            بیمار: value.patient ? value.patient.name || value.patient.mobile : '',
            'شماره بیمار': value.patient ? value.patient.mobile : '',
            'شماره پزشک': value.doctor.mobile,
            پزشک: value.doctor ? value.doctor.name : '',
            وضعیت: value.state,
            'زمان درخواست': value.createdAt ? formatDateShamsi(value.createdAt) : '',
            'زمان شروع': value.startDate ? formatDateShamsi(value.startDate) : '',
            'زمان پایان': value.endDate ? formatDateShamsi(value.endDate) : '',
            هزینه: value.receipt ? value.receipt.total || 0 : ''
          };
        });
        exportToCSV(exportables, 'VisitsList');
      })
      .catch(err => console.log(err));
  };

  return <AppButton color={'primary'} text={'دانلود فایل excel'} onClick={download}/>;
};

export default React.memo(VisitsList);

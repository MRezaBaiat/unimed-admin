import React, { useEffect, useState } from 'react';
import AppButton from '../../base/app_button/AppButton';
import { DoctorStatus, PatientStatus, QueryResponse, User, UserType } from 'api';
import UsersApi from '../../../network/UsersApi';
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
import AppDropdownMenu from '../../base/app_dropdown/AppDropdownMenu';
import { smartDate } from 'javascript-dev-kit';
import { exportToCSV } from '../../../helpers/Utils';

// @ts-ignore
const useStyles = makeStyles(styles);

interface Props {
    onSelect?:(user: User)=>void
}
function UsersList (props: Props) {
  const { onSelect } = props;
  const classes = useStyles();
  const [searchText, setSearchText] = useState('');
  const [data, setData] = useState({ results: [], total: 0, maxPageIndex: 0, currentPageIndex: 0 } as QueryResponse<{user: User, status: PatientStatus | DoctorStatus, isOnline: boolean}>);
  const [pageIndex, setPageIndex] = useState(0);
  const [filter, setFilter] = useState(undefined);
  const limit = 50;

  const load = () => {
    UsersApi.getAllUsers(pageIndex * limit, limit, searchText, filter)
      .then(res => setData(res.data))
      .catch(err => console.log(err));
  };

  useEffect(load, [pageIndex, filter]);

  const columns : any = data.results.map((value) => {
    const user = value.user;
    return { keys: [user.name, user.mobile, user.type, smartDate(user.createdAt).formatJalali(), user.code, String(value.isOnline)], value };
  });

  return (
    <GridContainer>
      <GridItem xs={12} sm={12} md={12}>
        <Card>
          <CardHeader style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'space-between' }} color="primary">
            <div>
              <h4 className={classes.cardTitleWhite}>لیست کاربران {'(' + (data && data.total) + ')'}</h4>
              <p className={classes.cardCategoryWhite}>
                مدیریت پزشکها و بیمارها
              </p>
            </div>
            <SearchView
              onChange={setSearchText}
              onClick={load}
            />
          </CardHeader>
          <CardBody>
            <AppDropdownMenu
              initialValue={undefined}
              items={[{ text: 'همه کاربران', value: undefined }, { text: 'پزشک ها', value: UserType.DOCTOR }, { text: 'بیماران', value: UserType.PATIENT }]}
              onClick={(value) => {
                setPageIndex(0);
                setFilter(value);
              }}
            />
            <AppTable
              onClick={(value) => { onSelect && onSelect(value.user); }}
              tableHeaderColor="primary"
              tableHead={['Name', 'Mobile', 'Type', 'JoinedAt', 'Code', 'Status']}
              tableData={columns}
            />
            <AppPagination
              maxPageIndex={data.maxPageIndex}
              onChange={setPageIndex}
            />
            <UsersJoiningDatesReportExcel/>
          </CardBody>
        </Card>
      </GridItem>
    </GridContainer>
  );
}

export default React.memo(UsersList);

const UsersJoiningDatesReportExcel = () => {
  const download = () => {
    UsersApi.createJoiningDatesReport().then((res) => {
      const exportables = Object.keys(res.data).map((value) => {
        return {
          تاریخ: value,
          تعداد: res.data[value]
        };
      });
      exportToCSV(exportables, 'UserJoiningDateReport');
    }).catch(err => console.log(err));
  };

  return <AppButton color={'primary'} text={'دانلود گزارش تاریخ های عضویت'} onClick={download}/>;
};

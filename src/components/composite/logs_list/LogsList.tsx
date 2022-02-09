import React, { useEffect, useState } from 'react';
import AppButton from '../../base/app_button/AppButton';
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
import { AdminLog, QueryResponse } from 'api';
import LogsApi from '../../../network/LogsApi';
import { formatDateShamsi } from '../../../helpers';

// @ts-ignore
const useStyles = makeStyles(styles);

interface Props {
    onSelect?:({ user, status, isOnline })=>void
}
function UsersList (props: Props) {
  const { onSelect } = props;
  const classes = useStyles();
  const [searchText, setSearchText] = useState('');
  const [data, setData] = useState({ results: [], total: 0, currentPageIndex: 0, maxPageIndex: 0 } as QueryResponse<AdminLog>);
  const [pageIndex, setPageIndex] = useState(0);
  const [filter, setFilter] = useState(undefined);
  const limit = 50;

  const load = () => {
    LogsApi.getAdminLogs(pageIndex * limit, limit, '')
      .then(res => setData(res.data))
      .catch(err => console.log(err));
  };

  useEffect(load, [pageIndex, filter]);

  const columns : any = data.results.map((value) => {
    // @ts-ignore
    return { keys: [value.url, value.method, value.user ? value.user.name : 'Unknown', formatDateShamsi(value.date)], value };
  });

  console.log(data);

  return (
    <GridContainer>
      <GridItem xs={12} sm={12} md={12}>
        <Card>
          <CardHeader style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'space-between' }} color="primary">
            <div>
              <h4 className={classes.cardTitleWhite}>لیست لاگ ها {'(' + (data && data.total) + ')'}</h4>
              <p className={classes.cardCategoryWhite}>
        مدیریت لاگ ها
              </p>
            </div>
            <SearchView
              onChange={setSearchText}
              onClick={load}
            />
          </CardHeader>
          <CardBody>
            <AppTable
              onClick={onSelect}
              tableHeaderColor="primary"
              tableHead={['Url', 'Method', 'User', 'Date']}
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

export default React.memo(UsersList);

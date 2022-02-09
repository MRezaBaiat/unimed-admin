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
import { Notification, QueryResponse } from 'api';
import { formatDateShamsi } from '../../../helpers';
import NotificationsApi from '../../../network/NotificationsApi';

// @ts-ignore
const useStyles = makeStyles(styles);

interface Props {
    onSelect?:(notification: Notification)=>void
}
function UsersList (props: Props) {
  const { onSelect } = props;
  const classes = useStyles();
  const [searchText, setSearchText] = useState('');
  const [data, setData] = useState({ results: [], maxPageIndex: 0, currentPageIndex: 0, total: 0 } as QueryResponse<Notification>);
  const [pageIndex, setPageIndex] = useState(0);
  const [filter, setFilter] = useState(undefined);
  const limit = 50;

  const load = () => {
    NotificationsApi.queryNotifications(pageIndex * limit, limit, searchText)
      .then(res => setData(res.data))
      .catch(console.log);
  };

  useEffect(load, [pageIndex, filter]);

  const columns : any = data.results.map((value) => {
    // @ts-ignore
    return { keys: [value.title, value.sender ? value.sender.name : 'Unknown', formatDateShamsi(value.date)], value };
  });

  return (
    <GridContainer>
      <GridItem xs={12} sm={12} md={12}>
        <Card>
          <CardHeader style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'space-between' }} color="primary">
            <div>
              <h4 className={classes.cardTitleWhite}>لیست نوتیفیکیشن ها {'(' + (data && data.total) + ')'}</h4>
              <p className={classes.cardCategoryWhite}>
                                مدیریت نوتیفیکیشن ها
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
              tableHead={['Title', 'Sender', 'Date']}
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

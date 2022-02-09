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
import { formatDateShamsi } from '../../../helpers';
import { Admin, QueryResponse } from 'api';
import AdminsApi from '../../../network/AdminsApi';

// @ts-ignore
const useStyles = makeStyles(styles);

interface Props {
    onSelect?:(admin: Admin)=>void
}
function AdminsList (props: Props) {
  const { onSelect } = props;
  const classes = useStyles();
  const [searchText, setSearchText] = useState('');
  const [data, setData] = useState({ results: [], currentPageIndex: 0, total: 0, maxPageIndex: 0 } as QueryResponse<Admin>);
  const [pageIndex, setPageIndex] = useState(0);
  const limit = 50;

  const load = () => {
    AdminsApi.findAdmins(pageIndex * limit, limit, searchText)
      .then(res => {
        console.log(res.data);
        setData(res.data);
      })
      .catch(err => console.log(err));
  };

  useEffect(load, [pageIndex]);

  const columns : any = data.results.map((value) => {
    return { keys: [value.name, value.username, value.type], value };
  });

  return (
    <GridContainer>
      <GridItem xs={12} sm={12} md={12}>
        <Card>
          <CardHeader style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'space-between' }} color="primary">
            <div>
              <h4 className={classes.cardTitleWhite}>لیست ادمین ها {'(' + (data && data.total) + ')'}</h4>
              <p className={classes.cardCategoryWhite}>
                                مدیریت ادمین ها
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
              tableHead={['Name', 'Username', 'Type']}
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

export default React.memo(AdminsList);

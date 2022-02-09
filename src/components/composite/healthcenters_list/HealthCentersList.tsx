import React, { useEffect, useState } from 'react';
import AppButton from '../../base/app_button/AppButton';
import { DoctorStatus, HealthCenter, HealthCenterType, QueryResponse, User } from 'api';
import HealthCentersApi from '../../../network/HealthCentersApi';
import styles from '../../../assets/jss/material-dashboard-react/components/listStyles';
import { makeStyles } from '@material-ui/core/styles';
import GridItem from '../../base/grid/GridItem';
import Card from '../../base/app_card/Card';
import CardHeader from '../../base/app_card/CardHeader';
import CardBody from '../../base/app_card/CardBody';
import AppTable from '../../base/app_table/AppTable';
import GridContainer from '../../base/grid/GridContainer';
import UsersApi from '../../../network/UsersApi';
import Search from '@material-ui/icons/Search';
import AppInput from '../../base/app_input/AppInput';
import AppPagination from '../../base/app_pagination/AppPagination';
import SearchView from '../search_view/SearchView';

// @ts-ignore
const useStyles = makeStyles(styles);

interface Props {
    onSelect?:(center: HealthCenter)=>void,
    type?: HealthCenterType
}
function HealthCentersList (props: Props) {
  const { onSelect, type } = props;
  const [searchText, setSearchText] = useState('');
  const [data, setData] = useState({ results: [], currentPageIndex: 0, total: 0, maxPageIndex: 0 } as QueryResponse<HealthCenter>);
  const [pageIndex, setPageIndex] = useState(0);
  const limit = 50;

  const centers = data ? data.results.filter(s => type ? s.type === type : s) : [];

  const load = () => {
    HealthCentersApi.getAllHealthCenters(pageIndex * limit, limit, searchText)
      .then(res => setData(res.data))
      .catch(err => console.log(err));
  };

  useEffect(load, [pageIndex]);

  const classes = useStyles();
  const columns : any = centers.map((value: HealthCenter) => {
    return { keys: [value.name, value.type, value._id, value.address, value.priority], value };
  });

  return (
    <GridContainer>
      <GridItem xs={12} sm={12} md={12}>
        <Card>
          <CardHeader style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'space-between' }} color="primary">
            <div>
              <h4 className={classes.cardTitleWhite}>لیست مراکز سلامتی</h4>
              <p className={classes.cardCategoryWhite}>
                مدیریت بیمارستان ها و کلینیک ها
              </p>
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
              tableHead={['Name', 'Type', 'Id', 'Address', 'Priority']}
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

export default React.memo(HealthCentersList);

import React, { useEffect, useState } from 'react';
import SpecializationsApi from '../../../network/SpecializationsApi';
import { QueryResponse, Specialization } from 'api';
import styles from '../../../assets/jss/material-dashboard-react/components/listStyles';
import { makeStyles } from '@material-ui/core/styles';
import GridItem from '../../base/grid/GridItem';
import Card from '../../base/app_card/Card';
import CardHeader from '../../base/app_card/CardHeader';
import CardBody from '../../base/app_card/CardBody';
import AppTable from '../../base/app_table/AppTable';
import GridContainer from '../../base/grid/GridContainer';
import AppPagination from '../../base/app_pagination/AppPagination';
import SearchView from '../search_view/SearchView';

// @ts-ignore
const useStyles = makeStyles(styles);

interface Props {
    onSelect?:(spec: Specialization)=>void
}
function SpecializationsList (props: Props) {
  const { onSelect } = props;

  const [data, setData] = useState({ results: [], total: 0, maxPageIndex: 0, currentPageIndex: 0 } as QueryResponse<Specialization>);
  const [pageIndex, setPageIndex] = useState(0);
  const [searchText, setSearchText] = useState('');
  const limit = 50;

  const load = () => {
    SpecializationsApi
      .getSpecializations(pageIndex * limit, limit, searchText)
      .then(res => setData(res.data))
      .catch(err => console.log(err));
  };

  useEffect(load, [pageIndex]);

  const classes = useStyles();
  const columns : any = data.results.map((value: Specialization) => {
    return { keys: [value.name, value._id], value };
  });

  return (
    <GridContainer>
      <GridItem xs={12} sm={12} md={12}>
        <Card>
          <CardHeader style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'space-between' }} color="primary">
            <div>
              <h4 className={classes.cardTitleWhite}>لیست تخصص ها</h4>
              <p className={classes.cardCategoryWhite}>
                اضافه ، حذف و مدیریت تخصص ها
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
              tableHead={['Name', 'Id']}
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

export default React.memo(SpecializationsList);

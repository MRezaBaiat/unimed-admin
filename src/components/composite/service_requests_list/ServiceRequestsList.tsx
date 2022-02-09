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
import { QueryResponse, ServiceRequest } from 'api';
import { formatDateShamsi } from '../../../helpers';
import ServiceRequestsApi from '../../../network/ServiceRequestsApi';

// @ts-ignore
const useStyles = makeStyles(styles);

interface Props {
    onSelect?:(serviceRequest: ServiceRequest)=>void
}
function ServiceRequestsList (props: Props) {
  const { onSelect } = props;
  const classes = useStyles();
  const [searchText, setSearchText] = useState('');
  const [data, setData] = useState({ results: [], currentPageIndex: 0, maxPageIndex: 0, total: 0 } as QueryResponse<ServiceRequest>);
  const [pageIndex, setPageIndex] = useState(0);
  const limit = 50;

  const load = () => {
    ServiceRequestsApi.getServiceRequests(pageIndex * limit, limit, searchText)
      .then(res => setData(res.data))
      .catch(err => console.log(err));
  };

  useEffect(load, [pageIndex]);

  const columns : any = data.results.map((request) => {
    // @ts-ignore
    return { keys: [formatDateShamsi(request.request_date), request.status === 'NOT_SEEN' ? <b style={{ color: 'orange' }}>{request.status}</b> : request.status, request.mobile, request.service ? request.service.title : 'Unknown'], value: request };
  });

  return (
    <GridContainer>
      <GridItem xs={12} sm={12} md={12}>
        <Card>
          <CardHeader style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'space-between' }} color="primary">
            <div>
              <h4 className={classes.cardTitleWhite}>درخواست های خدمات</h4>
              <p className={classes.cardCategoryWhite}>
        مدیریت درخواستهای خدمات
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
              tableHead={['Date', 'Status', 'Mobile', 'Service']}
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

export default React.memo(ServiceRequestsList);

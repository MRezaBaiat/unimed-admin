import React, { useEffect, useState } from 'react';
import AppButton from '../../base/app_button/AppButton';
import { DiscountCoupon, HealthCenter, QueryResponse, User, UserType } from 'api';
import AppTextView from '../../base/app_text/AppTextView';
import DiscountsApi from '../../../network/DiscountsApi';
import GridItem from '../../base/grid/GridItem';
import Card from '../../base/app_card/Card';
import CardHeader from '../../base/app_card/CardHeader';
import CardBody from '../../base/app_card/CardBody';
import AppTable from '../../base/app_table/AppTable';
import GridContainer from '../../base/grid/GridContainer';
import styles from '../../../assets/jss/material-dashboard-react/components/listStyles';
import { makeStyles } from '@material-ui/core/styles';
import Search from '@material-ui/icons/Search';
import AppInput from '../../base/app_input/AppInput';
import HealthCentersApi from '../../../network/HealthCentersApi';
import AppPagination from '../../base/app_pagination/AppPagination';
import SearchView from '../search_view/SearchView';

// @ts-ignore
const useStyles = makeStyles(styles);

interface Props {
    onSelect?:(coupon: DiscountCoupon)=>void
}
function DiscountsList (props: Props) {
  const { onSelect } = props;
  const [searchText, setSearchText] = useState('');
  const [data, setData] = useState({ results: [], maxPageIndex: 0, total: 0, currentPageIndex: 0 } as QueryResponse<DiscountCoupon>);
  const [pageIndex, setPageIndex] = useState(0);
  const limit = 50;

  const load = () => {
    DiscountsApi.getAllDiscounts(pageIndex * limit, limit, searchText)
      .then(res => setData(res.data))
      .catch(err => console.log(err));
  };

  useEffect(load, [pageIndex]);

  const classes = useStyles();
  // @ts-ignore
  const columns : any = data.results.map((value) => {
    const discount: DiscountCoupon = value;
    return { keys: [discount.title, discount._id, discount.code, discount.amount, discount.endDate, discount.perUserLimit, discount.totalUsageLimit], value };
  });

  return (
    <GridContainer>
      <GridItem xs={12} sm={12} md={12}>
        <Card>
          <CardHeader style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'space-between' }} color="primary">
            <div>
              <h4 className={classes.cardTitleWhite}>لیست تخفیف ها</h4>
              <p className={classes.cardCategoryWhite}>
                مدیریت کوپن های تخفیف
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
              tableHead={['Title', 'Id', 'Code', 'Amount', 'End Date', 'Limit per user', 'Total limit']}
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
    /* <div>
      <table {...getTableProps()} style={{ border: 'solid 1px blue' }}>
        <thead>
          {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => (
                <th
                  {...column.getHeaderProps()}
                  style={{
                    borderBottom: 'solid 3px red',
                    background: 'aliceblue',
                    color: 'black',
                    fontWeight: 'bold'
                  }}
                >{column.render('Header')}</th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map(row => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map(cell => {
                  return <td
                    {...cell.getCellProps()}
                    style={{
                      padding: '10px',
                      border: 'solid 1px grey',
                      background: 'papayawhip'
                    }}
                    onClick={(event) => {
                      // @ts-ignore
                      onSelect && onSelect(cell.row.original);
                    }}
                  >{cell.render('Cell')}</td>;
                })}
              </tr>
            );
          })}
        </tbody>
      </table>

      {
        addEditDialog.open &&
        <AddDiscountDialog editableItem={addEditDialog.item} onClose={() => { setAddEditDialog({ open: false, item: null }); }} onSuccess={(user) => {
          setAddEditDialog({ open: false, item: undefined });
        }}/>
      }
    </div> */
  );
}

export default React.memo(DiscountsList);

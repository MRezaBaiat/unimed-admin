import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
// core components
import styles from './styles';

// @ts-ignore
const useStyles = makeStyles(styles);

interface Props {
  tableHeaderColor:'warning'|
    'primary'|
    'danger'|
    'success'|
    'info'|
    'rose'|
    'gray'
  tableHead: string[],
  tableData: {keys:string[], value:any}[],
  onClick?:(value)=>void,
}
export default function AppTable (props: Props) {
  const classes = useStyles();
  const { tableHead, tableData, tableHeaderColor, onClick } = props;
  return (
    <div className={classes.tableResponsive}>
      <Table className={classes.table}>
        {tableHead !== undefined ? (
          <TableHead className={classes[tableHeaderColor + 'TableHeader']}>
            <TableRow className={classes.tableHeadRow}>
              {tableHead.map((prop, key) => {
                return (
                  <TableCell
                    className={classes.tableCell + ' ' + classes.tableHeadCell}
                    key={key}
                  >
                    {prop}
                  </TableCell>
                );
              })}
            </TableRow>
          </TableHead>
        ) : null}
        <TableBody>
          {tableData.map((prop, key) => {
            return (
              <TableRow key={key} style={{ cursor: onClick && 'pointer' }} onClick={() => { onClick && onClick(prop.value); }} className={classes.tableBodyRow}>
                {prop.keys.map((prop, key) => {
                  return (
                    <TableCell className={classes.tableCell} key={key}>
                      {prop}
                    </TableCell>
                  );
                })}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}

AppTable.defaultProps = {
  tableHeaderColor: 'gray'
};

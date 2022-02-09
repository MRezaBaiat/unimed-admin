// @ts-nocheck
import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import ListSubheader from '@material-ui/core/ListSubheader';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Collapse from '@material-ui/core/Collapse';

export interface Props<T, V>{
  items: T[],
  renderItem: (item: T)=> any,
  getItemKey: (item: T)=>string,
  onClick: (item: T) =>void
}
function AppList (props: Props) {
  const useStyles = makeStyles(theme => ({
    root: {
      backgroundColor: theme.palette.background.paper
    },
    nested: {
      paddingLeft: theme.spacing(4)
    }
  }));
  const classes = useStyles();
  const { items, renderItem, getItemKey } = props;
  const { onClick } = props;
  return (
    <List
      component="nav"
      aria-labelledby="nested-list-subheader"
      className={classes.root}
      style={props.style}
    >
      {
        items.map((item) => {
          const key = getItemKey(item);
          return (
            <ListItem key={key} button onClick={() => { onClick(item); }}>{renderItem(item)}</ListItem>
          );
        })
      }
    </List>
  );
}

export default React.memo(AppList);

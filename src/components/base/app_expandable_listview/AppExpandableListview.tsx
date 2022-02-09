// @ts-nocheck
import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import ListSubheader from '@material-ui/core/ListSubheader';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Collapse from '@material-ui/core/Collapse';

export interface Props<T, V>{
  items: T[],
  title?: string,
  getSubItems: (item: T)=> V[],
  renderItem: (item: T)=> any,
  renderSubItem: (subitem: V)=> any,
  getItemKey: (item: T)=>string
}
function NestedList (props: Props) {
  const useStyles = makeStyles(theme => ({
    root: {
      backgroundColor: theme.palette.background.paper
    },
    nested: {
      paddingLeft: theme.spacing(4)
    }
  }));
  const classes = useStyles();
  const [state, setState] = useState([]);
  const { items, title, getSubItems, renderItem, renderSubItem, getItemKey } = props;

  const onClick = (item: T) => {
    const key = getItemKey(item);
    if (state.indexOf(key) !== -1) {
      const ns = [...state];
      ns.splice(ns.indexOf(key));
      setState(ns);
    } else {
      setState([...state, getItemKey(item)]);
    }
  };

  return (
    <List
      component="nav"
      aria-labelledby="nested-list-subheader"
      subheader={
        title && <ListSubheader component="div" id="nested-list-subheader"> Nested List Items </ListSubheader>
      }
      className={classes.root}
      style={props.style}
    >
      {
        items.map((item) => {
          const key = getItemKey(item);
          return (
            <div style={{ flexDirection: 'column' }}>
              <ListItem button onClick={() => { onClick(item); }}>{renderItem(item)}</ListItem>
              <Collapse in={state.indexOf(key) !== -1} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  {
                    getSubItems(item).map((subitem) => {
                      return <ListItem button className={classes.nested}>{renderSubItem(subitem)}</ListItem>;
                    })
                  }
                </List>
              </Collapse>
            </div>
          );
        })
      }
    </List>
  );
}

export default React.memo(NestedList);

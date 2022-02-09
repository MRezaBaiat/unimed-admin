import React, { useState } from 'react';
import { List, ListItem, ListItemText, Menu, MenuItem } from '@material-ui/core';
import AppTextView from '../app_text/AppTextView';
import { safeAssignStyles } from '../../../helpers/Utils';
import Card from '../app_card/Card';

interface Props {
  items: { text: string, value: any }[],
  onClick?: (value: any) => void,
  style?: any,
  initialValue?: any,
  fontSize?: number,
  title?: string
}
function AppDropdownMenu (props: Props) {
  const { style, onClick, items, initialValue, fontSize, title } = props;
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [selected, setSelected] = useState(items.find(s => s.value === initialValue));

  const handleMenuItemClick = (item) => {
    onClick && onClick(item.value);
    onClick && setSelected(item);
    setAnchorEl(null);
  };

  return (
    <Card style={safeAssignStyles(style, { alignItems: 'center', margin: 5 })}>
      <AppTextView text={title || ''} fontSize={12} style={{ marginTop: title && 5, borderBottom: '1px solid black' }}/>
      <List style={{ width: '100%' }} component="nav">
        <ListItem
          button
          style={{ width: '100%' }}
          aria-haspopup="true"
          aria-controls="lock-menu"
          onClick={(event) => {
            // @ts-ignore
            setAnchorEl(event.currentTarget);
          }}
        >
          <ListItemText
            primary={<AppTextView fontSize={fontSize} text={selected ? selected.text : 'انتخاب کنید'}/>} />
        </ListItem>
      </List>

      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        style={{ width: '100%' }}
        open={Boolean(anchorEl)}
        onClose={() => {
          setAnchorEl(null);
        }}
      >
        {
          items.map((item) => {
            return (
              <MenuItem
                style={{ fontFamily: 'subtitle-font', width: '100%', fontSize, alignItems: 'center', justifyContent: 'center' }}
                selected={selected && selected.value === item.value}
                onClick={event => handleMenuItemClick(item)}>{item.text}</MenuItem>
            );
          })
        }
      </Menu>
    </Card>
  );
}

export default React.memo(AppDropdownMenu);

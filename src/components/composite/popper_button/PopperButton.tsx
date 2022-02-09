import React, { useEffect, useState } from 'react';
import AppButton from '../../base/app_button/AppButton';
import { makeStyles } from '@material-ui/core/styles';
import classNames from 'classnames';
import {
  ClickAwayListener,
  Divider,
  Grow,
  MenuItem,
  MenuList,
  Paper,
  Popper
} from '@material-ui/core';

interface Props {
    IconComponent: any,
    items:{text:string, onClick:()=>void}[]
}
function PopperButton (props: Props) {
  const { IconComponent, items } = props;
  const [openSettings, setOpenSettings] = React.useState(null);

  const handleClickSettings = event => {
    // @ts-ignore
    if (openSettings && openSettings.contains(event.target)) {
      setOpenSettings(null);
    } else {
      setOpenSettings(event.currentTarget);
    }
  };

  return (
    <div>
      <AppButton
        color={window.innerWidth > 959 ? 'transparent' : 'white'}
        justIcon={window.innerWidth > 959}
        simple={!(window.innerWidth > 959)}
        aria-owns={openSettings ? 'profile-menu-list-grow' : null}
        aria-haspopup="true"
        onClick={handleClickSettings}
      >
        <IconComponent/>
      </AppButton>
      <PopperView openSettings={openSettings} setOpenSettings={setOpenSettings} items={items}/>
    </div>
  );
}

const useStyles2 = makeStyles(require('../../../assets/jss/material-dashboard-react/components/headerLinksStyle').default);

const PopperView = ({ openSettings, setOpenSettings, items }) => {
  const classes = useStyles2();
  const [first, setFirst] = useState(true);
  const handleCloseSettings = () => {
    if (first) {
      return setFirst(false);
    }
    setOpenSettings(null);
    setFirst(true);
  };
  return (
    <Popper
      open={Boolean(openSettings)}
      anchorEl={openSettings}
      transition
      disablePortal
      className={
        classNames({ [classes.popperClose]: !openSettings }) +
                ' ' +
                classes.popperNav
      }
    >
      {({ TransitionProps, placement }) => (
        <Grow
          {...TransitionProps}
          id="profile-menu-list-grow"
          style={{
            transformOrigin:
                            placement === 'bottom' ? 'center top' : 'center bottom'
          }}
        >
            <ClickAwayListener onClickAway={handleCloseSettings}>
             <Paper>

                <MenuList role="menu">
                {
                  items.map((item) => {
                    return (
                      <MenuItem
                        onClick={() => { handleCloseSettings(); item.onClick(); }}
                        className={classes.dropdownItem}
                      >
                        {
                          item.text
                        }
                      </MenuItem>
                    );
                  })
                }
              </MenuList>
             </Paper>
            </ClickAwayListener>
        </Grow>
      )}
    </Popper>
  );
};

export default React.memo(PopperButton);

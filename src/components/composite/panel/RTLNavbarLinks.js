import React from 'react';
import classNames from 'classnames';
import { makeStyles } from '@material-ui/core/styles';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import Grow from '@material-ui/core/Grow';
import Paper from '@material-ui/core/Paper';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Hidden from '@material-ui/core/Hidden';
import Poppers from '@material-ui/core/Popper';
import Person from '@material-ui/icons/Person';
import Notifications from '@material-ui/icons/Notifications';
import Dashboard from '@material-ui/icons/Dashboard';
import Search from '@material-ui/icons/Search';
import styles from '../../../assets/jss/material-dashboard-react/components/rtlHeaderLinksStyle.js';
import AppInput from '../../base/app_input/AppInput';
import AppButton from '../../base/app_button/AppButton';

const useStyles = makeStyles(styles);

export default function RTLNavbarLinks () {
  const classes = useStyles();
  const [open, setOpen] = React.useState(null);
  const handleToggle = event => {
    if (open && open.contains(event.target)) {
      setOpen(null);
    } else {
      setOpen(event.currentTarget);
    }
  };

  const handleClose = () => {
    setOpen(null);
  };

  return (
    <div>
      <div className={classes.searchWrapper}>
        <AppInput
          formControlProps={{
            className: classes.margin + ' ' + classes.search
          }}
          inputProps={{
            placeholder: 'جستجو...',
            inputProps: {
              'aria-label': 'Search'
            }
          }}
        />
        <AppButton color="white" aria-label="edit" justIcon round>
          <Search />
        </AppButton>
      </div>
      <AppButton
        color={window.innerWidth > 959 ? 'transparent' : 'white'}
        justIcon={window.innerWidth > 959}
        simple={!(window.innerWidth > 959)}
        aria-label="Dashboard"
        className={classes.buttonLink}
      >
        <Dashboard className={classes.icons} />
        <Hidden mdUp implementation="css">
          <p className={classes.linkText}>آمارها</p>
        </Hidden>
      </AppButton>
      <div className={classes.manager}>
        <AppButton
          color={window.innerWidth > 959 ? 'transparent' : 'white'}
          justIcon={window.innerWidth > 959}
          simple={!(window.innerWidth > 959)}
          aria-owns={open ? 'menu-list-grow' : null}
          aria-haspopup="true"
          onClick={handleToggle}
          className={classes.buttonLink}
        >
          <Notifications className={classes.icons} />
          <span className={classes.notifications}>۵</span>
          <Hidden mdUp implementation="css">
            <p onClick={handleToggle} className={classes.linkText}>
              اعلان‌ها
            </p>
          </Hidden>
        </AppButton>
        <Poppers
          open={Boolean(open)}
          anchorEl={open}
          transition
          disablePortal
          className={
            classNames({ [classes.popperClose]: !open }) +
            ' ' +
            classes.popperNav
          }
        >
          {({ TransitionProps, placement }) => (
            <Grow
              {...TransitionProps}
              id="menu-list-grow"
              style={{
                transformOrigin:
                  placement === 'bottom' ? 'center top' : 'center bottom'
              }}
            >
              <Paper>
                <ClickAwayListener onClickAway={handleClose}>
                  <MenuList role="menu">
                    <MenuItem
                      onClick={handleClose}
                      className={classes.dropdownItem}
                    >
                      محمدرضا به ایمیل شما پاسخ داد
                    </MenuItem>
                    <MenuItem
                      onClick={handleClose}
                      className={classes.dropdownItem}
                    >
                      شما ۵ وظیفه جدید دارید
                    </MenuItem>
                    <MenuItem
                      onClick={handleClose}
                      className={classes.dropdownItem}
                    >
                      از حالا شما با علیرضا دوست هستید
                    </MenuItem>
                    <MenuItem
                      onClick={handleClose}
                      className={classes.dropdownItem}
                    >
                      اعلان دیگر
                    </MenuItem>
                    <MenuItem
                      onClick={handleClose}
                      className={classes.dropdownItem}
                    >
                      اعلان دیگر
                    </MenuItem>
                  </MenuList>
                </ClickAwayListener>
              </Paper>
            </Grow>
          )}
        </Poppers>
      </div>
      <AppButton
        color={window.innerWidth > 959 ? 'transparent' : 'white'}
        justIcon={window.innerWidth > 959}
        simple={!(window.innerWidth > 959)}
        aria-label="Person"
        className={classes.buttonLink}
      >
        <Person className={classes.icons} />
        <Hidden mdUp implementation="css">
          <p className={classes.linkText}>حساب کاربری</p>
        </Hidden>
      </AppButton>
    </div>
  );
}

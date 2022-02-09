import React from 'react';
import classNames from 'classnames';
import { NavLink } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Icon from '@material-ui/core/Icon';

import styles from './styles';
import AppImageView from '../../base/app_image/AppImageView';
import { arm, drawerBackground } from 'src/assets/images';
import AppTextView from '../../base/app_text/AppTextView';
import AppScrollable from '../../base/app_scrollable/AppScrollable';
import AppButton from '../../base/app_button/AppButton';
import AuthService from '../../../services/AuthService';

// @ts-ignore
const useStyles = makeStyles(styles);

interface Props {
    rtlActive?: boolean,
    handleDrawerToggle: ()=>void,
    bgColor?: 'purple' | 'blue' | 'green' | 'orange' | 'red'
    logoText?: string,
    routes: any[],
    open: boolean,
    color?: string
}
export default function Panel (props: Props) {
  const classes = useStyles();
  // verifies if routeName is the one active (in browser input)
  function activeRoute (routeName) {
    return window.location.href.indexOf(routeName) > -1;
  }
  const { color, logoText, routes } = props;
  const links = (
    <List className={classes.list}>
      {routes.map((prop, key) => {
        let activePro = ' ';
        let listItemClasses;
        if (prop.path === '/upgrade-to-pro') {
          activePro = classes.activePro + ' ';
          listItemClasses = classNames({
            // @ts-ignore
            [' ' + classes[color]]: true
          });
        } else {
          listItemClasses = classNames({
            // @ts-ignore
            [' ' + classes[color]]: activeRoute(prop.layout + prop.path)
          });
        }
        const whiteFontClasses = classNames({
          [' ' + classes.whiteFont]: activeRoute(prop.layout + prop.path)
        });
        return (
          <NavLink
            to={prop.layout + prop.path}
            className={activePro + classes.item}
            activeClassName="active"
            key={key}
          >
            <ListItem button className={classes.itemLink + listItemClasses}>
              {typeof prop.icon === 'string' ? (
                <Icon
                  className={classNames(classes.itemIcon, whiteFontClasses, {
                    [classes.itemIconRTL]: props.rtlActive
                  })}
                >
                  {prop.icon}
                </Icon>
              ) : (
                <prop.icon
                  className={classNames(classes.itemIcon, whiteFontClasses, {
                    [classes.itemIconRTL]: props.rtlActive
                  })}
                />
              )}
              <ListItemText
                primary={props.rtlActive ? prop.rtlName : prop.name}
                className={classNames(classes.itemText, whiteFontClasses, {
                  [classes.itemTextRTL]: props.rtlActive
                })}
                disableTypography={true}
              />
            </ListItem>
          </NavLink>
        );
      })}
    </List>
  );
  const brand = (
    <div className={classes.logo} style={{ width: '100%', alignItems: 'center', justifyContent: 'flex-start', flexDirection: 'row' }}>
        <AppImageView src={arm} className={classes.img} />
        <AppTextView text={'MATAP'} textColor={'white'} style={{ marginRight: 10 }}/>
    </div>
  );
  return (
    <div>
      {/* <Hidden mdUp implementation="css">
        <Drawer
          variant="temporary"
          anchor={props.rtlActive ? 'left' : 'right'}
          open={props.open}
          classes={{
            paper: classNames(classes.drawerPaper, {
              [classes.drawerPaperRTL]: props.rtlActive
            })
          }}
          onClose={props.handleDrawerToggle}
          ModalProps={{
            keepMounted: true // Better open performance on mobile.
          }}
        >
          {brand}
          <div className={classes.sidebarWrapper}>
            {props.rtlActive ? <RTLNavbarLinks /> : <AdminNavbarLinks />}
            {links}
          </div>
          {image !== undefined ? (
            <div
              className={classes.background}
              style={{ backgroundImage: 'url(' + image + ')' }}
            />
          ) : null}
        </Drawer>
      </Hidden> */}
      <Hidden smDown implementation="css">
        <Drawer
          anchor={props.rtlActive ? 'right' : 'left'}
          variant="permanent"
          open
          classes={{
            /* paper: classNames(classes.drawerPaper, {
              [classes.drawerPaperRTL]: props.rtlActive
            }) */
          }}
        >
          {brand}
            <AppScrollable className={classes.sidebarWrapper}>
              {links}
              <AppButton color={'white'} simple={true} text={'Log Out'} onClick={() => {
                AuthService.logout();
                window.location.reload();
              }}/>
            </AppScrollable>
            <div
              className={classes.background}
              style={{ backgroundImage: 'url(' + drawerBackground + ')' }}
            />
        </Drawer>

      </Hidden>
    </div>
  );
}
Panel.defaultProps = {
  rtlActive: true
};

/*
import React, { useEffect, useState } from 'react';
import './styles.css';
import PanelButton from './panel_button/PanelButton';
import Section_Users from '../../../pages/main/sections/section_users/Section_Users';
import Section_Specializations
  from '../../../pages/main/sections/section_specializations/Section_Specializations';
import Section_HealthCenters
  from '../../../pages/main/sections/section_health_centers/Section_HealthCenters';
import Section_Discounts from "../../../pages/main/sections/section_discounts/Section_Discounts";

const buttons = [
  { text: 'صفحه اصلی', icon: 1, onClick: () => {} },
  { text: 'صفحات ثابت', icon: 1, onClick: () => {} },
  { text: 'بسته ها', icon: 1, onClick: () => {} },
  { text: 'تیکت ها', icon: 1, onClick: () => {} },
  { text: 'تخفیف ها', icon: 1, component: Section_Discounts },
  { text: 'پزشک اختصاصی', icon: 1, onClick: () => {} },
  { text: 'بیمار اختصاصی', icon: 1, onClick: () => {} },
  { text: 'کاربران', icon: 1, component: Section_Users },
  { text: 'لیست پرداخت', icon: 1, onClick: () => {} },
  { text: 'تراکنش ها', icon: 1, onClick: () => {} },
  { text: 'لیست چت ها', icon: 1, onClick: () => {} },
  { text: 'پرسش و پاسخ/راهنما', icon: 1, onClick: () => {} },
  { text: 'تخصص ها', icon: 1, component: Section_Specializations },
  { text: 'مراکز سلامتی', icon: 1, component: Section_HealthCenters },
  { text: 'تنظیمات کلی', icon: 1, onClick: () => {} },
  { text: 'لیست تماس ها', icon: 1, onClick: () => {} }
];

interface Props {
    onChange:(Component)=>void
}
function Panel (props: Props) {
  const { onChange } = props;
  const [selectedIndex, setSelectedIndex] = useState(0);
  useEffect(() => {

  }, [selectedIndex]);
  // const{buttons} = props;
  return (
    <div className='panel-container'>
      {
        buttons.map((button, index) => {
          return <PanelButton text={button.text} icon={button.icon} onClick={() => { setSelectedIndex(index); onChange(button.component); }}/>;
        })
      }
    </div>
  );
}

export default React.memo(Panel);
*/

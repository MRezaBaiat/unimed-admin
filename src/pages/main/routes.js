/*!

=========================================================
* Material Dashboard React - v1.8.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2019 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/material-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
// @material-ui/icons
import Dashboard from '@material-ui/icons/Dashboard';
import Person from '@material-ui/icons/Person';
import Replay5 from '@material-ui/icons/Replay5';
import Group from '@material-ui/icons/Group';
import Settings from '@material-ui/icons/Settings';
import Money from '@material-ui/icons/Money';
import Radio from '@material-ui/icons/Radio';
import LibraryBooks from '@material-ui/icons/LibraryBooks';
import BubbleChart from '@material-ui/icons/BubbleChart';
import LocationOn from '@material-ui/icons/LocationOn';
import Notifications from '@material-ui/icons/Notifications';
import Unarchive from '@material-ui/icons/Unarchive';
import Language from '@material-ui/icons/Language';
import React from 'react';
import MainSection from './sections/MainSection';
import { store } from '../../index';

const dashboardRoutes = [
  {
    path: '/users',
    name: 'کاربران',
    icon: Person,
    component: <MainSection type={'user'}/>,
    layout: '/admin',
    rtlName: 'کاربران',
    getPermission: () => store.getState().global.admin.privileges.users.menuVisible
  },
  {
    path: '/discounts',
    name: 'تخفیف ها',
    icon: Dashboard,
    component: <MainSection type={'discount'}/>,
    layout: '/admin',
    rtlName: 'تخفیف ها',
    getPermission: () => store.getState().global.admin.privileges.discounts.menuVisible
  },
  {
    path: '/healthcenters',
    name: 'مراکز سلامتی',
    icon: BubbleChart,
    component: <MainSection type={'healthcenter'}/>,
    layout: '/admin',
    rtlName: 'مراکز سلامتی',
    getPermission: () => store.getState().global.admin.privileges.healthCenters.menuVisible
  },
  {
    path: '/specializations',
    name: 'تخصص ها',
    icon: Unarchive,
    component: <MainSection type={'specialization'}/>,
    layout: '/admin',
    rtlName: 'تخصص ها',
    getPermission: () => store.getState().global.admin.privileges.specializations.menuVisible
  },
  {
    path: '/visits',
    name: 'ویزیت ها',
    icon: Group,
    component: <MainSection type={'visits'}/>,
    layout: '/admin',
    rtlName: 'ویزیت ها',
    getPermission: () => store.getState().global.admin.privileges.visits.menuVisible
  },
  {
    path: '/surveys',
    name: 'نظرسنجی ها',
    icon: Language,
    component: <MainSection type={'surveys'}/>,
    layout: '/admin',
    rtlName: 'نظرسنجی ها',
    getPermission: () => store.getState().global.admin.privileges.visits.menuVisible
  },
  {
    path: '/servicerequests',
    name: 'درخواست های خدمات',
    icon: LibraryBooks,
    component: <MainSection type={'servicerequests'}/>,
    layout: '/admin',
    rtlName: 'درخواست های خدمات',
    getPermission: () => store.getState().global.admin.privileges.serviceRequests.menuVisible
  },
  {
    path: '/accountings',
    name: 'حسابداری',
    icon: Money,
    component: <MainSection type={'accountings'}/>,
    layout: '/admin',
    rtlName: 'حسابداری',
    getPermission: () => store.getState().global.admin.privileges.transactions.menuVisible
  },
  {
    path: '/reservations',
    name: 'رزروها',
    icon: Money,
    component: <MainSection type={'reservations'}/>,
    layout: '/admin',
    rtlName: 'رزروها',
    getPermission: () => store.getState().global.admin.privileges.reservations.menuVisible
  },
  {
    path: '/serverconfigs',
    name: 'ویزیت ها',
    icon: Settings,
    component: <MainSection type={'serverconfigs'}/>,
    layout: '/admin',
    rtlName: 'تنظیمات سرور',
    getPermission: () => store.getState().global.admin.privileges.serverConfigs.menuVisible
  },
  {
    path: '/admins',
    name: 'ادمین ها',
    icon: Person,
    component: <MainSection type={'admins'}/>,
    layout: '/admin',
    rtlName: 'ادمین ها',
    getPermission: () => store.getState().global.admin.privileges.admins.menuVisible
  },
  {
    path: '/adminlogs',
    name: 'لاگ ادمین',
    icon: Replay5,
    component: <MainSection type={'adminlogs'}/>,
    layout: '/admin',
    rtlName: 'لاگ ادمین',
    getPermission: () => store.getState().global.admin.privileges.adminLogs.menuVisible
  },
  {
    path: '/notifications',
    name: 'نوتیفیکیشن ها',
    icon: Replay5,
    component: <MainSection type={'notifications'}/>,
    layout: '/admin',
    rtlName: 'نوتیفیکیشن ها',
    getPermission: () => store.getState().global.admin.privileges.notifications.menuVisible
  },
  {
    path: '/calls',
    name: 'تماس ها',
    icon: Replay5,
    component: <MainSection type={'calls'}/>,
    layout: '/admin',
    rtlName: 'تماس ها',
    getPermission: () => store.getState().global.admin.privileges.calls.menuVisible
  }
];

export default dashboardRoutes;

import { DiscountCoupon, HealthCenter, Specialization, Visit } from 'api';
import NavigationHelper from '../../../helpers/NavigationHelper';
import {
  sectionContainer,
  sectionsFloatingButton
} from '../../../assets/jss/material-dashboard-react';
import AppButton from '../../../components/base/app_button/AppButton';
import Add from '@material-ui/icons/Add';
import React from 'react';
import UsersList from '../../../components/composite/users_list/UsersList';
import HealthCentersList from '../../../components/composite/healthcenters_list/HealthCentersList';
import SpecializationsList
  from '../../../components/composite/specializations_list/SpecializationsList';
import DiscountsList from 'src/components/composite/discounts_list/DiscountsList';
import VisitsList from '../../../components/composite/visits_list/VisitsList';
import ServerConfigsManageScreen from '../../serverconfigs_manage/ServerConfigsManageScreen';
import AccountingsList from '../../../components/composite/accountings_list/AccountingsList';
import LogsList from '../../../components/composite/logs_list/LogsList';
import AdminsList from '../../../components/composite/admins_list/AdminsList';
import NotificationsList from '../../../components/composite/notifications_list/NotificationsList';
import AppTabs from '../../../components/base/app_tabs/AppTabs';
import AccountantReportsList
  from '../../../components/composite/accountant_reports_list/AccountantReportsList';
import SurveysList from '../../../components/composite/surveys_list/SurveysList';
import AccountantYearlyReportList
  from '../../../components/composite/accountant_yearlyreport_list/AccountantYearlyReportList';
import CallsList from '../../../components/composite/calls_list/CallsList';

interface Props {
    type : 'user' | 'calls' | 'notifications' | 'admins' | 'healthcenter' | 'specialization' | 'discount' | 'visits' | 'accountings' | 'adminlogs' | 'surveys'
}
function MainSection (props: Props) {
  const { type } = props;
  console.log(props);
  const manager = getManager(props, props.type);

  return (
    <div style={sectionContainer}>
      {
        manager.render()
      }
      {
        manager.onAdd &&
        <AppButton color="info" justIcon round style={sectionsFloatingButton} onClick={manager.onAdd}>
          <Add />
        </AppButton>
      }
    </div>
  );
}

const getManager = (props, type: string): {render:()=>any, onAdd?:()=>void} => {
  switch (type) {
    case 'user':
      return {
        render: () => <UsersList onSelect={(user) => { NavigationHelper.navigateTo('/user', { userId: user._id }); }}/>,
        onAdd: () => NavigationHelper.navigateTo('/user')
      };
    case 'healthcenter':
      return {
        render: () => <HealthCentersList onSelect={(center: HealthCenter) => { NavigationHelper.navigateTo('/healthcenter', { centerId: center._id }); }}/>,
        onAdd: () => NavigationHelper.navigateTo('/healthcenter')
      };
    case 'specialization':
      return {
        render: () => <SpecializationsList onSelect={(spec: Specialization) => { NavigationHelper.navigateTo('/specialization', { specId: spec._id }); }}/>,
        onAdd: () => NavigationHelper.navigateTo('/specialization')
      };
    case 'discount':
      return {
        render: () => <DiscountsList onSelect={(coupon: DiscountCoupon) => { NavigationHelper.navigateTo('/discount', { couponId: coupon._id }); }}/>,
        onAdd: () => NavigationHelper.navigateTo('/discount')
      };
    case 'surveys':
      return {
        render: () => <SurveysList onSelect={(visit: Visit) => { NavigationHelper.navigateTo('/survey', { visitId: visit._id }); }}/>
      };
    case 'visits':
      return {
        render: () => <VisitsList onSelect={(visit: Visit) => { NavigationHelper.navigateTo('/visit', { visitId: visit._id }); }}/>,
        onAdd: () => NavigationHelper.navigateTo('/visit')
      };
    case 'serverconfigs':
      return {
        render: () => <ServerConfigsManageScreen onSelect={() => { NavigationHelper.navigateTo('/serverconfigs'); }}/>
      };
    case 'accountings':
      return {
        render: () => <AccountingsView index={window.location.hash.split('?index=')[1] || 0}/>
      };
    case 'adminlogs':
      return {
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        render: () => <LogsList onSelect={() => { }}/>
      };
    case 'admins':
      return {
        render: () => <AdminsList onSelect={(admin) => { NavigationHelper.navigateTo('/admins', { adminId: admin._id }); }}/>,
        onAdd: () => NavigationHelper.navigateTo('/admins')
      };
    case 'notifications': {
      return {
        render: () => <NotificationsList onSelect={(notification) => { NavigationHelper.navigateTo('/notification', { notificationId: notification._id }); }}/>,
        onAdd: () => NavigationHelper.navigateTo('/notification')
      };
    }
    case 'calls': {
      return {
        render: () => <CallsList onSelect={(conference) => { NavigationHelper.navigateTo('/conference-analysis', { conferenceId: conference.id }); }}/>
      };
    }
    default:
      // @ts-ignore
      return undefined;
  }
};

const AccountingsView = ({ index }) => {
  console.log(index);
  return (
    <div style={{ flexDirection: 'column' }}>
      <AppTabs
        items={[
          { label: 'تصویه حساب', value: 0, render: () => <AccountingsList onSelect={(id, type) => { NavigationHelper.navigateTo('/user-financial', { id: id, type: type }); }}/> },
          { label: 'گزارش گیری', value: 1, render: () => <AccountantReportsList onSelect={(id, type) => { NavigationHelper.navigateTo('/user-financial', { id: id, type: type }); }}/> },
          { label: 'گزارش سالیانه', value: 2, render: () => <AccountantYearlyReportList/> }
        ]}
        selectedValue={Number(index)}
        onChange={value => {
          NavigationHelper.navigateTo('/admin/accountings', { index: value });
          window.location.reload();
        }}
      />
    </div>
  );
};

export default MainSection;

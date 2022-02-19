import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import * as serviceWorker from './serviceWorker';
import initStore from './config/initStore';
import { Provider } from 'react-redux';
import ErrorBoundary from './components/composite/errorboundary/ErrorBoundary';
import { BrowserRouter } from 'react-router-dom';
import { Redirect, Route, Router, Switch } from 'react-router';
import { history } from './helpers/NavigationHelper';
import { actionWindowSizeChanged } from './redux/actions';
import MainScreen from './pages/main/MainScreen';
import axios from 'axios';
import LoginScreen from './pages/login/LoginScreen';
import PrivateRoute from './components/base/protected_route/PrivateRoute';
import UserManageScreen from './pages/user_manage/UserManageScreen';
import './assets/css/material-dashboard-react.css?v=1.8.0';
import DiscountManageScreen from './pages/discount_manage/DiscountManageScreen';
import HealthCenterManageScreen from './pages/healthcenter_manage/HealthCenterManageScreen';
import SpecializationsManageScreen
  from './pages/specializations_manage/SpecializationsManageScreen';
import UserFinancialScreen from './pages/user_financial/UserFinancialScreen';
import TransactionDetailsScreen from './pages/transaction_details/TransactionDetailsScreen';
import UserVisitsScreen from './pages/user_visits/UserVisitsScreen';
import VisitManageScreen from './pages/visit_manage/VisitManageScreen';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core';
import AuthProtectionHoc from './components/composite/auth_protection_hoc/AuthProtectionHoc';
import AdminManageScreen from './pages/admin_manage/AdminManageScreen';
import NotificationManageScreen from './pages/notification_manage/NotificationManageScreen';
import SurveyManageScreen from './pages/survey_manage/SurveyManageScreen';
import LogsScreen from './pages/log-screen/LogsScreen';
import { SmartDate } from 'javascript-dev-kit';
import CallAnalysisScreen from './pages/call-analysis/CallAnalysisScreen';
import UserCallsScreen from './pages/user-calls/UserCallsScreen';

SmartDate.setDefaultTimeZone('utc+03:30');
// eslint-disable-next-line
console.log(window.location.protocol + '//' + window.location.hostname);

export const baseUrl = 'https://www.azdanaz.az';
console.disableYellowBox = true;
axios.defaults.baseURL = baseUrl;
axios.defaults.withCredentials = true;

export const store = initStore();

window.addEventListener('resize', () => {
  store.dispatch(actionWindowSizeChanged());
});

const THEME = createMuiTheme({
  typography: {
    fontFamily: 'title-font'
  }
});

ReactDOM.render(
  <React.StrictMode>
  <MuiThemeProvider theme={THEME}>
    <Provider store={store}>
      <ErrorBoundary>
        <BrowserRouter>
          <Router history={history}>
            <AuthProtectionHoc>
              <Switch>
                <Route path={'/login'} component={LoginScreen}/>
                <PrivateRoute path={'/admin'} component={MainScreen}/>
                <PrivateRoute path={'/user'} component={UserManageScreen}/>
                <PrivateRoute path={'/discount'} component={DiscountManageScreen}/>
                <PrivateRoute path={'/healthcenter'} component={HealthCenterManageScreen}/>
                <PrivateRoute path={'/specialization'} component={SpecializationsManageScreen}/>
                <PrivateRoute path={'/user-financial'} component={UserFinancialScreen}/>
                <PrivateRoute path={'/user-visits'} component={UserVisitsScreen}/>
                <PrivateRoute path={'/transaction'} component={TransactionDetailsScreen}/>
                <PrivateRoute path={'/visit'} component={VisitManageScreen}/>
                <PrivateRoute path={'/survey'} component={SurveyManageScreen}/>
                <PrivateRoute path={'/admins'} component={AdminManageScreen}/>
                <PrivateRoute path={'/notification'} component={NotificationManageScreen}/>
                <PrivateRoute path={'/user-logs'} component={LogsScreen}/>
                <PrivateRoute path={'/conference-analysis'} component={CallAnalysisScreen}/>
                <PrivateRoute path={'/user-calls'} component={UserCallsScreen}/>
                <Redirect from={'/'} to={'/admin/users'} />
              </Switch>
            </AuthProtectionHoc>
          </Router>
        </BrowserRouter>
      </ErrorBoundary>
    </Provider>
  </MuiThemeProvider>
  </React.StrictMode>
  , document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

// @ts-nocheck
import React from 'react';
import { Redirect, Route } from 'react-router';
import AuthService from '../../../services/AuthService';

const PrivateRoute = ({ component, ...rest }) => {
  const Comp = component;
  return (
    <Route {...rest} render={(props) => (
      AuthService.isAuthenticated()
        ? <Comp {...props} />
        : <Redirect to='/login' />
    )} />
  );
};

export default PrivateRoute;

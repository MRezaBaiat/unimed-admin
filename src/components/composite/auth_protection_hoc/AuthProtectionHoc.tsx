import React, { Component } from 'react';
import AuthService from '../../../services/AuthService';
import { store } from '../../../index';

export default class AuthProtectionHoc extends Component {
    state = {
      component: () => null
    };

    constructor (props) {
      super(props);

      this.initialize();
    }

    initialize = async () => {
      if (AuthService.isAuthenticated()) {
        const admin = store.getState().global.admin;
        if (!admin) {
          console.log('retaining');
          await AuthService.renewAuth().catch(console.log);
          console.log(store.getState().global.admin);
        }/* else {
          console.log('renewing');
          AuthService.renewAuth().catch(console.log);
        } */
      }
      // @ts-ignore
      this.state.component = this.renderStandard;
      this.forceUpdate();
    };

    renderStandard = () => {
      const { children } = this.props;
      return children;
    }

    render () {
      return this.state.component();
    }
}

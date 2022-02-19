// @ts-nocheck
import Gateway from '../network/Gateway';
import axios from 'axios';
import { actionSetAdmin } from '../redux/actions';
import { store } from '../index';

const version = '-1.0';

const getAuthorization = (): string => {
  return localStorage.getItem('auth' + version);
};

const isAuthenticated = () => {
  const now = new Date().getTime();
  return Boolean(getAuthorization()) && localStorage.getItem('auth_time') && (now - Number(localStorage.getItem('auth_time')) < 12 * 60 * 60 * 1000);
};

(() => {
  if (isAuthenticated()) {
    axios.defaults.headers.common.authorization = 'Bearer ' + getAuthorization();
  }
})();

const logout = () => {
  localStorage.removeItem('auth_time');
  localStorage.removeItem('auth' + version);
};

const signIn = async (username:string, password:string): ResponseType<void> => {
  return Gateway.post('/api/admin/users/signin', { username, password })
    .then((res) => {
      const { token, admin } = res.data;
      store.dispatch(actionSetAdmin(admin));
      localStorage.setItem('auth_time', new Date().getTime());
      localStorage.setItem('auth' + version, token);
      axios.defaults.headers.common.authorization = 'Bearer ' + token;
    });
};

const renewAuth = async (): Promise<void | AxiosResponse<void>> => {
  if (!isAuthenticated()) {
    return;
  }
  return Gateway.get('/api/admin/users/signin/renew').then((res) => {
    const { token, admin } = res.data;
    store.dispatch(actionSetAdmin(admin));
    localStorage.setItem('auth' + version, token);
    axios.defaults.headers.common.authorization = 'Bearer ' + token;
    return null;
  });
};

export default {
  signIn,
  isAuthenticated,
  getAuthorization,
  renewAuth,
  logout
};

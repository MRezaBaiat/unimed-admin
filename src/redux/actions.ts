import { getCSSRootValue } from '../helpers';
import { Admin } from 'api';

export const ACTION_WINDOW_SIZE_CHANGE = 'ACTION_WINDOW_SIZE_CHANGE';
export const ACTION_SET_ADMIN = 'ACTION_SET_ADMIN';

export const actionWindowSizeChanged = () => {
  return {
    type: ACTION_WINDOW_SIZE_CHANGE,
    payload: {
      width: window.innerWidth,
      height: window.innerHeight,
      ismobile: window.innerWidth <= Number(getCSSRootValue('--mobile-width'))
    }
  };
};

export const actionSetAdmin = (admin: Admin) => {
  return {
    type: ACTION_SET_ADMIN,
    payload: admin
  };
};

import * as actions from './actions';
import { getCSSRootValue } from '../helpers';
import { Admin } from 'api';

export interface InitialState {
  windowSize:{
    width:number,
    height:number,
    ismobile:boolean
  },
  admin: Admin | undefined
}

const initialState: InitialState = {
  windowSize: {
    width: window.innerWidth,
    height: window.innerHeight,
    ismobile: window.innerWidth <= Number(getCSSRootValue('--mobile-width'))
  },
  admin: undefined
};

const reducer = (state = initialState, action: { type: any;payload:any }) => {
  switch (action.type) {
    case actions.ACTION_WINDOW_SIZE_CHANGE:
      return {
        ...state,
        windowSize: {
          ...action.payload
        }
      };
    case actions.ACTION_SET_ADMIN:
      return {
        ...state,
        admin: action.payload
      };

    default:
      return state;
  }
};

export default reducer;

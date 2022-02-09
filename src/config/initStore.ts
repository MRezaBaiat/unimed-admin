import reducer from '../redux/reducer';
import { combineReducers, configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';

const rootReducer = combineReducers({
  global: reducer
});

export default function initStore (preloadedState) {
  const store = configureStore({
    reducer: rootReducer,
    middleware: [...getDefaultMiddleware()],
    preloadedState,
    enhancers: []
  });

  // adding HOT reloading capability
  // @ts-ignore
  if (process.env.NODE_ENV !== 'production' && module.hot) {
    // @ts-ignore
    module.hot.accept('../redux/reducer', () => store.replaceReducer(reducer));
  }

  return store;
}

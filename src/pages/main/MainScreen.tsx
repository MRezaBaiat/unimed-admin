// @ts-nocheck
import React, { useState } from 'react';
import Panel from '../../components/composite/panel/Panel';
import Header from '../../components/composite/header/Header';
import { Switch, Route, Redirect } from 'react-router-dom';
import routes from './routes';
import styles from './styles';
import { makeStyles } from '@material-ui/core/styles';
import AppScrollable from '../../components/base/app_scrollable/AppScrollable';

const useStyles = makeStyles(styles);

const switches = (
  <Switch>
    {routes.map((prop, key) => {
      if (prop.layout === '/admin') {
        return (
          <Route
            path={prop.layout + prop.path}
            render={() => prop.component}
            key={key}
          />
        );
      }
      return null;
    })}
    <Redirect from="/admin" to="/admin/users" />
  </Switch>
);

const MainScreen = () => {
  const classes = useStyles();
  const [Component, setComponent] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [color, setColor] = React.useState('blue');

  const onChange = (Component) => {
    setComponent(Component);
  };

  return (
    <div className={classes.wrapper}>
      {/* <Header/> */}
      <AppScrollable className='main-screen-container'>
        <Panel
          routes={routes.filter(s => s.getPermission())}
          logoText={'UNIMED'}
          handleDrawerToggle={() => setMobileOpen(!mobileOpen)}
          open={mobileOpen}
          color={color}
          onChange={onChange}/>
        <body>
          {
            Component && <Component/>
          }
        </body>
        <div >
          <div>{switches}</div>
        </div>
      </AppScrollable>
    </div>
  );
};

export default React.memo(MainScreen);

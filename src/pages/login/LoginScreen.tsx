import React, { useEffect, useState } from 'react';
import AppInput from '../../components/base/app_input/AppInput';
import AppButton from '../../components/base/app_button/AppButton';
import AuthService from '../../services/AuthService';
import NavigationHelper from '../../helpers/NavigationHelper';
import { makeStyles } from '@material-ui/core/styles';

import styles from './styles';
const useStyles = makeStyles(styles);

function LoginScreen (props) {
  const classes = useStyles();
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('');

  const signIn = () => {
    AuthService.signIn(username, password)
      .then(() => {
        NavigationHelper.navigateTo('/');
      }).catch(() => {
        alert('خطا در ورود');
      });
  };

  return (
    <div className={classes.container}>
      <div className={classes.container2} onKeyDown={(event) => {
        if (event.key === 'Enter') {
          signIn();
        }
      }}>
        <AppInput placeholder={'Username'} initialvalue={username} onChange={(text) => {
          setUsername(text);
        }}/>
        <AppInput placeholder={'Password'} type={'password'} initialvalue={password} onChange={(text) => {
          setPassword(text);
        }}/>
        <AppButton className={classes.button} round color={'primary'} text={'Login'} onClick={signIn}/>
      </div>
    </div>
  );
}

export default React.memo(LoginScreen);

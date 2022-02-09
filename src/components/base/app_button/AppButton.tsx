import React from 'react';
// nodejs library that concatenates classes
import classNames from 'classnames';
// nodejs library to set properties for components

// material-ui components
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Spinner from 'react-spinkit';

import styles from '../../../assets/jss/material-dashboard-react/components/buttonStyle.js';
import AppTextView from '../app_text/AppTextView';

// @ts-ignore
const useStyles = makeStyles(styles);

interface Props {
  text?: string,
  color?: 'primary'|
  'info'|
  'success'|
  'warning'|
  'danger'|
  'rose'|
  'white'|
  'transparent'
  size?: 'sm'| 'lg',
  onClick?:(e?)=>void,
  simple?: boolean,
  round?: boolean,
  disabled?: boolean,
  block?: boolean,
  link?: boolean,
  justIcon?: boolean,
  className?: string,
  // use this to pass the classes props from Material-UI
  muiClasses?: any,
  children?: any,
  progress?:number
}
export default function AppButton (props: Props) {
  const classes = useStyles();
  const {
    color,
    round,
    children,
    disabled,
    simple,
    size,
    block,
    link,
    justIcon,
    className,
    muiClasses,
    text,
    progress,
    onClick,
    ...rest
  } = props;
  const btnClasses = classNames({
    [classes.button]: true,
    // @ts-ignore
    [classes[size]]: size,
    // @ts-ignore
    [classes[color]]: color,
    [classes.round]: round,
    [classes.disabled]: disabled,
    [classes.simple]: simple,
    [classes.block]: block,
    [classes.link]: link,
    [classes.justIcon]: justIcon,
    // @ts-ignore
    [className]: className
  });
  return (
    <Button {...rest} onClick={progress === 50 ? undefined : onClick} classes={muiClasses} className={btnClasses}>
      {children}
      {progress === 50 &&
          <Spinner style={{ flexDirection: 'row' }} color={'white'} name='ball-beat' fadeIn="none" fadeOut="none"/>
      }
      {
        progress !== 50 &&
          <AppTextView text={text || ''}/>
      }
    </Button>
  );
}

AppButton.defaultProps = {
  progress: 0
};

/* import React from 'react';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';

interface Props{
  text: string,
  variant?: 'text' | 'outlined' | 'contained',
  type?: 'primary' | 'secondary',
  size?: 'large' | 'medium' | 'small',
  error?: boolean,
  onClick: ()=>void,
  textColor?: string,
  color?: string
}
export default class AppButton extends React.PureComponent<Props> {
  static defaultProps = {
    variant: 'text'
  };

  state={
    progressing: false
  };

  setProgressing = (progressing) => {
    this.setState({
      progressing: progressing
    });
  };

  render () {
    // @ts-ignore
    const { text, color, type, className, style } = this.props;
    const { progressing } = this.state;
    return (
      <Button color={type} {...this.props} style={{ ...style, color, textTransform: 'none' }}>

        {
          progressing && <CircularProgress size={14} />
        }
        {
          !progressing && <Typography>{text}</Typography>
        }
      </Button>
    );
  }
} */

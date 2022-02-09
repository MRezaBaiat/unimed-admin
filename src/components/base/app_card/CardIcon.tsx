import React from 'react';
// nodejs library that concatenates classes
import classNames from 'classnames';
// nodejs library to set properties for components
import { makeStyles } from '@material-ui/core/styles';
// @material-ui/icons

// core components
import styles from '../../../assets/jss/material-dashboard-react/components/cardIconStyle.js';

const useStyles = makeStyles(styles);

interface Props {
    className?: string,
    color?: 'warning'|
    'success'|
    'danger'|
    'info'|
    'primary'|
    'rose'
    children?: any
}
export default function CardIcon (props: Props) {
  const classes = useStyles();
  const { className, children, color, ...rest } = props;
  const cardIconClasses = classNames({
    [classes.cardIcon]: true,
    [classes[color + 'CardHeader']]: color,
    // @ts-ignore

    [className]: className !== undefined
  });
  return (
    <div className={cardIconClasses} {...rest}>
      {children}
    </div>
  );
}

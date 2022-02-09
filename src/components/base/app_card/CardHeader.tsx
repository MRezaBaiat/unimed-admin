import React from 'react';
// nodejs library that concatenates classes
import classNames from 'classnames';
// nodejs library to set properties for components
import { makeStyles } from '@material-ui/core/styles';
// @material-ui/icons

// core components
import styles from '../../../assets/jss/material-dashboard-react/components/cardHeaderStyle.js';

// @ts-ignore
const useStyles = makeStyles(styles);

interface Props {
    className?: string,
    color?: 'warning'|
    'success'|
    'danger'|
    'info'|
    'primary'|
    'rose'
    plain?: boolean,
    stats?: boolean,
    icon?: boolean,
    children?: any
}
export default function CardHeader (props: Props) {
  const classes = useStyles();
  const { className, children, color, plain, stats, icon, ...rest } = props;
  const cardHeaderClasses = classNames({
    [classes.cardHeader]: true,
    [classes[color + 'CardHeader']]: color,
    [classes.cardHeaderPlain]: plain,
    [classes.cardHeaderStats]: stats,
    [classes.cardHeaderIcon]: icon,
    // @ts-ignore
    [className]: className !== undefined
  });
  return (
    <div className={cardHeaderClasses} {...rest}>
      {children}
    </div>
  );
}

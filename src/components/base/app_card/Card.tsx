import React from 'react';
// nodejs library that concatenates classes
import classNames from 'classnames';
// nodejs library to set properties for components
import { makeStyles } from '@material-ui/core/styles';
// @material-ui/icons

// core components
import styles from '../../../assets/jss/material-dashboard-react/components/cardStyle.js';

// @ts-ignore
const useStyles = makeStyles(styles);

interface Props {
  className?: string,
  plain?: boolean,
  profile?: boolean,
  chart?: boolean,
  children?: any
}
export default function Card (props: Props) {
  const classes = useStyles();
  const { className, children, plain, profile, chart, ...rest } = props;
  const cardClasses = classNames({
    [classes.card]: true,
    [classes.cardPlain]: plain,
    [classes.cardProfile]: profile,
    [classes.cardChart]: chart,
    // @ts-ignore
    [className]: className !== undefined
  });
  return (
    <div className={cardClasses} {...rest}>
      {children}
    </div>
  );
}

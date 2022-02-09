import React from 'react';
// nodejs library that concatenates classes
import classNames from 'classnames';
// nodejs library to set properties for components
import { makeStyles } from '@material-ui/core/styles';
// @material-ui/icons

// core components
import styles from '../../../assets/jss/material-dashboard-react/components/cardFooterStyle.js';

const useStyles = makeStyles(styles);

interface Props {
    className?: string,
    plain?: boolean,
    profile?: boolean,
    stats?: boolean,
    chart?: boolean,
    children?: any
}
export default function CardFooter (props: Props) {
  const classes = useStyles();
  const { className, children, plain, profile, stats, chart, ...rest } = props;
  const cardFooterClasses = classNames({
    [classes.cardFooter]: true,
    [classes.cardFooterPlain]: plain,
    [classes.cardFooterProfile]: profile,
    [classes.cardFooterStats]: stats,
    [classes.cardFooterChart]: chart,
    // @ts-ignore
    [className]: className !== undefined
  });
  return (
    <div className={cardFooterClasses} {...rest}>
      {children}
    </div>
  );
}

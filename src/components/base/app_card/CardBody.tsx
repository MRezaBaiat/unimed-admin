import React from 'react';
// nodejs library that concatenates classes
import classNames from 'classnames';
// nodejs library to set properties for components
// @material-ui/core components
import { makeStyles } from '@material-ui/core/styles';
// @material-ui/icons

// core components
import styles from '../../../assets/jss/material-dashboard-react/components/cardBodyStyle.js';

// @ts-ignore
const useStyles = makeStyles(styles);

interface Props {
    className?: string,
    plain?: boolean,
    profile?: boolean,
    children?: any
}
export default function CardBody (props: Props) {
  const classes = useStyles();
  const { className, children, plain, profile, ...rest } = props;
  const cardBodyClasses = classNames({
    [classes.cardBody]: true,
    [classes.cardBodyPlain]: plain,
    [classes.cardBodyProfile]: profile,
    // @ts-ignore
    [className]: className !== undefined
  });
  return (
    <div className={cardBodyClasses} {...rest}>
      {children}
    </div>
  );
}

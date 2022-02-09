import React from 'react';
import { safeAssignStyles } from '../../../helpers/Utils';

interface Props{
  style?: any,
  src: any,
  fit?: 'contain' | 'cover' | 'fill' | 'scale-down' | 'none'
}
function AppImageView (props: Props) {
  const { fit } = props;
  return <img {...props} style={safeAssignStyles({ objectFit: fit, objectPosition: 'center' }, props.style)}/>;
}

AppImageView.defaultProps = {
  fit: 'cover'
};

export default React.memo(AppImageView);

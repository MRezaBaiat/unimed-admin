import PopperButton from '../popper_button/PopperButton';
import Settings from '@material-ui/icons/Settings';
import React from 'react';

interface Props {
    items:{text:string, onClick:()=>void}[]
}
const SettingView = (props: Props) => {
  const { items } = props;
  return (
    <PopperButton
      IconComponent={Settings}
      items={items}
    />
  );
};

export default SettingView;

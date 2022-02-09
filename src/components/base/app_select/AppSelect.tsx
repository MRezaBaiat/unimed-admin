// @ts-nocheck
import React from 'react';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';

interface Props<T>{
  options: T[],
  value: T,
  onChange: (value: T)=>void,
  getText: (value: T)=>string
}
function AppSelect (props: Props) {
  const { style, value, onChange, options, getText } = props;
  return (
    <Select SelectDisplayProps={{ style: { backgroundColor: 'white', ...style } }} value={value || ''} onChange={(event) => onChange(event.target.value)} displayEmpty>
      {
        options.map((val) => {
          return <MenuItem value={val}>{getText(val)}</MenuItem>;
        })
      }
    </Select>
  );
}

export default React.memo(AppSelect);

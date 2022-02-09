import React from 'react';
import AppButton from '../app_button/AppButton';
import { safeAssignStyles } from '../../../helpers/Utils';

interface Props{
  items:{label:string, value:any, render:()=>void}[],
  onChange?: (value: any, index: number)=>void,
  selectedValue:any,
  style?: any,
  contentStyle?: any,
  renderButton?:(title:string, value:any, isSelected: boolean)=>any
}
function AppTabs (props: Props) {
  const { items, onChange, selectedValue, style, renderButton, contentStyle } = props;
  const selectedItem = items.find(s => s.value === selectedValue);
  return (
    <div style={safeAssignStyles({ flexDirection: 'column' }, style)}>
      <div style={safeAssignStyles({ flexDirection: 'row', overflowX: 'scroll' }, contentStyle)}>
        {
          items.map((item, index) => {
            const isSelected = item === selectedItem;
            if (renderButton) {
              const Comp = renderButton(item.label, item.value, isSelected);
              return React.cloneElement(Comp, {
                onClick: () => {
                  onChange && onChange(item.value, index);
                }
              });
            }
            return <AppButton text={item.label} style={{ flex: 1 }} color={isSelected ? 'primary' : 'transparent'} onClick={() => {
              onChange && onChange(item.value, index);
            }}/>;
          })
        }
      </div>
      {
        selectedItem && selectedItem.render()
      }
    </div>
  );
}

export default React.memo(AppTabs);

import React from 'react';
import './styles.css';

interface Props {
    text: string,
    icon?: number,
    onClick:()=>void
}
function PanelButton (props: Props) {
  const { text, icon, onClick } = props;
  return (
    <div className='panel-button' onClick={onClick}>
      <text>
        {
          text
        }
      </text>
    </div>
  );
}

export default React.memo(PanelButton);

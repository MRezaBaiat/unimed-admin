import React from 'react';

export interface AppComponentProps{
  backgroundColor?: string
}

function AppComponent (Component) {
  return (props) => {
    const { backgroundColor, style } = props;
    return <Component {...props} style={{ ...style, ...{ backgroundColor } }}/>;
  };
}

export default AppComponent;

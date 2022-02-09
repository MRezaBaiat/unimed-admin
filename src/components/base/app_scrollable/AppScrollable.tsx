import React from 'react';
import 'react-perfect-scrollbar/dist/css/styles.css';
import PerfectScrollbar from 'react-perfect-scrollbar';
const isMobile = window.outerWidth <= 900;

function AppScrollable (props) {
  return isMobile
    ? <div {...props}>
      {
        props.children
      }
    </div>
    : <PerfectScrollbar {...props}>
      {
        props.children
      }
    </PerfectScrollbar>;
}

export default React.memo(AppScrollable);

// @ts-nocheck
import * as React from 'react';
import Dialog from '@material-ui/core/Dialog';

interface Props{
  open: boolean,
  style?:any,
  fullScreen?: boolean,
  onClose: ()=>void,
}
function SimpleDialog (props: Props) {
  const { onClose, open, fullScreen, style, children } = props;

  return (
    <Dialog fullScreen={fullScreen} style={style} onClose={onClose} open={open}>
      {
        children
      }
    </Dialog>
  );
}

export default React.memo(SimpleDialog);

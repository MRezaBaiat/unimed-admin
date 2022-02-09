import React from 'react';
import AppButton from '../../base/app_button/AppButton';
import Search from '@material-ui/icons/Search';
import AppInput from '../../base/app_input/AppInput';
import { makeStyles } from '@material-ui/core/styles';
import styles from './styles';

// @ts-ignore
const useStyles = makeStyles(styles);

interface Props {
    onChange:(text: string)=>void,
    onClick:()=>void
}
function SearchView (props: Props) {
  const classes = useStyles();
  const { onChange, onClick } = props;
  return (
    <div className={classes.searchWrapper}>
      <AppButton color="white" aria-label="edit" justIcon round onClick={onClick}>
        <Search />
      </AppButton>
      <AppInput
        placeholder={<div style={{ color: 'white' }}>جستجو</div>}
        onChange={onChange}
        formControlProps={{
          style: {
            marginRight: '10px'
          }
        }}
        inputProps={{
          inputProps: {
            'aria-label': 'جستجو'
          }
        }}
      />

    </div>
  );
}

export default React.memo(SearchView);

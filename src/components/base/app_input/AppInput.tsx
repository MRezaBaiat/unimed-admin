import React from 'react';
import classNames from 'classnames';
// @material-ui/core components
import { makeStyles } from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
// @material-ui/icons
import Clear from '@material-ui/icons/Clear';
import Check from '@material-ui/icons/Check';
// core components
import styles from '../../../assets/jss/material-dashboard-react/components/customInputStyle.js';

// @ts-ignore
const useStyles = makeStyles(styles);

interface Props {
  placeholder: any,
  labelProps?: any,
  id?: string,
  inputProps?: any,
  formControlProps?: any,
  initialvalue?:string,
  error?: boolean,
  success?: boolean,
  onChange?:(text: string)=>void,
  multiline?: boolean,
  type?: string, // see https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#Form_%3Cinput%3E_types
}
export default function AppInput (props: Props) {
  const classes = useStyles();
  const {
    formControlProps,
    placeholder,
    id,
    labelProps,
    inputProps,
    error,
    success,
    onChange,
    initialvalue,
    multiline,
    type
  } = props;

  const labelClasses = classNames({
    [' ' + classes.labelRootError]: error,
    [' ' + classes.labelRootSuccess]: success && !error
  });
  const underlineClasses = classNames({
    [classes.underlineError]: error,
    [classes.underlineSuccess]: success && !error,
    [classes.underline]: true
  });
  const marginTop = classNames({
    [classes.marginTop]: placeholder === undefined
  });
  return (
    <FormControl
      {...formControlProps}
      className={formControlProps.className + ' ' + classes.formControl}
    >
      {placeholder !== undefined ? (
        <InputLabel
          className={classes.labelRoot + labelClasses}
          htmlFor={id}
          {...labelProps}
        >
          {placeholder}
        </InputLabel>
      ) : null}
      <Input
        classes={{
          root: marginTop,
          disabled: classes.disabled,
          underline: underlineClasses
        }}
        type={type}
        multiline={multiline}
        value={initialvalue}
        onChange={(e) => {
          onChange && onChange(e.target.value);
        }}
        id={id}
        {...inputProps}
      />
      {error ? (
        <Clear className={classes.feedback + ' ' + classes.labelRootError} />
      ) : success ? (
        <Check className={classes.feedback + ' ' + classes.labelRootSuccess} />
      ) : null}
    </FormControl>
  );
}

AppInput.defaultProps = {
  formControlProps: { fullWidth: true }
};

/*
import React from 'react';
import { TextField } from '@material-ui/core';
import { getCSSRootValue } from '../../../helpers/Utils';
import { HTMLTypes, ValidatorField } from 'api';
import { AppComponentProps } from '../app_component/AppComponent';

// https://material-ui.com/components/text-fields/
interface Props extends AppComponentProps{
  onChange?: (text: string)=>void,
  fullWidth?: boolean,
  placeholder?: string,
  placeholderColor?: string,
  fontSize?: string,
  helperText?: string,
  type?: HTMLTypes,
  schema?: {schemaField: ValidatorField, schemaKey: string},
  initialvalue?: string,
}
class AppInput extends React.PureComponent<Props> {
  state={
    text: this.props.initialvalue || '',
    error: null
  };

  getText = () => {
    return this.state.text;
  };

  validateInputValue = (type, value) => {
    switch (type) {
      case 'name':
        while (/[^\w\s]/gi.test(value)) {
          value = value.substring(0, value.length - 1);
        }
        break;
    }
    return value;
  };

  render () {
    const { placeholder, placeholderColor, fontSize, className, helperText, type, backgroundColor, onChange } = this.props;
    const { error, text } = this.state;
    return (
      <div className={className} style={{ backgroundColor }}>
        <TextField error={error !== null && error !== undefined} InputLabelProps={{ style: { fontSize, color: placeholderColor || getCSSRootValue('--placeholder-color') } }} margin={'normal'} inputProps={{ style: { fontSize } }} color={'secondary'} label={placeholder} {...this.props} value={text} placeholder={null} helperText={error || helperText} onChange={(e) => {
          e.preventDefault();
          this.setState({
            text: this.validateInputValue(type, e.target.value)
          });
          onChange && onChange(e.target.value);
        }}/>
      </div>
    );
  }
}

export default AppInput;
*/

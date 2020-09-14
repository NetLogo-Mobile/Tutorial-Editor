/* eslint-disable react/prop-types */
import React from 'react';
import { Form } from 'semantic-ui-react';
import { getSemanticProps } from './util';

function CheckboxWidget(props) {
  const {
    id,
    value,
    required,
    disabled,
    readonly,
    label,
    autofocus,
    onChange,
    onBlur,
    options,
    onFocus,
    formContext,
  } = props;
  const semanticProps = getSemanticProps({ formContext, options });
  const _onChange = (event, data) => onChange && onChange(data.checked);
  const _onBlur = () => onBlur && onBlur(id, value);
  const _onFocus = () => onFocus && onFocus(id, value);
  const checked = value == 'true' || value == true;
  return (
    <Form.Checkbox
      id={id}
      disabled={disabled || readonly}
      autoFocus={autofocus}
      {...semanticProps}
      checked={typeof value === 'undefined' ? false : checked}
      onChange={_onChange}
      onBlur={_onBlur}
      onFocus={_onFocus}
      required={required}
      label={`Will ${
        value ? '' : 'not'
      } be activated when the tutorial is loaded`}
    />
  );
}

CheckboxWidget.defaultProps = {
  options: {
    semantic: {
      inverted: false,
    },
  },
};

export default CheckboxWidget;

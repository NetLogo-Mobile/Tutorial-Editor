import React, { Fragment } from 'react';
import { Form } from 'semantic-ui-react';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/material.css';
import { UnControlled as CodeMirror } from 'react-codemirror2';
import './code-mirror-widget.css';
require('../../lib/netlogo.js');
require('../../lib/netlogo.css');

const CodeMirrorWidget = (props) => {
  const { placeholder, options, onChange, required, value, label } = props;
  const defaultComments = `;;${placeholder}\n` || `;;To write netlogo code`;
  const _onChange = (value) => {
    console.log(value);
    onChange && onChange(value === '' ? options.emptyValue : value);
  };
  return (
    <Fragment>
      <Form.Field required={required}>
        <label>{label}</label>
        <CodeMirror
          value={value || defaultComments}
          options={{
            mode: 'netlogo',
            theme: 'netlogo-default',
            lineNumbers: true,
          }}
          onChange={(editor, data, value) => {
            _onChange(value);
          }}
        />
      </Form.Field>
    </Fragment>
  );
};

export default CodeMirrorWidget;

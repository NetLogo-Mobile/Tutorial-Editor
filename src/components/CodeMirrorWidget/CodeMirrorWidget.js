import React, { Fragment } from 'react';
import { Form } from 'semantic-ui-react';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/material.css';
import { UnControlled as CodeMirror } from 'react-codemirror2';
import './code-mirror-widget.css';
require('../../lib/netlogo.js');
require('../../lib/netlogo.css');

const CodeMirrorWidget = (props) => {
  const defaultComments = `;;${props.placeholder}\n`;
  return (
    <Fragment>
      <Form.Field required={props.required}>
        <label>{props.label}</label>
        <CodeMirror
          value={props.value || defaultComments}
          options={{
            mode: 'netlogo',
            theme: 'netlogo-default',
            lineNumbers: true,
          }}
        />
      </Form.Field>
    </Fragment>
  );
};

export default CodeMirrorWidget;

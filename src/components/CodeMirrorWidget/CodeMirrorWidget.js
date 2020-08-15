import React, { Fragment } from 'react';
import { Form } from 'semantic-ui-react';
import 'codemirror/addon/selection/active-line';
import 'codemirror/addon/edit/matchbrackets';
import 'codemirror/addon/edit/trailingspace';
import 'codemirror/addon/hint/show-hint';
import 'codemirror/addon/hint/show-hint.css';
import 'codemirror/lib/codemirror.css';
import { Controlled as CodeMirror } from 'react-codemirror2';
import './code-mirror-widget.css';
require('../../lib/netlogo.js');
require('../../lib/netlogo-hint.js');
require('../../lib/netlogo.css');

const CodeMirrorWidget = (props) => {
  const { placeholder, options, onChange, required, value, label } = props;
  const defaultComments = `;;${placeholder}\n` || `;;To write netlogo code`;
  const _onChange = (value) => {
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
            lineWrapping: true,
            styleActiveLine: true,
            styleActiveSelected: true,
            matchBrackets: true,
            showTrailingSpace: true,
            viewportMargin: Infinity,
            extraKeys: { 'Ctrl-Space': 'autocomplete' },
          }}
          onBeforeChange={(editor, data, value) => {
            _onChange(value);
            const reg = /[a-z0-9_]/i;
            const { origin, text } = data;
            if (origin === '+input' && (reg.test(text) || text[0] === ':')) {
              editor.showHint({
                completeSingle: false,
              });
            }
          }}
        />
      </Form.Field>
    </Fragment>
  );
};

export default CodeMirrorWidget;

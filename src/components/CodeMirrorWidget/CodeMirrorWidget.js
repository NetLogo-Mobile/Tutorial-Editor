import React, { Fragment, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Form } from 'semantic-ui-react';
import 'codemirror/addon/selection/active-line';
import 'codemirror/addon/edit/matchbrackets';
import 'codemirror/addon/edit/trailingspace';
import 'codemirror/addon/display/placeholder';
import 'codemirror/addon/hint/show-hint';
import 'codemirror/addon/hint/show-hint.css';
import 'codemirror/addon/runmode/runmode';
import 'codemirror/mode/meta';
import 'codemirror/lib/codemirror.css';
import CodeMirror from 'codemirror';
import { Controlled as CodeMirror2 } from 'react-codemirror2';
import './code-mirror-widget.css';
require('../../lib/netlogo.js');
require('../../lib/netlogo-hint.js');
require('../../lib/netlogo.css');

// MirrorLight is adapted from https://github.com/craftzdog/react-codemirror-runmode
class MirrorLight extends React.Component {
  static propTypes = {
    codeMirror: PropTypes.func.isRequired,
    className: PropTypes.string,
    theme: PropTypes.string,
    inline: PropTypes.bool,
    language: PropTypes.string,
    prefix: PropTypes.string,
    value: PropTypes.string.isRequired,
  };

  static defaultProps = {
    className: '',
    prefix: 'cm-',
  };

  render() {
    const {
      inline,
      codeMirror,
      value,
      language,
      className,
      prefix,
      theme,
      placeholder,
    } = this.props;
    const elements = [];
    let index = 0;
    let lastStyle = null;
    let tokenBuf = '';
    const pushElement = (token, style) => {
      elements.push(
        <span className={style ? prefix + style : ''} key={++index}>
          {token}
        </span>,
      );
    };

    codeMirror.runMode(value, language, (token, style) => {
      if (lastStyle === style) {
        tokenBuf += token;
        lastStyle = style;
      } else {
        if (tokenBuf) {
          pushElement(tokenBuf, lastStyle);
        }
        tokenBuf = token;
        lastStyle = style;
      }
    });
    pushElement(tokenBuf, lastStyle);

    const code = (
      <code className={inline ? `inline ${prefix}s-${theme}` : ''}>
        {elements}
      </code>
    );

    if (value === '') {
      return (
        <div class="CodeMirror-lines" role="presentation">
          <div role="presentation">
            <pre class="CodeMirror-placeholder CodeMirror-line-like">
              {placeholder}
            </pre>
          </div>
        </div>
      );
    }

    return inline ? (
      code
    ) : (
      <pre className={`${className} ${prefix}s-${theme}`}>{code}</pre>
    );
  }
}

const CodeMirrorWidget = (props) => {
  const { placeholder, options, onChange, required, value, label } = props;
  const [readOnly, setReadOnly] = useState(true);
  const [countDown, setCountDown] = useState(15);
  const [startCount, setStartCount] = useState(false);

  const _onChange = (value) => {
    onChange && onChange(value === '' ? options.emptyValue : value);
  };

  const onClick = () => {
    setReadOnly(false);
  };

  const onBlur = () => {
    setStartCount(true);
  };

  useEffect(() => {
    if (!startCount) {
      return;
    }

    let interval = setInterval(() => {
      if (countDown > 0) {
        setCountDown(countDown - 1);
      } else {
        setReadOnly(true);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [startCount, countDown]);

  const onFocus = () => {
    setCountDown(15);
    setStartCount(false);
  };

  return (
    <Fragment>
      <Form.Field required={required} onClick={onClick} onBlur={onBlur}>
        <label>{label}</label>
        {readOnly ? (
          <MirrorLight
            codeMirror={CodeMirror}
            className="editor-preview"
            theme="netlogo-default"
            value={value || ''}
            placeholder={placeholder}
            language="netlogo"
          />
        ) : (
          <CodeMirror2
            value={value || ''}
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
              placeholder: placeholder,
              autofocus: true,
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
            onFocus={onFocus}
          />
        )}
      </Form.Field>
    </Fragment>
  );
};

export default CodeMirrorWidget;

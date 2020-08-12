import React from 'react';
import Form from '@rjsf/core';
import SemanticUIForm from '@rjsf/semantic-ui';

class FixedForm extends Form {
  componentWillReceiveProps(nextProps) {
    const shouldSkipUpdate =
      Object.keys(nextProps).length === Object.keys(this.props).length &&
      Object.keys(nextProps).filter((key) => nextProps[key] !== this.props[key])
        .length === 0;
    if (shouldSkipUpdate) {
      return;
    }
    super.UNSAFE_componentWillReceiveProps(nextProps);
  }

  render() {
    return <SemanticUIForm {...this.props} />;
  }
}

export default FixedForm;

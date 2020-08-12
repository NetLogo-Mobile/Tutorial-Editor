import React from 'react';
import { Button, Icon } from 'semantic-ui-react';

function AddButton(props) {
  return (
    <Button {...props} icon size="tiny" labelPosition="left">
      <Icon name="plus" />
      {props['title']}
    </Button>
  );
}

export default AddButton;

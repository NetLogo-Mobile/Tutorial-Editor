import React from 'react';
import { PropTypes } from 'prop-types';
import { Menu, Sticky } from 'semantic-ui-react';

const TutorialMenu = ({ tutorial, contextRef }) => {
  return (
    <Sticky
      className="tutorial-menu__wrapper"
      offset={100}
      pushing={false}
      context={contextRef}
    >
      <Menu vertical>
        <Menu.Item>
          <Menu.Header>Sections</Menu.Header>
          <Menu.Menu>
            {tutorial.Sections
              ? tutorial.Sections.map((section) => (
                  <Menu.Item name={section.Name} />
                ))
              : null}
          </Menu.Menu>
        </Menu.Item>
        <Menu.Item>
          <Menu.Header>Dialogs</Menu.Header>
          <Menu.Menu>
            {tutorial.Dialogs
              ? tutorial.Dialogs.map((dialog) => (
                  <Menu.Item name={dialog.Name} />
                ))
              : null}
          </Menu.Menu>
        </Menu.Item>
      </Menu>
    </Sticky>
  );
};

TutorialMenu.defaultProps = {
  tutorial: {},
  contextRef: {},
};

TutorialMenu.propTypes = {
  tutorial: PropTypes.objectOf(PropTypes.object),
  contextRef: PropTypes.objectOf(PropTypes.object),
};

export default TutorialMenu;

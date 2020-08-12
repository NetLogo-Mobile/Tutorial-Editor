import React from 'react';
import { PropTypes } from 'prop-types';
import { Menu, Sticky } from 'semantic-ui-react';

const TutorialMenu = ({ tutorial, contextRef }) => {
  return (
    <Sticky
      className="tutorial-menu_wrapper"
      offset={100}
      pushing={false}
      context={contextRef}
    >
      <Menu vertical>
        <Menu.Item>
          <Menu.Header>Sections</Menu.Header>
          <Menu.Menu>
            {tutorial.Sections
              ? tutorial.Sections.map((section, index) => (
                  <Menu.Item
                    name={section.Name}
                    href={`#root_Sections_${index}_Name`}
                  >
                    {section.Name}
                  </Menu.Item>
                ))
              : null}
          </Menu.Menu>
        </Menu.Item>
        <Menu.Item>
          <Menu.Header>Dialogs</Menu.Header>
          <Menu.Menu>
            {tutorial.Dialogs
              ? tutorial.Dialogs.map((dialog, index) => (
                  <Menu.Item
                    name={dialog.Name}
                    href={`#root_Dialogs_${index}_Name`}
                  >
                    {dialog.Name}
                  </Menu.Item>
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

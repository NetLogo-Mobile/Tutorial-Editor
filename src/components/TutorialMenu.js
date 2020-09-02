import React, { useState } from 'react';
import { PropTypes } from 'prop-types';
import { Menu, Button } from 'semantic-ui-react';
import styled from '@emotion/styled';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

const ItemButton = styled.div`
  padding: 8px;
  padding-left: 0.93em;
  display: block;
  color: #333;
`;

function Item({ item, index }) {
  return (
    <Draggable draggableId={item.Name} index={index}>
      {(provided) => (
        <ItemButton
          as="a"
          href={`#root_Dialogs_${index}_Name`}
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          {item.Name}
        </ItemButton>
      )}
    </Draggable>
  );
}

const ItemList = React.memo(function ItemList({ items }) {
  return items.map((item: QuoteType, index: number) => (
    <Item item={item} index={index} key={item.Name} />
  ));
});

const TutorialMenu = ({ tutorial, setTutorial, contextRef }) => {
  function onDragSectionEnd(result) {
    if (!result.destination) {
      return;
    }

    if (result.destination.index === result.source.index) {
      return;
    }

    const items = reorder(
      tutorial.Sections,
      result.source.index,
      result.destination.index,
    );

    setTutorial({ Sections: items, Dialogs: tutorial.Dialogs });
  }

  function onDragDialogEnd(result) {
    if (!result.destination) {
      return;
    }

    if (result.destination.index === result.source.index) {
      return;
    }

    const items = reorder(
      tutorial.Dialogs,
      result.source.index,
      result.destination.index,
    );

    setTutorial({ Sections: tutorial.Sections, Dialogs: items });
  }

  return (
    <Menu vertical fluid>
      <Menu.Item>
        <Menu.Header>Sections</Menu.Header>
        <Menu.Menu>
          <DragDropContext onDragEnd={onDragSectionEnd}>
            <Droppable droppableId="list">
              {(provided) => (
                <div ref={provided.innerRef} {...provided.droppableProps}>
                  {tutorial.Sections ? (
                    <ItemList items={tutorial.Sections} />
                  ) : null}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </Menu.Menu>
      </Menu.Item>
      <Menu.Item>
        <Menu.Header>Dialogs</Menu.Header>
        <Menu.Menu>
          <DragDropContext onDragEnd={onDragDialogEnd}>
            <Droppable droppableId="list">
              {(provided) => (
                <div ref={provided.innerRef} {...provided.droppableProps}>
                  {tutorial.Dialogs ? (
                    <ItemList items={tutorial.Dialogs} />
                  ) : null}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </Menu.Menu>
      </Menu.Item>
    </Menu>
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

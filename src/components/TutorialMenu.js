import React, { useState } from 'react';
import { PropTypes } from 'prop-types';
import { Menu, Button } from 'semantic-ui-react';
import styled from '@emotion/styled';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const reorder = (tutorial, category, startIndex, endIndex) => {
  const result = Array.from(tutorial[category]);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  if (category == 'Sections') {
    return { Sections: result, Dialogs: tutorial.Dialogs };
  } else {
    return { Sections: tutorial.Sections, Dialogs: result };
  }
};

const ItemButton = styled.div`
  padding: 8px;
  padding-left: 0.93em;
  display: block;
  color: #333;
`;

function Item({ item, index, category }) {
  return (
    <Draggable draggableId={`${category}-${item.Name}`} index={index}>
      {(provided) => (
        <ItemButton
          as="a"
          href={`#root_${category}_${index}_Name`}
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

const ItemList = React.memo(function ItemList({ items, category }) {
  return items.map((item, index) => (
    <Item item={item} index={index} key={item.Name} category={category} />
  ));
});

const TutorialMenu = ({ tutorial, setTutorial }) => {
  function onDragSectionEnd(result) {
    if (!result.destination) {
      return;
    }

    if (result.destination.index === result.source.index) {
      return;
    }

    const category = result.draggableId.split('-')[0];

    const reorderedTutorial = reorder(
      tutorial,
      category,
      result.source.index,
      result.destination.index,
    );

    setTutorial(reorderedTutorial);
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
                    <ItemList items={tutorial.Sections} category="Sections" />
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
          <DragDropContext onDragEnd={onDragSectionEnd}>
            <Droppable droppableId="list">
              {(provided) => (
                <div ref={provided.innerRef} {...provided.droppableProps}>
                  {tutorial.Dialogs ? (
                    <ItemList items={tutorial.Dialogs} category="Dialogs" />
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
};

TutorialMenu.propTypes = {
  tutorial: PropTypes.objectOf(PropTypes.object),
};

export default TutorialMenu;

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

const QuoteItem = styled.div`
  padding: 8px;
  padding-left: 0.93em;
`;

function Item({ quote, index }) {
  return (
    <Draggable draggableId={quote.Name} index={index}>
      {(provided) => (
        <QuoteItem
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          {quote.Name}
        </QuoteItem>
      )}
    </Draggable>
  );
}

const ItemList = React.memo(function ItemList({ quotes }) {
  return quotes.map((quote: QuoteType, index: number) => (
    <Item quote={quote} index={index} key={quote.Name} />
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

    const quotes = reorder(
      tutorial.Sections,
      result.source.index,
      result.destination.index,
    );

    setTutorial({ Sections: quotes, Dialogs: tutorial.Dialogs });
  }

  function onDragDialogEnd(result) {
    if (!result.destination) {
      return;
    }

    if (result.destination.index === result.source.index) {
      return;
    }

    const quotes = reorder(
      tutorial.Dialogs,
      result.source.index,
      result.destination.index,
    );

    setTutorial({ Sections: tutorial.Sections, Dialogs: quotes });
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
                    <ItemList quotes={tutorial.Sections} />
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
                    <ItemList quotes={tutorial.Dialogs} />
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

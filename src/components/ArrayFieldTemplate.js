/* eslint-disable react/prop-types,react/destructuring-assignment */
import React from 'react';
import PropTypes from 'prop-types';
import { Button, Grid, Segment, Popup } from 'semantic-ui-react';
import { utils } from '@rjsf/core';
import AddButton from './AddButton';
import { cleanClassNames, getSemanticProps, MaybeWrap } from './util';

const { isFixedItems } = utils;

const pickColor = (title) => {
  switch (title) {
    case 'Sections':
    case 'Section':
      return 'violet';
    case 'Handlers':
    case 'Handler':
      return 'purple';
    case 'Dialogs':
    case 'Dialog':
      return 'violet';
    case 'Buttons':
    case 'Button':
      return 'orange';
    case 'Actions':
    case 'Action':
      return 'yellow';
    default:
      return 'grey';
  }
};

const transformColor = (colorName) => {
  switch (colorName) {
    case 'violet':
      return 'rgb(35, 102, 194, 0.6';
    case 'purple':
      return 'rgb(134, 69, 144. 0.6)';
    case 'orange':
      return 'rgb(245, 146, 73, 0.6)';
    case 'yellow':
      return 'FCBC40';
  }
};

const ArrayFieldTitle = ({ TitleField, idSchema, uiSchema, title }) => {
  if (!title) {
    return null;
  }

  const id = `${idSchema.$id}__title`;
  return <TitleField id={id} title={title} options={uiSchema['ui:options']} />;
};

function ArrayFieldDescription({ DescriptionField, idSchema, description }) {
  if (!description) {
    // See #312: Ensure compatibility with old versions of React.
    return null;
  }
  const id = `${idSchema.$id}__description`;
  return <DescriptionField id={id} description={description} />;
}

const gridStyle = (vertical) => ({
  display: 'grid',
  gridTemplateColumns: `${vertical ? 65 : 110}px 1fr `,
});

// checks if its the first array item
function isInitialArrayItem(props) {
  // no underscore because im not sure if we want to import a library here
  const { idSchema } = props.children.props;
  return idSchema.target && idSchema.conditions;
}

// Used in the two templates
function DefaultArrayItem(props) {
  const { uiSchema } = props.children.props;
  const fieldTitle = uiSchema['ui:title'];
  const color = transformColor(pickColor(fieldTitle));
  return (
    <div className="array-item" key={props.key}>
      <MaybeWrap wrap={props.wrapItem} component={Segment}>
        <Grid
          style={
            !isInitialArrayItem(props)
              ? { ...gridStyle(!props.horizontalButtons) }
              : gridStyle(!props.horizontalButtons)
          }
        >
          {props.hasToolbar && (
            <Grid.Column>
              {(props.hasMoveUp || props.hasMoveDown || props.hasRemove) && (
                <Button.Group
                  size="mini"
                  vertical={!props.horizontalButtons}
                  style={{ marginTop: '14px' }}
                >
                  {props.canAdd && (
                    <Popup
                      content={`Add ${fieldTitle} above`}
                      trigger={
                        <Button
                          icon="add"
                          className="array-item-add"
                          tabIndex="-1"
                          color={pickColor(fieldTitle)}
                          disabled={props.disabled || props.readOnly}
                          onClick={props.onAddIndexClick(props.index)}
                          style={{ marginBottom: '8px' }}
                        />
                      }
                      position="top right"
                      size="tiny"
                    />
                  )}

                  {(props.hasMoveUp || props.hasMoveDown) && (
                    <Popup
                      content={`Move up`}
                      trigger={
                        <Button
                          icon="angle double up"
                          className="array-item-move-up"
                          tabIndex="-1"
                          color={pickColor(fieldTitle)}
                          disabled={
                            props.disabled || props.readOnly || !props.hasMoveUp
                          }
                          onClick={props.onReorderClick(
                            props.index,
                            props.index - 1,
                          )}
                        />
                      }
                      position="left center"
                      size="tiny"
                    />
                  )}

                  {(props.hasMoveUp || props.hasMoveDown) && (
                    <Popup
                      content={`Move down`}
                      trigger={
                        <Button
                          icon="angle double down"
                          className="array-item-move-down"
                          tabIndex="-1"
                          color={pickColor(fieldTitle)}
                          disabled={
                            props.disabled ||
                            props.readOnly ||
                            !props.hasMoveDown
                          }
                          onClick={props.onReorderClick(
                            props.index,
                            props.index + 1,
                          )}
                        />
                      }
                      position="left center"
                      size="tiny"
                    />
                  )}

                  {props.hasRemove && (
                    <Popup
                      content={`Remove ${fieldTitle}`}
                      trigger={
                        <Button
                          icon="trash alternate"
                          className="array-item-remove"
                          tabIndex="-1"
                          color={pickColor(fieldTitle)}
                          disabled={props.disabled || props.readOnly}
                          onClick={props.onDropIndexClick(props.index)}
                          style={{ marginTop: '8px', opacity: '0.7' }}
                        />
                      }
                      position="bottom right"
                      size="tiny"
                    />
                  )}
                </Button.Group>
              )}
            </Grid.Column>
          )}

          <Grid.Column
            width={16}
            verticalAlign="middle"
            style={{
              borderLeft: `3px solid ${color}`,
              borderBottom: `1px dashed ${color}`,
            }}
          >
            {props.children}
          </Grid.Column>
        </Grid>
      </MaybeWrap>
    </div>
  );
}

// Used for arrays that are represented as multiple selection fields
// (displayed as a multi select or checkboxes)
function DefaultFixedArrayFieldTemplate({
  uiSchema,
  idSchema,
  canAdd,
  className,
  classNames,
  disabled,
  items,
  onAddClick,
  readOnly,
  required,
  schema,
  title,
  TitleField,
  itemProps,
}) {
  const fieldTitle = uiSchema['ui:title'] || title;
  const fieldDescription = uiSchema['ui:description'] || schema.description;
  const fieldChildren = uiSchema['ui:children'] || 'Item';

  return (
    <div className={cleanClassNames([className, classNames])}>
      <ArrayFieldTitle
        key={`array-field-title-${idSchema.$id}`}
        TitleField={TitleField}
        idSchema={idSchema}
        uiSchema={uiSchema}
        title={fieldTitle}
        required={required}
      />

      {fieldDescription && (
        <div
          className="field-description"
          key={`field-description-${idSchema.$id}`}
        >
          {fieldDescription}
        </div>
      )}

      <div key={`array-item-list-${idSchema.$id}`}>
        <div className="row array-item-list">
          {items && items.map((p) => DefaultArrayItem({ ...p, ...itemProps }))}
        </div>

        {canAdd && (
          <div
            style={{
              marginTop: '1rem',
              position: 'relative',
              textAlign: 'right',
            }}
          >
            <AddButton
              onClick={onAddClick}
              disabled={disabled || readOnly}
              color={pickColor(fieldChildren)}
            />
          </div>
        )}
      </div>
    </div>
  );
}

function DefaultNormalArrayFieldTemplate({
  uiSchema,
  idSchema,
  canAdd,
  className,
  classNames,
  disabled,
  DescriptionField,
  items,
  onAddClick,
  readOnly,
  required,
  schema,
  title,
  TitleField,
  itemProps,
}) {
  const fieldTitle = uiSchema['ui:title'] || title;
  const fieldDescription = uiSchema['ui:description'] || schema.description;
  const fieldChildren = uiSchema['ui:children'] || 'Item';
  return (
    <div
      className={cleanClassNames([
        className,
        classNames,
        'sortable-form-fields',
      ])}
    >
      {fieldDescription && (
        <ArrayFieldDescription
          key={`array-field-description-${idSchema.$id}`}
          DescriptionField={DescriptionField}
          idSchema={idSchema}
          description={fieldDescription}
        />
      )}

      <div key={`array-item-list-${idSchema.$id}`}>
        <div className="row array-item-list">
          {items &&
            items.map((p) => DefaultArrayItem({ ...p, ...itemProps, canAdd }))}
        </div>

        {canAdd && (
          <div
            style={{
              marginTop: '1rem',
              position: 'relative',
              textAlign: 'right',
            }}
          >
            <AddButton
              onClick={onAddClick}
              disabled={disabled || readOnly}
              title={`Add ${fieldChildren}`}
              color={pickColor(fieldChildren)}
            />
          </div>
        )}
      </div>
    </div>
  );
}

function ArrayFieldTemplate(props) {
  const { schema } = props;
  const { horizontalButtons, wrapItem } = getSemanticProps(props);
  const itemProps = { horizontalButtons, wrapItem };

  if (isFixedItems(schema)) {
    return <DefaultFixedArrayFieldTemplate {...props} itemProps={itemProps} />;
  }
  return <DefaultNormalArrayFieldTemplate {...props} itemProps={itemProps} />;
}

ArrayFieldTemplate.defaultProps = {
  options: {},
};

ArrayFieldTemplate.propTypes = {
  options: PropTypes.object,
};

export default ArrayFieldTemplate;

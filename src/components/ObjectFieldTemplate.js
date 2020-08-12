/* eslint-disable react/prop-types */
import React from 'react';

function ObjectFieldTemplate({
  DescriptionField,
  description,
  TitleField,
  title,
  properties,
  required,
  uiSchema,
  idSchema,
}) {
  const fieldTitle = uiSchema['ui:title'] || title;
  const fieldDescription = uiSchema['ui:description'] || description;
  const fieldName = properties
    .filter((prop) => prop.content.key === 'Name')
    .map((prop) => prop.content.props.idSchema.$id);
  return (
    <React.Fragment>
      {fieldTitle && (
        <TitleField
          id={`${idSchema.$id}-title`}
          title={fieldTitle}
          options={uiSchema['ui:options']}
          required={required}
        />
      )}
      {fieldName.length > 0 && <span id={fieldName[0]}></span>}
      {fieldDescription && (
        <DescriptionField
          id={`${idSchema.$id}-description`}
          description={fieldDescription}
        />
      )}
      {properties.map((prop) => prop.content)}
    </React.Fragment>
  );
}

export default ObjectFieldTemplate;

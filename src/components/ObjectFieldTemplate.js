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
      {fieldName.length > 0 && <div id={fieldName[0]}></div>}
      {fieldTitle && (
        <TitleField
          id={`${idSchema.$id}-title`}
          title={fieldTitle}
          options={uiSchema['ui:options']}
          required={required}
        />
      )}
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

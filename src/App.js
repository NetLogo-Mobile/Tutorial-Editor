import React, { useState, useEffect, useRef } from 'react';
import { Button, Container, Grid } from 'semantic-ui-react';
import $ from 'jquery';
import Form from '@rjsf/semantic-ui';
import TutorialMenu from './components/TutorialMenu';
import ArrayTemplate from './components/ArrayFieldTemplate';
import ObjectTemplate from './components/ObjectFieldTemplate';
import CodeMirrorWidget from './components/CodeMirrorWidget/CodeMirrorWidget';
import './App.css';

function App() {
  const [schema, setSchema] = useState({});
  const [uiSchema, setUISchema] = useState({});
  const [tutorialData, setTutorialData] = useState({});

  const widgets = {
    codeMirror: CodeMirrorWidget,
  };

  useEffect(() => {
    fetch(`${process.env.PUBLIC_URL}/tutorial-schema.json`)
      .then((res) => res.json())
      .then((data) => {
        setSchema(data);
      });
  }, []);

  useEffect(() => {
    fetch(`${process.env.PUBLIC_URL}/ui-schema.json`)
      .then((res) => res.json())
      .then((data) => {
        setUISchema(data);
      });
  }, []);

  const downloadFormData = ({ formData }) => {
    const dataStr = `data:text/json;charset=utf-8, ${encodeURIComponent(
      JSON.stringify(formData, 0, 2),
    )}`;
    const download = document.createElement('a');
    download.setAttribute('href', dataStr);
    download.setAttribute('download', 'form-data.json');
    document.body.appendChild(download);
    download.click();
    download.remove();
  };

  const onFileChange = ({ target: { files } }) => {
    if (files.length === 0) {
      return;
    }

    const file = files[0];
    const reader = new FileReader();

    reader.onload = (event) => {
      const json = JSON.parse(event.target.result);
      setTutorialData(json);
    };
    reader.readAsText(file);
  };

  const onClickUpload = () => {
    $('input[type=file]').click();
  };

  const onClickDownload = () => {
    $('Form button[type=submit]').click();
  };

  const onFormChange = ({ formData }) => {
    setTutorialData(formData);
  };

  const contextRef = useRef();

  return (
    <Container>
      <Grid columns="2">
        <Grid.Row>
          <Grid.Column width="12">
            <Container className="tutorial_container">
              <input
                type="file"
                accept=".json"
                onChange={onFileChange}
                style={{ display: 'none' }}
              />
              <Form
                schema={schema}
                uiSchema={uiSchema}
                formData={tutorialData}
                onSubmit={downloadFormData}
                onChange={onFormChange}
                ObjectFieldTemplate={ObjectTemplate}
                ArrayFieldTemplate={ArrayTemplate}
                widgets={widgets}
              />
            </Container>
          </Grid.Column>
          <Grid.Column width="4">
            <div className="tool_container">
              <Button.Group fluid>
                <Button onClick={onClickUpload}>
                  <i className="upload icon" />
                  Load
                </Button>
                <Button.Or />
                <Button positive onClick={onClickDownload}>
                  <i className="download icon" />
                  Save
                </Button>
              </Button.Group>
              <TutorialMenu tutorial={tutorialData} contextRef={contextRef} />
            </div>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Container>
  );
}

export default App;

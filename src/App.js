import React, { useState, useEffect } from 'react';
import { Button, Container, Dropdown, Grid } from 'semantic-ui-react';
import $ from 'jquery';
import Form from '@rjsf/semantic-ui';
import TutorialMenu from './components/TutorialMenu';
import ArrayTemplate from './components/ArrayFieldTemplate';
import ObjectTemplate from './components/ObjectFieldTemplate';
import CodeMirrorWidget from './components/CodeMirrorWidget/CodeMirrorWidget';
import CheckboxWidget from './components/CheckboxWidget';
import './App.css';

function App() {
  const [schema, setSchema] = useState({});
  const [uiSchema, setUISchema] = useState({});
  const [tutorialData, setTutorialData] = useState({});
  const [fileUpload, setFileUpload] = useState(null);
  const [loading, setLoading] = useState(false);

  const widgets = {
    codeMirror: CodeMirrorWidget,
    sectionCheckboxWidget: CheckboxWidget,
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

  useEffect(() => {
    if (fileUpload) {
      setLoading(false);
      setFileUpload(null);
    }
  }, [loading, fileUpload]);

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

  // Transform Button actions into Button Callback.
  // We deleted Button Action part, so need this transformation for previous tutorial json.
  const deleteButtonActions = (tutorial) => {
    tutorial.Dialogs.forEach((dialog) => {
      dialog.Buttons.forEach((button) => {
        if (button.Handlers) {
          const callbacks = [];
          button.Handlers.forEach((handler) => {
            if (handler.Callback) {
              callbacks.push(handler.Callback);
            }
          });
          button.Callback = callbacks.join('\n');
          delete button.Handlers;
        }
      });
    });
  };

  const onFileChange = ({ target: { files } }) => {
    if (files.length === 0) {
      return;
    }

    setLoading(true);
    const file = files[0];
    const reader = new FileReader();

    reader.onload = (event) => {
      const json = JSON.parse(event.target.result);
      deleteButtonActions(json);
      setTutorialData(json);
      setFileUpload(file);
    };
    reader.readAsText(file);
  };

  const uploadSample = () => {
    setLoading(true);
    fetch(`${process.env.PUBLIC_URL}/sample.json`)
      .then((res) => res.json())
      .then((data) => {
        setTutorialData(data);
        setFileUpload(true);
      });
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
                <Button>
                  <i className="upload icon" />
                  <Dropdown loading={loading} text="Load" labeled button>
                    <Dropdown.Menu>
                      <Dropdown.Item onClick={uploadSample}>
                        <i className="file alternate icon" />
                        Load a sample
                      </Dropdown.Item>
                      <Dropdown.Item active onClick={onClickUpload}>
                        <i className="folder open icon" />
                        Load your tutorial
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </Button>
                <Button.Or />
                <Button positive color="violet" onClick={onClickDownload}>
                  <i className="download icon" />
                  Save
                </Button>
              </Button.Group>
              <TutorialMenu
                tutorial={tutorialData}
                setTutorial={setTutorialData}
              />
            </div>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Container>
  );
}

export default App;

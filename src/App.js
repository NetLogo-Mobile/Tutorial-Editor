import React, { useState, useEffect } from 'react';
import {
  Button,
  Container,
  Dropdown,
  Grid,
  Modal,
  Header,
  Checkbox,
} from 'semantic-ui-react';
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
  const [open, setOpen] = React.useState(false);

  const [generatedSection, setGeneratedSection] = React.useState({});
  const [selectedDialogs, setSelectedDialogs] = React.useState([]);

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

  const onFileChange = ({ target: { files } }) => {
    if (files.length === 0) {
      return;
    }

    setLoading(true);
    const file = files[0];
    const reader = new FileReader();

    reader.onload = (event) => {
      const json = JSON.parse(event.target.result);
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

  const hasDuplicates = (array) => {
    return new Set(array).size !== array.length;
  };

  const validateForm = (id) => {
    const changedName = /root_.*Name/i.test(id);
    if (!changedName) {
      return;
    }
    let existedNames;
    if (id.includes('Sections')) {
      existedNames = tutorialData.Sections.map((section) => section.Name);
    } else {
      existedNames = tutorialData.Dialogs.map((dialog) => dialog.Name);
    }
    if (hasDuplicates(existedNames)) {
      const index = parseInt(id.split('_')[2], 10);
      const name = document.querySelector(`input#${id}`).value;
      const tutorialDataCopy = JSON.parse(JSON.stringify(tutorialData));
      let copyVersion = 1;
      while (existedNames.includes(`${name}-${copyVersion}`)) {
        copyVersion += 1;
      }
      if (id.includes('Sections')) {
        tutorialDataCopy.Sections[index].Name = `${name}-${copyVersion}`;
      } else {
        tutorialDataCopy.Dialogs[index].Name = `${name}-${copyVersion}`;
      }
      setTutorialData(tutorialDataCopy);
      document.querySelector(`input#${id}`).value = `${name}-${copyVersion}`;
    }
  };

  const closeModel = () => {
    setOpen(false);
    setSelectedDialogs([]);
    setGeneratedSection({});
  };

  const generateSection = () => {
    setOpen(false);

    const tutorialDataCopy = JSON.parse(JSON.stringify(tutorialData));
    if (tutorialDataCopy.Sections) {
      tutorialDataCopy.Sections = tutorialData.Sections.concat(
        generatedSection,
      );
      setTutorialData(tutorialDataCopy);
    } else {
      tutorialDataCopy.Sections = [generatedSection];
    }
    setTutorialData(tutorialDataCopy);
    setSelectedDialogs([]);
  };

  React.useEffect(() => {
    if (selectedDialogs.length === 0) {
      setGeneratedSection({});
    } else {
      setGeneratedSection({
        Name: selectedDialogs[0],
        Activated: false,
        Initializer: `tutorial:show-dialog ${selectedDialogs[0]}`,
        Finalizer: selectedDialogs
          .map((dialog) => {
            return `tutorial:hide-dialog ${dialog}`;
          })
          .join('\n'),
      });
    }
  }, [selectedDialogs]);

  const onChangeDialogCheckbox = (event, data) => {
    const { dialogName } = data;
    if (data.checked === false) {
      setSelectedDialogs(
        selectedDialogs.filter((value) => {
          return value !== dialogName;
        }),
      );
    } else {
      setSelectedDialogs(selectedDialogs.concat(dialogName));
    }
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
                onBlur={validateForm}
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
              <Modal
                onClose={closeModel}
                onOpen={() => setOpen(true)}
                open={open}
                trigger={
                  <Button fluid style={{ marginTop: '16px' }}>
                    Add dialog-related Section
                  </Button>
                }
              >
                <Modal.Header>Generate Dialog-related Section</Modal.Header>
                <Modal.Content image>
                  <Modal.Description>
                    <Header>Dialog List</Header>
                    {tutorialData.Dialogs
                      ? tutorialData.Dialogs.map((dialog) => {
                          return (
                            <Checkbox
                              onChange={onChangeDialogCheckbox}
                              label={`${dialog.Name}`}
                              dialogName={`${dialog.Name}`}
                              style={{ display: 'block', marginBottom: '10px' }}
                            />
                          );
                        })
                      : null}
                  </Modal.Description>
                </Modal.Content>
                <Modal.Actions>
                  <Button color="black" onClick={closeModel}>
                    Cancel
                  </Button>
                  <Button
                    content="Generate Section"
                    labelPosition="right"
                    icon="checkmark"
                    onClick={generateSection}
                    positive
                  />
                </Modal.Actions>
              </Modal>
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

import React, { useState, useEffect } from 'react';
import Form from '@rjsf/semantic-ui';
import { Button, Container, Sticky, Grid } from 'semantic-ui-react';
import $ from 'jquery';
import './App.css';

function App() {
  const [schema, setSchema] = useState({});
  const [uiSchema, setUISchema] = useState({});
  const [uploadedFormData, setUploadedFormData] = useState({});

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
      setUploadedFormData(json);
    };
    reader.readAsText(file);
  };

  const onClickUpload = () => {
    $('input[type=file]').click();
  };

  const onClickDownload = () => {
    $('Form button[type=submit]').click();
  };

  return (
    <div className="App">
      <Grid>
        <Grid.Column width={3}>
          <h3>Tutorial Editor</h3>
        </Grid.Column>
        <Grid.Column width={13}>
          <Sticky>
            <Container className="tutorial__header">
              <Button.Group>
                <Button onClick={onClickUpload}>
                  <i className="upload icon" />
                  Upload
                </Button>
                <Button.Or />
                <Button positive onClick={onClickDownload}>
                  <i className="download icon" />
                  Download
                </Button>
              </Button.Group>
            </Container>
          </Sticky>
          <Container className="tutorial__container">
            <input
              type="file"
              accept=".json"
              onChange={onFileChange}
              style={{ display: 'none' }}
            />
            <Form
              schema={schema}
              uiSchema={uiSchema}
              formData={uploadedFormData}
              onSubmit={downloadFormData}
            />
          </Container>
        </Grid.Column>
      </Grid>
    </div>
  );
}

export default App;

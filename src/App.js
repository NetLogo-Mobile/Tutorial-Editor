import React, { useState, useEffect } from 'react';
import Form from '@rjsf/semantic-ui';
import './App.css';

function App() {
  const [selectFile, setSelectFile] = useState(null);
  const [schema, setSchema] = useState({});
  const [uiSchema, setUISchema] = useState({});
  const [formData, setFormData] = useState({});

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

  const downloadFormData = (form) => {
    const dataStr = `data:text/json;charset=utf-8, ${encodeURIComponent(
      JSON.stringify(form, 0, 2),
    )}`;
    const download = document.createElement('a');
    download.setAttribute('href', dataStr);
    download.setAttribute('download', 'form-data.json');
    document.body.appendChild(download);
    download.click();
    download.remove();
  };

  const onSubmit = ({ form }) => {
    downloadFormData(form);
  };

  const onFileChange = ({ target: { files } }) => {
    setSelectFile(files[0]);
  };

  const uploadFile = () => {
    if (!selectFile) {
      return;
    }

    const reader = new FileReader();

    reader.onload = (event) => {
      const json = JSON.parse(event.target.result);
      setFormData(json);
    };

    reader.readAsText(selectFile);
  };

  return (
    <div className="App">
      <input type="file" accept=".json" onChange={onFileChange} />
      <button type="button" onClick={uploadFile}>
        Upload
      </button>
      <Form
        schema={schema}
        uiSchema={uiSchema}
        formData={formData}
        onSubmit={onSubmit}
      />
    </div>
  );
}

export default App;

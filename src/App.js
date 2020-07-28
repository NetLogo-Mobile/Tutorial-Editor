import React, { useState, useEffect } from 'react';
import Form from "@rjsf/material-ui";
import './App.css';

function App() {
  const [schema, setSchema] = useState({});

  useEffect(() => {
    fetch(`${process.env.PUBLIC_URL}/tutorial-schema.json`)
    .then((res) => res.json())
    .then((data) => {
      setSchema(data);
    });
  }, []);

  return (
    <div className="App">
      <Form schema={schema}/>
    </div>
  );
}

export default App;

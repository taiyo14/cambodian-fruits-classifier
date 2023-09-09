import React from 'react';
import ReactDOM from 'react-dom/client';
import ImageClassifier from './application.js';
import '@fontsource/roboto/500.css';

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <ImageClassifier />
  </React.StrictMode>
);
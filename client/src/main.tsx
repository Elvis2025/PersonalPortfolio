import React from 'react';
import ReactDOM from 'react-dom/client';
import '/vendor/bootstrap/css/bootstrap.min.css';
import '/vendor/bootstrap-icons/bootstrap-icons.css';
import './styles/main.scss';
import './styles/custom.scss';
import { App } from './App';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/main.scss';
import './styles/custom.scss';
import './styles/experience.scss';
import { App } from './app/App';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

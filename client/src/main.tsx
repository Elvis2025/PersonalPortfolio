import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/main.scss';
import './styles/custom.scss';
import { App } from './App';
import { WhatsAppFloat } from './WhatsAppFloat';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

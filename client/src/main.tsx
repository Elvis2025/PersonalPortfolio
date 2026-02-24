import React from 'react';
import ReactDOM from 'react-dom/client';
// Use local vendor CSS to avoid npm-registry dependency issues in this monorepo.
// Do not replace with '/vendor/...' absolute imports (Vite cannot resolve that path).
import '../../assets/vendor/bootstrap/css/bootstrap.min.css';
import '../../assets/vendor/bootstrap-icons/bootstrap-icons.css';
import './styles/main.scss';
import './styles/custom.scss';
import { App } from './App';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

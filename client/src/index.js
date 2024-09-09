import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { ContextProvider } from './context/Context';
import { TerminalProvider } from './context/TerminalContext';

import './styles.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  // <React.StrictMode>

  <BrowserRouter>
    <ContextProvider>
      <TerminalProvider>
        <App />
      </TerminalProvider>
    </ContextProvider>
  </BrowserRouter>

  // </React.StrictMode>
);

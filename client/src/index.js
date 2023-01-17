import React from 'react';
import ReactDOM from 'react-dom/client';
import './main.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { ContextProvider } from './context/Context';
import { TerminalProvider } from './context/TerminalContext';
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

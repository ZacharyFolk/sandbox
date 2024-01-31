import React from 'react';
import ReactDOM from 'react-dom/client';
// import './main.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { ContextProvider } from './context/Context';
import { TerminalProvider } from './context/TerminalContext';
import { ThemeProvider, createTheme, styled } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
  overrides: {
    MuiContainer: {
      maxWidth: '99%',
    },
  },
});

ReactDOM.createRoot(document.getElementById('root')).render(
  // <React.StrictMode>
  <ThemeProvider theme={darkTheme}>
    <CssBaseline />
    <BrowserRouter>
      <ContextProvider>
        <TerminalProvider>
          <App />
        </TerminalProvider>
      </ContextProvider>
    </BrowserRouter>
  </ThemeProvider>
  // </React.StrictMode>
);

import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

import { SearchContextProvider } from "./context/search_context"

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <SearchContextProvider>
      <App />
    </SearchContextProvider>
  </React.StrictMode>
);
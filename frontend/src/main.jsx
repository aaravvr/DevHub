// Import react core and rendering modules
import React from 'react';
import ReactDOM from 'react-dom/client';

import { BrowserRouter } from 'react-router-dom';

// Redux provider for state management
import { Provider } from 'react-redux';

// Import app which defines app structure and routes
import App from './App';

import store from './app/store';

// Creates DOM
ReactDOM.createRoot(document.getElementById('root')).render(
  // Provider connects react and redux in the app
  // BrowserRouter allows client-side routing (change without reload)
  // App contains routes and layout
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>
);
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from '../App';

// Make sure your index.html contains: <div id="root"></div>
const container = document.getElementById('root');
if (!container) {
  // Defensive: fail loudly so you can see why nothing renders
  throw new Error('No #root element found in HTML. Add <div id="root"></div> to your index.html.');
}

const root = createRoot(container);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
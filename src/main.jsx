import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './styles.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

// Remove initial HTML loader once React has mounted and the scene begins loading.
// The R3F Loader takes over from here.
window.addEventListener('load', () => {
  requestAnimationFrame(() => {
    setTimeout(() => {
      const loader = document.getElementById('initial-loader');
      if (loader) {
        loader.classList.add('hidden');
        setTimeout(() => loader.remove(), 700);
      }
    }, 300);
  });
});

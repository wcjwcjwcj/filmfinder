import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

if (window.location.href.indexOf('localhost') !== -1) {
  window.location.href = window.location.href.replace('localhost', '127.0.0.1');
}

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement,
);
root.render(<App />);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

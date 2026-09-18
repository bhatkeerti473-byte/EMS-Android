import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { AdminProvider } from './admin/context/AdminContext';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { App as CapApp } from '@capacitor/app';
import reportWebVitals from './reportWebVitals';

// ─── Android Hardware Back Button Handler ────────────────────────────────────
// Prevents the app from closing when the phone back button is pressed.
// On home/login pages → minimize app. On other pages → go back in history.
try {
  CapApp.addListener('backButton', ({ canGoBack }) => {
    const currentPath = window.location.pathname;
    if (currentPath === '/' || currentPath === '/login' || currentPath === '') {
      CapApp.minimizeApp();
    } else if (canGoBack) {
      window.history.back();
    } else {
      window.history.back();
    }
  });
} catch (e) {
  // Running in browser
}
// ─────────────────────────────────────────────────────────────────────────────

const googleClientId = process.env.REACT_APP_GOOGLE_CLIENT_ID ||
  '685762159805-5hrhspefo76lum330n5lk4eiuqhnq78p.apps.googleusercontent.com';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={googleClientId}>
      <BrowserRouter>
        <AdminProvider>
          <App />
        </AdminProvider>
      </BrowserRouter>
    </GoogleOAuthProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
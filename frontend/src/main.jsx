import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';
import { ClientProvider } from './client/context/ClientContext';
import { AuthProvider } from './superAdmin/context/AuthContext';
import socket from './socket/sockat';

console.log('Socket client initialized:', socket.id);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <ClientProvider>
        <AuthProvider>
 <App />
        </AuthProvider>
       
      </ClientProvider>
    </BrowserRouter>
  </React.StrictMode>
);

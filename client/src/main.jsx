import React from 'react';
import { createRoot } from 'react-dom/client';

import './index.css';
import AppRoutes from './AppRoutes.jsx';

import { AuthProvider } from './contexts/AuthContext.jsx';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  </React.StrictMode>,
);

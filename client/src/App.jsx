import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Navbar from './components/Navbar';
import AppRoutes from './AppRoutes';

const App = () => {
  return (
    <Router>
      <div className="min-h-screen w-full bg-gray-100">
        <Navbar />
        <div className="p-4">
          <AppRoutes />
        </div>
      </div>
    </Router>
  );
};

export default App;
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Register from './pages/Register.jsx';
import Login from './pages/Login.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Profile from './pages/Profile.jsx';
import BlogList from './pages/BlogList.jsx';
import BlogDetail from './pages/BlogDetail.jsx';
import CreateEditBlog from './pages/CreateEditBlog.jsx'; // Reused for both create and edit
import HomePage from './pages/HomePage.jsx';
import SearchResults from './pages/SearchResults.jsx'; // <-- Import SearchResults

import ProtectedRoute from './components/ProtectedRoute.jsx';
import MainLayout from './layouts/MainLayout.jsx';

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        {/* Protected routes wrapped in MainLayout */}
        <Route
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />

          {/* Blog routes */}
          <Route path="/blogs" element={<BlogList />} />
          <Route path="/create" element={<CreateEditBlog />} />
          <Route path="/blogs/:id" element={<BlogDetail />} />
          <Route path="/blogs/:id/edit" element={<CreateEditBlog />} /> {/* ← NEW */}

          {/* Search results page */}
          <Route path="/search" element={<SearchResults />} /> {/* <-- Added search route */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;

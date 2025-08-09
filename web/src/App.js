import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import HomePage from './components/HomePage';
import AddIdea from './components/AddIdea';
import AddProject from './components/AddProject';
import Vote from './components/Vote';
import ApplicationTracking from './components/ApplicationTracking';
import Moderation from './components/Moderation';
import Login from './components/Login';
import Register from './components/Register';
import AdminLogin from './components/AdminLogin';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './contexts/AuthContext';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/admin-login" element={<AdminLogin />} />
            <Route path="/" element={<ProtectedRoute><><Header /><HomePage /></></ProtectedRoute>} />
            <Route path="/add-idea" element={<ProtectedRoute><><Header /><AddIdea /></></ProtectedRoute>} />
            <Route path="/add-project" element={<ProtectedRoute><><Header /><AddProject /></></ProtectedRoute>} />
            <Route path="/vote" element={<ProtectedRoute><><Header /><Vote /></></ProtectedRoute>} />
            <Route path="/application-tracking" element={<ProtectedRoute><><Header /><ApplicationTracking /></></ProtectedRoute>} />
            <Route path="/moderation" element={<ProtectedRoute adminOnly><><Header /><Moderation /></></ProtectedRoute>} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;

import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  // Loading durumunda spinner göster
  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontSize: '18px',
        color: '#667eea'
      }}>
        <i className="fas fa-spinner fa-spin" style={{ marginRight: '10px' }}></i>
        Yükleniyor...
      </div>
    );
  }

  // Authenticated değilse login sayfasına yönlendir
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Authenticated ise children'ı render et
  return children;
};

export default ProtectedRoute; 
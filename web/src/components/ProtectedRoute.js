import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { isAuthenticated, loading, admin } = useAuth();
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
        color: '#666'
      }}>
        Yükleniyor...
      </div>
    );
  }

  // Kullanıcı giriş yapmamışsa login sayfasına yönlendir
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Sadece adminlere açık rota ise ve admin değilse ana sayfaya yönlendir
  if (adminOnly && !admin) {
    return <Navigate to="/" replace />;
  }

  // Kullanıcı giriş yapmışsa içeriği göster
  return children;
};

export default ProtectedRoute;

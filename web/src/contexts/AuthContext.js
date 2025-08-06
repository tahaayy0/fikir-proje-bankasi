import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiService } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('adminToken'));
  const [loading, setLoading] = useState(true);

  // Token'ı localStorage'a kaydet
  const saveToken = (newToken) => {
    setToken(newToken);
    if (newToken) {
      localStorage.setItem('adminToken', newToken);
      // API service'e token'ı set et
      apiService.setAuthToken(newToken);
    } else {
      localStorage.removeItem('adminToken');
      apiService.removeAuthToken();
    }
  };

  // Admin giriş yapma
  const login = async (mail, sifre) => {
    try {
      const response = await apiService.adminLogin(mail, sifre);
      const { admin: adminData, token: newToken } = response.data.data;
      
      setAdmin(adminData);
      saveToken(newToken);
      
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Giriş yapılamadı'
      };
    }
  };

  // Admin çıkış yapma
  const logout = async () => {
    try {
      if (token) {
        await apiService.adminLogout();
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setAdmin(null);
      saveToken(null);
    }
  };

  // Admin profilini getir
  const getProfile = async () => {
    try {
      const response = await apiService.getAdminProfile();
      setAdmin(response.data.data.admin);
      return { success: true };
    } catch (error) {
      console.error('Get profile error:', error);
      // Token geçersizse çıkış yap
      if (error.response?.status === 401) {
        logout();
      }
      return { success: false };
    }
  };

  // Token ile otomatik giriş kontrolü
  useEffect(() => {
    const initializeAuth = async () => {
      if (token) {
        // API service'e token'ı set et
        apiService.setAuthToken(token);
        
        // Profil bilgilerini getir
        const result = await getProfile();
        if (!result.success) {
          // Profil getirilemezse token'ı temizle
          saveToken(null);
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const value = {
    admin,
    token,
    loading,
    login,
    logout,
    getProfile,
    isAuthenticated: !!admin && !!token
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 
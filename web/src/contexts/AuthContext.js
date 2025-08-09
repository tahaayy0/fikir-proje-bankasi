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
  const [user, setUser] = useState(null);
  const [admin, setAdmin] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('userToken') || localStorage.getItem('adminToken'));
  const [loading, setLoading] = useState(true);

  // Token'ı localStorage'a kaydet
  const saveToken = (newToken, userType = 'user') => {
    setToken(newToken);
    if (newToken) {
      const storageKey = userType === 'admin' ? 'adminToken' : 'userToken';
      localStorage.setItem(storageKey, newToken);
      // API service'e token'ı set et
      apiService.setAuthToken(newToken);
    } else {
      localStorage.removeItem('userToken');
      localStorage.removeItem('adminToken');
      apiService.removeAuthToken();
    }
  };

  // User giriş yapma
  const userLogin = async (email, password) => {
    try {
      const response = await apiService.userLogin(email, password);
      const { user: userData, token: newToken } = response.data.data;
      
      setUser(userData);
      saveToken(newToken, 'user');
      
      return { success: true };
    } catch (error) {
      console.error('User login error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Giriş yapılamadı'
      };
    }
  };

  // User kayıt olma
  const userRegister = async (userData) => {
    try {
      const response = await apiService.userRegister(userData);
      return { success: true, message: response.data.message };
    } catch (error) {
      console.error('User register error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Kayıt olunamadı'
      };
    }
  };

  // Admin giriş yapma
  const adminLogin = async (mail, sifre) => {
    try {
      const response = await apiService.adminLogin(mail, sifre);
      const { admin: adminData, token: newToken } = response.data.data;
      
      setAdmin(adminData);
      saveToken(newToken, 'admin');
      
      return { success: true };
    } catch (error) {
      console.error('Admin login error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Giriş yapılamadı'
      };
    }
  };

  // Çıkış yapma
  const logout = async () => {
    try {
      if (token) {
        if (admin) {
          await apiService.adminLogout();
        } else {
          await apiService.userLogout();
        }
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      setAdmin(null);
      saveToken(null);
    }
  };

  // User profilini getir
  const getUserProfile = async () => {
    try {
      const response = await apiService.getUserProfile();
      setUser(response.data.data.user);
      return { success: true };
    } catch (error) {
      console.error('Get user profile error:', error);
      if (error.response?.status === 401) {
        logout();
      }
      return { success: false };
    }
  };

  // Admin profilini getir
  const getAdminProfile = async () => {
    try {
      const response = await apiService.getAdminProfile();
      setAdmin(response.data.data.admin);
      return { success: true };
    } catch (error) {
      console.error('Get admin profile error:', error);
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
        
        // Token tipini belirle ve profil bilgilerini getir
        try {
          const tokenData = JSON.parse(atob(token.split('.')[1]));
          if (tokenData.type === 'admin') {
            const result = await getAdminProfile();
            if (!result.success) {
              saveToken(null);
            }
          } else {
            const result = await getUserProfile();
            if (!result.success) {
              saveToken(null);
            }
          }
        } catch (error) {
          console.error('Token decode error:', error);
          saveToken(null);
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const value = {
    user,
    admin,
    token,
    loading,
    userLogin,
    userRegister,
    adminLogin,
    logout,
    getUserProfile,
    getAdminProfile,
    isAuthenticated: !!(user || admin) && !!token
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 
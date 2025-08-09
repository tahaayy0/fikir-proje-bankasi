import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Auth.css';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { userLogin, adminLogin } = useAuth();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Önce admin girişi dene
      const adminResult = await adminLogin(formData.email, formData.password);
      if (adminResult.success) {
        navigate('/moderation');
        return;
      }

      // Admin değilse normal kullanıcı girişi dene
      const userResult = await userLogin(formData.email, formData.password);
      if (userResult.success) {
        navigate('/');
      } else {
        setError(userResult.message || 'Geçersiz e-posta veya şifre');
      }
    } catch (error) {
      setError('Giriş yapılırken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Giriş Yap</h2>
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">E-posta</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="E-posta adresinizi girin"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Şifre</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Şifrenizi girin"
            />
          </div>

          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
          </button>
        </form>

        <div className="auth-links">
          <p>
            Hesabınız yok mu? <Link to="/register">Kayıt Ol</Link>
          </p>
          <p>
            Admin misiniz? <Link to="/admin-login">Admin Girişi</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;

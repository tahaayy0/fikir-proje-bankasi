import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Auth.css';

const AdminLogin = () => {
  const [formData, setFormData] = useState({
    mail: '',
    sifre: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { adminLogin } = useAuth();

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
      const result = await adminLogin(formData.mail, formData.sifre);
      if (result.success) {
        navigate('/moderation');
      } else {
        setError(result.message);
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
        <h2>Admin Girişi</h2>
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="mail">E-posta</label>
            <input
              type="email"
              id="mail"
              name="mail"
              value={formData.mail}
              onChange={handleChange}
              required
              placeholder="Admin e-posta adresinizi girin"
            />
          </div>

          <div className="form-group">
            <label htmlFor="sifre">Şifre</label>
            <input
              type="password"
              id="sifre"
              name="sifre"
              value={formData.sifre}
              onChange={handleChange}
              required
              placeholder="Admin şifrenizi girin"
            />
          </div>

          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? 'Giriş yapılıyor...' : 'Admin Girişi'}
          </button>
        </form>

        <div className="auth-links">
          <p>
            Normal kullanıcı mısınız? <Link to="/login">Kullanıcı Girişi</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Login.css';

const Login = () => {
  const [formData, setFormData] = useState({
    mail: '',
    sifre: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
    // Hata mesajını temizle
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await login(formData.mail, formData.sifre);
      
      if (result.success) {
        // Başarılı giriş - dashboard'a yönlendir
        navigate('/dashboard');
      } else {
        setError(result.message);
      }
    } catch (error) {
      setError('Giriş yapılırken bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>Admin Girişi</h1>
          <p>Fikir Proje Bankası Yönetim Paneli</p>
        </div>

        {error && (
          <div className="error-message">
            <i className="fas fa-exclamation-circle"></i>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="mail">E-posta</label>
            <div className="input-wrapper">
              <i className="fas fa-envelope"></i>
              <input
                type="email"
                id="mail"
                name="mail"
                value={formData.mail}
                onChange={handleInputChange}
                placeholder="admin@fikirprojebankasi.com"
                required
                disabled={loading}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="sifre">Şifre</label>
            <div className="input-wrapper">
              <i className="fas fa-lock"></i>
              <input
                type="password"
                id="sifre"
                name="sifre"
                value={formData.sifre}
                onChange={handleInputChange}
                placeholder="Şifrenizi girin"
                required
                disabled={loading}
              />
            </div>
          </div>

          <button 
            type="submit" 
            className="login-button"
            disabled={loading}
          >
            {loading ? (
              <>
                <i className="fas fa-spinner fa-spin"></i>
                Giriş Yapılıyor...
              </>
            ) : (
              <>
                <i className="fas fa-sign-in-alt"></i>
                Giriş Yap
              </>
            )}
          </button>
        </form>

        <div className="login-footer">
          <p>Varsayılan hesap bilgileri:</p>
          <p><strong>E-posta:</strong> admin@fikirprojebankasi.com</p>
          <p><strong>Şifre:</strong> admin123</p>
        </div>
      </div>
    </div>
  );
};

export default Login; 
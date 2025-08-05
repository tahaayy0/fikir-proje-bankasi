import React, { useState } from 'react';
import './App.css';

function App() {
  const [formData, setFormData] = useState({
    isim: '',
    soyisim: '',
    aciklama: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form verileri:', formData);
    // Burada API'ye gönderme işlemi yapılabilir
    alert('Form başarıyla gönderildi!');
  };

  return (
    <div className="container">
      <header className="header">
        <h1 className="title">Fikir Proje Bankası</h1>
        <p className="subtitle">Proje yönetim platformu</p>
      </header>
      
      <main className="main">
        <div className="card">
          <h2 className="card-title">Proje Formu</h2>
          <form onSubmit={handleSubmit} className="form">
            <div className="form-group">
              <label htmlFor="isim" className="form-label">İsim</label>
              <input
                type="text"
                id="isim"
                name="isim"
                value={formData.isim}
                onChange={handleInputChange}
                className="form-input"
                placeholder="İsminizi girin"
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="soyisim" className="form-label">Soyisim</label>
              <input
                type="text"
                id="soyisim"
                name="soyisim"
                value={formData.soyisim}
                onChange={handleInputChange}
                className="form-input"
                placeholder="Soyisminizi girin"
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="aciklama" className="form-label">Açıklama</label>
              <textarea
                id="aciklama"
                name="aciklama"
                value={formData.aciklama}
                onChange={handleInputChange}
                className="form-textarea"
                placeholder="Proje açıklamanızı girin"
                rows="4"
                required
              />
            </div>
            
            <button type="submit" className="form-button">
              Gönder
            </button>
          </form>
        </div>
        
        <div className="card">
          <h2 className="card-title">API Durumu</h2>
          <div className="status">
            <div className="status-dot"></div>
            <span className="status-text">Backend API Bağlantısı Hazır</span>
          </div>
          <p className="card-text">
            API URL: {process.env.REACT_APP_API_URL || 'http://localhost:5000'}
          </p>
        </div>
      </main>
      
      <footer className="footer">
        <p>&copy; 2024 Fikir Proje Bankası. Tüm hakları saklıdır.</p>
      </footer>
    </div>
  );
}

export default App;

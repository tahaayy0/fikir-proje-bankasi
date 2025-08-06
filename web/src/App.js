import React, { useState, useEffect } from 'react';
import { apiService } from './services/api';
import './App.css';

function App() {
  const [formData, setFormData] = useState({
    isim: '',
    soyisim: '',
    aciklama: ''
  });
  const [apiStatus, setApiStatus] = useState('loading');
  const [apiMessage, setApiMessage] = useState('');
  const [healthData, setHealthData] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  // API durumunu kontrol et
  useEffect(() => {
    const checkApiStatus = async () => {
      try {
        const response = await apiService.healthCheck();
        setApiStatus('success');
        setApiMessage('API bağlantısı başarılı!');
        setHealthData(response.data);
      } catch (error) {
        setApiStatus('error');
        setApiMessage(`API bağlantı hatası: ${error.message}`);
        console.error('API Error:', error);
      }
    };

    checkApiStatus();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Test için önce API'yi test edelim
      const testResponse = await apiService.test();
      console.log('API Test Response:', testResponse.data);
      
      // Form verilerini backend'in beklediği formata dönüştür
      const projeData = {
        baslik: `${formData.isim} ${formData.soyisim} Projesi`,
        aciklama: formData.aciklama,
        olusturanKisi: `${formData.isim} ${formData.soyisim}`,
        kategori: 'Diğer',
        durum: 'Taslak',
        oncelik: 'Orta'
      };
      
      // Form verilerini API'ye gönder
      const response = await apiService.createProje(projeData);
      console.log('Proje oluşturuldu:', response.data);
      alert('Proje başarıyla oluşturuldu!');
      
      // Formu temizle
      setFormData({
        isim: '',
        soyisim: '',
        aciklama: ''
      });
    } catch (error) {
      console.error('Form gönderme hatası:', error);
      if (error.response?.data?.errors) {
        const errorMessages = error.response.data.errors.map(err => err.msg).join('\n');
        alert(`Validasyon hataları:\n${errorMessages}`);
      } else {
        alert(`Hata: ${error.response?.data?.message || error.message}`);
      }
    }
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
            <div className={`status-dot ${apiStatus}`}></div>
            <span className="status-text">
              {apiStatus === 'loading' && 'Bağlantı kontrol ediliyor...'}
              {apiStatus === 'success' && 'Backend API Bağlantısı Başarılı'}
              {apiStatus === 'error' && 'Backend API Bağlantı Hatası'}
            </span>
          </div>
          <p className="card-text">
            API URL: {process.env.REACT_APP_API_URL || 'http://localhost:5001/api'}
          </p>
          {apiMessage && (
            <p className={`card-text ${apiStatus === 'error' ? 'error' : 'success'}`}>
              {apiMessage}
            </p>
          )}
          {healthData && (
            <div className="health-info">
              <p><strong>Database:</strong> {healthData.database?.status}</p>
              <p><strong>Timestamp:</strong> {new Date(healthData.timestamp).toLocaleString('tr-TR')}</p>
            </div>
          )}
        </div>
      </main>
      
      <footer className="footer">
        <p>&copy; 2024 Fikir Proje Bankası. Tüm hakları saklıdır.</p>
      </footer>
    </div>
  );
}

export default App;

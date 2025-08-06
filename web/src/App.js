import React, { useState, useEffect } from 'react';
import { apiService } from './services/api';
import './App.css';

function App() {
  const [formData, setFormData] = useState({
    adSoyad: '',
    email: '',
    fikirBaslik: '',
    aciklama: '',
    dosyaLink: ''
  });
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };



  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Form verilerini backend'in beklediği formata dönüştür
      const projeData = {
        baslik: formData.fikirBaslik,
        aciklama: formData.aciklama,
        olusturanKisi: formData.adSoyad,
        kategori: 'Diğer',
        durum: 'Taslak',
        oncelik: 'Orta'
      };
      
      // Form verilerini API'ye gönder
      await apiService.createProje(projeData);
      
      // Başarı mesajını göster
      setToastMessage('Başvurunuz başarıyla alındı!');
      setShowToast(true);
      
      // Formu temizle
      setFormData({
        adSoyad: '',
        email: '',
        fikirBaslik: '',
        aciklama: '',
        dosyaLink: ''
      });
      
      // 3 saniye sonra toast'ı gizle
      setTimeout(() => setShowToast(false), 3000);
      
    } catch (error) {
      console.error('Form gönderme hatası:', error);
      setToastMessage('Bir hata oluştu. Lütfen tekrar deneyin.');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }
  };

  const scrollToForm = () => {
    document.getElementById('basvuru-formu').scrollIntoView({ 
      behavior: 'smooth' 
    });
  };

  return (
    <div className="app">
      {/* Toast Mesajı */}
      {showToast && (
        <div className="toast">
          <i className="fas fa-check-circle"></i>
          {toastMessage}
        </div>
      )}

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-background"></div>
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">
              Fikrini Gerçeğe Dönüştür.
            </h1>
            <p className="hero-subtitle">
              Fikir Proje Bankası, hayal gücünü işe dönüştürenlerin buluşma noktası.
            </p>
            <button className="cta-button" onClick={scrollToForm}>
              <i className="fas fa-rocket"></i>
              Hemen Başvur
            </button>
          </div>
          <div className="hero-illustration">
            <div className="idea-bulb">
              <i className="fas fa-lightbulb"></i>
            </div>
            <div className="floating-elements">
              <div className="element element-1">💡</div>
              <div className="element element-2">🚀</div>
              <div className="element element-3">⚡</div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="about">
        <div className="container">
          <h2 className="section-title">Ne İş Yapıyoruz?</h2>
          <div className="services-grid">
            <div className="service-card">
              <div className="service-icon">
                <i className="fas fa-lightbulb"></i>
              </div>
              <h3>Fikir Topluyoruz</h3>
              <p>Yaratıcı fikirlerinizi dinliyor ve değerlendiriyoruz.</p>
            </div>
            <div className="service-card">
              <div className="service-icon">
                <i className="fas fa-cogs"></i>
              </div>
              <h3>Projeye Dönüştürüyoruz</h3>
              <p>Fikirlerinizi somut projelere dönüştürüyoruz.</p>
            </div>
            <div className="service-card">
              <div className="service-icon">
                <i className="fas fa-users"></i>
              </div>
              <h3>Kaynak ve Mentorluk Sağlıyoruz</h3>
              <p>Projelerinizi desteklemek için gerekli kaynakları sağlıyoruz.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Başvuru Formu */}
      <section id="basvuru-formu" className="application-form">
        <div className="container">
          <div className="form-card">
            <h2 className="form-title">Fikir Başvuru Formu</h2>
            <form onSubmit={handleSubmit} className="form">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="adSoyad">Ad Soyad</label>
                  <input
                    type="text"
                    id="adSoyad"
                    name="adSoyad"
                    value={formData.adSoyad}
                    onChange={handleInputChange}
                    placeholder="Adınız ve soyadınız"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="email">E-posta</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="ornek@email.com"
                    required
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="fikirBaslik">Fikir Başlığı</label>
                <input
                  type="text"
                  id="fikirBaslik"
                  name="fikirBaslik"
                  value={formData.fikirBaslik}
                  onChange={handleInputChange}
                  placeholder="Fikrinizin kısa başlığı"
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="aciklama">Kısa Açıklama</label>
                <textarea
                  id="aciklama"
                  name="aciklama"
                  value={formData.aciklama}
                  onChange={handleInputChange}
                  placeholder="Fikrinizi detaylı bir şekilde açıklayın..."
                  rows="4"
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="dosyaLink">Dosya veya Link (Opsiyonel)</label>
                <input
                  type="url"
                  id="dosyaLink"
                  name="dosyaLink"
                  value={formData.dosyaLink}
                  onChange={handleInputChange}
                  placeholder="https://..."
                />
              </div>
              
              <button type="submit" className="submit-button">
                <i className="fas fa-paper-plane"></i>
                Başvuruyu Gönder
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-info">
              <h3>Fikir Proje Bankası</h3>
              <p>Hayal gücünü işe dönüştürenlerin buluşma noktası</p>
            </div>
            <div className="social-links">
              <a href="#" className="social-link">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" className="social-link">
                <i className="fab fa-linkedin"></i>
              </a>
              <a href="#" className="social-link">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="#" className="social-link">
                <i className="fab fa-github"></i>
              </a>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2025 Fikir Proje Bankası. Tüm hakları saklıdır.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;

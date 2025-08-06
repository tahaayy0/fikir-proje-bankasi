import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../services/api';

const FikirEkle = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    baslik: '',
    problem: '',
    hedefKitle: '',
    olgunlukSeviyesi: 'fikir',
    kategori: 'Diğer',
    kaynaklar: '',
    kisaAciklama: '',
    dosyaLink: '',
    adSoyad: '',
    email: '',
    telefon: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const olgunlukSeviyeleri = [
    { value: 'fikir', label: 'Fikir Aşamasında' },
    { value: 'mvp', label: 'MVP (Minimum Viable Product)' },
    { value: 'yayinda', label: 'Yayında' }
  ];

  const kategoriler = [
    'Teknoloji', 'Sağlık', 'Eğitim', 'Çevre', 'Sosyal', 'Ekonomi', 'Kültür', 'Diğer'
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const fikirData = {
        ...formData,
        tur: 'fikir',
        durum: 'Beklemede',
        oncelik: 'Orta',
        olusturanKisi: formData.adSoyad,
        createdAt: new Date()
      };

      await apiService.createProje(fikirData);
      
      setMessage({ 
        type: 'success', 
        text: 'Fikriniz başarıyla gönderildi! Admin onayından sonra topluluk oylamasına açılacak.' 
      });
      
      // Formu temizle
      setFormData({
        baslik: '',
        problem: '',
        hedefKitle: '',
        olgunlukSeviyesi: 'fikir',
        kategori: 'Diğer',
        kaynaklar: '',
        kisaAciklama: '',
        dosyaLink: '',
        adSoyad: '',
        email: '',
        telefon: ''
      });

      // 3 saniye sonra ana sayfaya yönlendir
      setTimeout(() => {
        navigate('/');
      }, 3000);

    } catch (error) {
      console.error('Fikir gönderme hatası:', error);
      setMessage({ 
        type: 'error', 
        text: 'Bir hata oluştu. Lütfen tekrar deneyin.' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fikir-ekle-page">
      <div className="container">
        <div className="form-card">
          <div className="form-header">
            <h1><i className="fas fa-lightbulb"></i> Fikir Ekle</h1>
            <p>Fikrinizi paylaşın, topluluktan destek alın!</p>
          </div>

          {message.text && (
            <div className={`message ${message.type}`}>
              <i className={`fas fa-${message.type === 'success' ? 'check-circle' : 'exclamation-circle'}`}></i>
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className="fikir-form">
            {/* Kişisel Bilgiler */}
            <div className="form-section">
              <h3>Kişisel Bilgiler</h3>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="adSoyad">Ad Soyad *</label>
                  <input
                    type="text"
                    id="adSoyad"
                    name="adSoyad"
                    value={formData.adSoyad}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="email">E-posta *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="telefon">Telefon</label>
                <input
                  type="tel"
                  id="telefon"
                  name="telefon"
                  value={formData.telefon}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            {/* Fikir Bilgileri */}
            <div className="form-section">
              <h3>Fikir Bilgileri</h3>
              <div className="form-group">
                <label htmlFor="baslik">Fikrin Adı *</label>
                <input
                  type="text"
                  id="baslik"
                  name="baslik"
                  value={formData.baslik}
                  onChange={handleInputChange}
                  placeholder="Fikrinizin kısa ve net başlığı"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="problem">Çözmeyi Hedeflediğiniz Problem *</label>
                <textarea
                  id="problem"
                  name="problem"
                  value={formData.problem}
                  onChange={handleInputChange}
                  placeholder="Bu fikir hangi problemi çözmeyi hedefliyor?"
                  rows="3"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="hedefKitle">Hedef Kitle *</label>
                <textarea
                  id="hedefKitle"
                  name="hedefKitle"
                  value={formData.hedefKitle}
                  onChange={handleInputChange}
                  placeholder="Bu fikir kimlere yönelik?"
                  rows="2"
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="olgunlukSeviyesi">Fikrin Olgunluk Seviyesi *</label>
                  <select
                    id="olgunlukSeviyesi"
                    name="olgunlukSeviyesi"
                    value={formData.olgunlukSeviyesi}
                    onChange={handleInputChange}
                    required
                  >
                    {olgunlukSeviyeleri.map(seviye => (
                      <option key={seviye.value} value={seviye.value}>
                        {seviye.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="kategori">Kategori *</label>
                  <select
                    id="kategori"
                    name="kategori"
                    value={formData.kategori}
                    onChange={handleInputChange}
                    required
                  >
                    {kategoriler.map(kategori => (
                      <option key={kategori} value={kategori}>
                        {kategori}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="kisaAciklama">Kısa Açıklama * (Max 280 karakter)</label>
                <textarea
                  id="kisaAciklama"
                  name="kisaAciklama"
                  value={formData.kisaAciklama}
                  onChange={handleInputChange}
                  placeholder="Fikrinizi kısa bir tweet gibi açıklayın..."
                  rows="3"
                  maxLength="280"
                  required
                />
                <small>{formData.kisaAciklama.length}/280 karakter</small>
              </div>

              <div className="form-group">
                <label htmlFor="kaynaklar">Tahmini İhtiyaç Duyulan Kaynaklar</label>
                <textarea
                  id="kaynaklar"
                  name="kaynaklar"
                  value={formData.kaynaklar}
                  onChange={handleInputChange}
                  placeholder="Bu fikri gerçeğe dönüştürmek için hangi kaynaklara ihtiyaç var?"
                  rows="3"
                />
              </div>

              <div className="form-group">
                <label htmlFor="dosyaLink">Destekleyici Dosya/Link</label>
                <input
                  type="url"
                  id="dosyaLink"
                  name="dosyaLink"
                  value={formData.dosyaLink}
                  onChange={handleInputChange}
                  placeholder="YouTube linki, doküman, görsel vb."
                />
              </div>
            </div>

            <button 
              type="submit" 
              className="submit-button" 
              disabled={loading}
            >
              {loading ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i>
                  Gönderiliyor...
                </>
              ) : (
                <>
                  <i className="fas fa-paper-plane"></i>
                  Fikrimi Gönder
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default FikirEkle; 
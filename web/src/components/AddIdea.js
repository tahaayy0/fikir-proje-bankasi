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

  // Türkçe karakterleri temizleyen fonksiyon
  const turkceKarakterTemizle = (text) => {
    return text
      .replace(/ğ/g, 'g')
      .replace(/Ğ/g, 'G')
      .replace(/ü/g, 'u')
      .replace(/Ü/g, 'U')
      .replace(/ş/g, 's')
      .replace(/Ş/g, 'S')
      .replace(/ı/g, 'i')
      .replace(/İ/g, 'I')
      .replace(/ö/g, 'o')
      .replace(/Ö/g, 'O')
      .replace(/ç/g, 'c')
      .replace(/Ç/g, 'C')
      .replace(/[^a-zA-Z0-9@._-]/g, ''); // Sadece alfanumerik ve email karakterleri
  };

  // Otomatik doldurma fonksiyonu
  const otomatikDoldur = () => {
    const ornekVeriler = {
      baslik: 'Akıllı Şehir Trafik Yönetim Sistemi',
      problem: 'Büyük şehirlerde trafik sıkışıklığı ve zaman kaybı yaşanıyor. Mevcut trafik sistemleri yeterince akıllı değil ve gerçek zamanlı optimizasyon yapamıyor.',
      hedefKitle: 'Büyük şehirlerde yaşayan sürücüler, toplu taşıma kullanıcıları, şehir yönetimleri ve trafik polisleri',
      olgunlukSeviyesi: 'fikir',
      kategori: 'Teknoloji',
      kaynaklar: 'IoT sensörleri, yapay zeka algoritmaları, mobil uygulama geliştirme, şehir altyapısı entegrasyonu',
      kisaAciklama: 'Yapay zeka destekli trafik sensörleri ile gerçek zamanlı trafik optimizasyonu sağlayan akıllı şehir sistemi',
      dosyaLink: 'https://example.com/traffic-system-demo',
      adSoyad: 'Ahmet Yilmaz',
      email: 'ahmet.yilmaz@example.com',
      telefon: '0555 123 45 67'
    };

    // Email'i Türkçe karakter içermeyecek şekilde temizle
    ornekVeriler.email = turkceKarakterTemizle(ornekVeriler.email);
    
    setFormData(ornekVeriler);
    setMessage({ 
      type: 'success', 
      text: 'Form otomatik olarak dolduruldu! Gerekirse verileri düzenleyebilirsiniz.' 
    });
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

      await apiService.createFikir(fikirData);
      
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
            <button 
              type="button" 
              onClick={otomatikDoldur}
              className="auto-fill-button"
              style={{
                background: '#667eea',
                color: 'white',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px',
                marginTop: '10px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <i className="fas fa-magic"></i>
              Otomatik Doldur
            </button>
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
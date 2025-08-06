import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../services/api';

const ProjeEkle = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    baslik: '',
    aciklama: '',
    problem: '',
    hedefKitle: '',
    olgunlukSeviyesi: 'mvp',
    kategori: 'Teknoloji',
    kaynaklar: '',
    butce: '',
    baslangicTarihi: '',
    bitisTarihi: '',
    dosyaLink: '',
    adSoyad: '',
    email: '',
    telefon: '',
    takimUyeleri: '',
    teknolojiler: '',
    hedefler: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const olgunlukSeviyeleri = [
    { value: 'fikir', label: 'Fikir Aşamasında' },
    { value: 'mvp', label: 'MVP (Minimum Viable Product)' },
    { value: 'prototip', label: 'Prototip' },
    { value: 'yayinda', label: 'Yayında' },
    { value: 'gelistirme', label: 'Geliştirme Aşamasında' }
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
      const projeData = {
        ...formData,
        tur: 'proje',
        durum: 'Beklemede',
        oncelik: 'Orta',
        olusturanKisi: formData.adSoyad,
        createdAt: new Date(),
        butce: formData.butce ? parseFloat(formData.butce) : 0
      };

      await apiService.createProje(projeData);
      
      setMessage({ 
        type: 'success', 
        text: 'Projeniz başarıyla gönderildi! Admin onayından sonra topluluk oylamasına açılacak.' 
      });
      
      // Formu temizle
      setFormData({
        baslik: '',
        aciklama: '',
        problem: '',
        hedefKitle: '',
        olgunlukSeviyesi: 'mvp',
        kategori: 'Teknoloji',
        kaynaklar: '',
        butce: '',
        baslangicTarihi: '',
        bitisTarihi: '',
        dosyaLink: '',
        adSoyad: '',
        email: '',
        telefon: '',
        takimUyeleri: '',
        teknolojiler: '',
        hedefler: ''
      });

      // 3 saniye sonra ana sayfaya yönlendir
      setTimeout(() => {
        navigate('/');
      }, 3000);

    } catch (error) {
      console.error('Proje gönderme hatası:', error);
      setMessage({ 
        type: 'error', 
        text: 'Bir hata oluştu. Lütfen tekrar deneyin.' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="proje-ekle-page">
      <div className="container">
        <div className="form-card">
          <div className="form-header">
            <h1><i className="fas fa-rocket"></i> Proje Ekle</h1>
            <p>Projenizi paylaşın, topluluktan destek alın!</p>
          </div>

          {message.text && (
            <div className={`message ${message.type}`}>
              <i className={`fas fa-${message.type === 'success' ? 'check-circle' : 'exclamation-circle'}`}></i>
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className="proje-form">
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

            {/* Proje Bilgileri */}
            <div className="form-section">
              <h3>Proje Bilgileri</h3>
              <div className="form-group">
                <label htmlFor="baslik">Proje Adı *</label>
                <input
                  type="text"
                  id="baslik"
                  name="baslik"
                  value={formData.baslik}
                  onChange={handleInputChange}
                  placeholder="Projenizin kısa ve net başlığı"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="aciklama">Proje Açıklaması *</label>
                <textarea
                  id="aciklama"
                  name="aciklama"
                  value={formData.aciklama}
                  onChange={handleInputChange}
                  placeholder="Projenizi detaylı bir şekilde açıklayın..."
                  rows="4"
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
                  placeholder="Bu proje hangi problemi çözmeyi hedefliyor?"
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
                  placeholder="Bu proje kimlere yönelik?"
                  rows="2"
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="olgunlukSeviyesi">Proje Olgunluk Seviyesi *</label>
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
            </div>

            {/* Teknik Detaylar */}
            <div className="form-section">
              <h3>Teknik Detaylar</h3>
              <div className="form-group">
                <label htmlFor="teknolojiler">Kullanılan Teknolojiler</label>
                <textarea
                  id="teknolojiler"
                  name="teknolojiler"
                  value={formData.teknolojiler}
                  onChange={handleInputChange}
                  placeholder="JavaScript, React, Node.js, MongoDB vb."
                  rows="2"
                />
              </div>

              <div className="form-group">
                <label htmlFor="takimUyeleri">Takım Üyeleri</label>
                <textarea
                  id="takimUyeleri"
                  name="takimUyeleri"
                  value={formData.takimUyeleri}
                  onChange={handleInputChange}
                  placeholder="Takım üyelerinin adları ve rolleri"
                  rows="2"
                />
              </div>

              <div className="form-group">
                <label htmlFor="hedefler">Proje Hedefleri</label>
                <textarea
                  id="hedefler"
                  name="hedefler"
                  value={formData.hedefler}
                  onChange={handleInputChange}
                  placeholder="Projenin kısa ve uzun vadeli hedefleri"
                  rows="3"
                />
              </div>
            </div>

            {/* Kaynaklar ve Zaman */}
            <div className="form-section">
              <h3>Kaynaklar ve Zaman</h3>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="butce">Tahmini Bütçe (TL)</label>
                  <input
                    type="number"
                    id="butce"
                    name="butce"
                    value={formData.butce}
                    onChange={handleInputChange}
                    placeholder="0"
                    min="0"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="kaynaklar">İhtiyaç Duyulan Kaynaklar</label>
                  <input
                    type="text"
                    id="kaynaklar"
                    name="kaynaklar"
                    value={formData.kaynaklar}
                    onChange={handleInputChange}
                    placeholder="İnsan kaynağı, ekipman, finans vb."
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="baslangicTarihi">Başlangıç Tarihi</label>
                  <input
                    type="date"
                    id="baslangicTarihi"
                    name="baslangicTarihi"
                    value={formData.baslangicTarihi}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="bitisTarihi">Bitiş Tarihi</label>
                  <input
                    type="date"
                    id="bitisTarihi"
                    name="bitisTarihi"
                    value={formData.bitisTarihi}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="dosyaLink">Destekleyici Dosya/Link</label>
                <input
                  type="url"
                  id="dosyaLink"
                  name="dosyaLink"
                  value={formData.dosyaLink}
                  onChange={handleInputChange}
                  placeholder="GitHub, demo linki, doküman vb."
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
                  Projemi Gönder
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProjeEkle; 
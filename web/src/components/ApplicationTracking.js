import React, { useState, useEffect } from 'react';
import { apiService } from '../services/api';

const BasvuruTakip = () => {
  const [basvurular, setBasvurular] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchEmail, setSearchEmail] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    // Sayfa yüklendiğinde boş liste göster
    setLoading(false);
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchEmail.trim()) {
      setMessage({ type: 'error', text: 'Lütfen e-posta adresinizi girin.' });
      return;
    }

    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      // Burada gerçek API çağrısı yapılacak
      // Şimdilik mock data kullanıyoruz
      const mockResults = [
        {
          _id: '1',
          baslik: 'Akıllı Şehir Uygulaması',
          tur: 'fikir',
          durum: 'Beklemede',
          kategori: 'Teknoloji',
          createdAt: '2024-01-15T10:30:00Z',
          email: searchEmail,
          olusturanKisi: 'Ahmet Yılmaz'
        },
        {
          _id: '2',
          baslik: 'Sürdürülebilir Enerji Projesi',
          tur: 'proje',
          durum: 'Onaylandı',
          kategori: 'Çevre',
          createdAt: '2024-01-10T14:20:00Z',
          email: searchEmail,
          olusturanKisi: 'Fatma Demir'
        }
      ];

      setSearchResults(mockResults);
      
      if (mockResults.length === 0) {
        setMessage({ type: 'info', text: 'Bu e-posta adresi ile başvuru bulunamadı.' });
      } else {
        setMessage({ type: 'success', text: `${mockResults.length} başvuru bulundu.` });
      }

    } catch (error) {
      console.error('Başvuru arama hatası:', error);
      setMessage({ type: 'error', text: 'Başvuru aranırken bir hata oluştu.' });
    } finally {
      setLoading(false);
    }
  };

  const getDurumBadge = (durum) => {
    const durumStyles = {
      'Beklemede': 'beklemede',
      'Onaylandı': 'onaylandı',
      'Reddedildi': 'reddedildi',
      'Düzeltme Talebi': 'duzeltme',
      'Aktif': 'aktif',
      'Tamamlandı': 'tamamlandı'
    };

    return (
      <span className={`durum-badge ${durumStyles[durum] || 'beklemede'}`}>
        {durum}
      </span>
    );
  };

  const getTurIcon = (tur) => {
    return tur === 'fikir' ? 'fas fa-lightbulb' : 'fas fa-rocket';
  };

  const getTurLabel = (tur) => {
    return tur === 'fikir' ? 'Fikir' : 'Proje';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="basvuru-takip-page">
      <div className="container">
        <div className="page-header">
          <h1><i className="fas fa-tasks"></i> Başvuru Takip</h1>
          <p>Başvurularınızın durumunu takip edin</p>
        </div>

        {/* Arama Formu */}
        <div className="search-section">
          <div className="search-card">
            <h3>Başvuru Ara</h3>
            <p>E-posta adresinizi girerek başvurularınızı görüntüleyin</p>
            
            <form onSubmit={handleSearch} className="search-form">
              <div className="form-group">
                <label htmlFor="searchEmail">E-posta Adresiniz *</label>
                <input
                  type="email"
                  id="searchEmail"
                  value={searchEmail}
                  onChange={(e) => setSearchEmail(e.target.value)}
                  placeholder="ornek@email.com"
                  required
                />
              </div>
              <button type="submit" className="search-button" disabled={loading}>
                {loading ? (
                  <>
                    <i className="fas fa-spinner fa-spin"></i>
                    Aranıyor...
                  </>
                ) : (
                  <>
                    <i className="fas fa-search"></i>
                    Başvurularımı Ara
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Mesaj */}
        {message.text && (
          <div className={`message ${message.type}`}>
            <i className={`fas fa-${message.type === 'success' ? 'check-circle' : message.type === 'error' ? 'exclamation-circle' : 'info-circle'}`}></i>
            {message.text}
          </div>
        )}

        {/* Sonuçlar */}
        {searchResults.length > 0 && (
          <div className="results-section">
            <h3>Başvurularınız</h3>
            <div className="basvuru-list">
              {searchResults.map((basvuru) => (
                <div key={basvuru._id} className="basvuru-card">
                  <div className="basvuru-header">
                    <div className="basvuru-baslik">
                      <i className={getTurIcon(basvuru.tur)}></i>
                      <h4>{basvuru.baslik}</h4>
                      <span className="tur-label">{getTurLabel(basvuru.tur)}</span>
                    </div>
                    {getDurumBadge(basvuru.durum)}
                  </div>

                  <div className="basvuru-detaylar">
                    <div className="detay-grup">
                      <span className="detay-label">Kategori:</span>
                      <span className="detay-value">{basvuru.kategori}</span>
                    </div>
                    <div className="detay-grup">
                      <span className="detay-label">Başvuru Tarihi:</span>
                      <span className="detay-value">{formatDate(basvuru.createdAt)}</span>
                    </div>
                    <div className="detay-grup">
                      <span className="detay-label">Başvuran:</span>
                      <span className="detay-value">{basvuru.olusturanKisi}</span>
                    </div>
                  </div>

                  <div className="basvuru-footer">
                    <div className="durum-aciklama">
                      {basvuru.durum === 'Beklemede' && (
                        <p><i className="fas fa-clock"></i> Başvurunuz admin onayı bekliyor.</p>
                      )}
                      {basvuru.durum === 'Onaylandı' && (
                        <p><i className="fas fa-check-circle"></i> Başvurunuz onaylandı ve oylamaya açıldı.</p>
                      )}
                      {basvuru.durum === 'Reddedildi' && (
                        <p><i className="fas fa-times-circle"></i> Başvurunuz reddedildi.</p>
                      )}
                      {basvuru.durum === 'Düzeltme Talebi' && (
                        <p><i className="fas fa-edit"></i> Başvurunuzda düzeltme talep edildi.</p>
                      )}
                      {basvuru.durum === 'Aktif' && (
                        <p><i className="fas fa-play-circle"></i> Projeniz aktif durumda.</p>
                      )}
                      {basvuru.durum === 'Tamamlandı' && (
                        <p><i className="fas fa-flag-checkered"></i> Projeniz tamamlandı.</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Boş Durum */}
        {!loading && searchResults.length === 0 && searchEmail && !message.text && (
          <div className="bos-durum">
            <i className="fas fa-inbox"></i>
            <p>Bu e-posta adresi ile başvuru bulunamadı.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BasvuruTakip; 
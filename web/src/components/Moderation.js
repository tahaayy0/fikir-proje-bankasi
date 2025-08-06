import React, { useState, useEffect } from 'react';
import { apiService } from '../services/api';

const Moderation = () => {
  const [basvurular, setBasvurular] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    durum: 'Beklemede',
    tur: 'Tümü',
    kategori: 'Tümü'
  });
  const [selectedBasvuru, setSelectedBasvuru] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const kategoriler = [
    'Tümü', 'Teknoloji', 'Sağlık', 'Eğitim', 'Çevre', 'Sosyal', 'Ekonomi', 'Kültür', 'Diğer'
  ];

  const durumlar = [
    'Beklemede', 'Onaylandı', 'Reddedildi', 'Düzeltme Talebi', 'Aktif', 'Tamamlandı'
  ];

  useEffect(() => {
    fetchBasvurular();
  }, [filters]);

  const fetchBasvurular = async () => {
    try {
      setLoading(true);
      // Mock data - gerçek API'de bu kısım değişecek
      const mockData = [
        {
          _id: '1',
          baslik: 'Akıllı Şehir Uygulaması',
          tur: 'fikir',
          durum: 'Beklemede',
          kategori: 'Teknoloji',
          createdAt: '2024-01-15T10:30:00Z',
          email: 'ahmet@example.com',
          olusturanKisi: 'Ahmet Yılmaz',
          aciklama: 'Trafik yoğunluğunu azaltmak için IoT tabanlı çözüm.',
          problem: 'Şehirlerde trafik sıkışıklığı',
          hedefKitle: 'Şehir sakinleri ve belediyeler'
        },
        {
          _id: '2',
          baslik: 'Sürdürülebilir Enerji Projesi',
          tur: 'proje',
          durum: 'Beklemede',
          kategori: 'Çevre',
          createdAt: '2024-01-14T14:20:00Z',
          email: 'fatma@example.com',
          olusturanKisi: 'Fatma Demir',
          aciklama: 'Güneş ve rüzgar enerjisi kullanarak yenilenebilir enerji üretimi.',
          problem: 'Fosil yakıt bağımlılığı',
          hedefKitle: 'Enerji şirketleri ve ev sahipleri'
        },
        {
          _id: '3',
          baslik: 'Uzaktan Eğitim Platformu',
          tur: 'proje',
          durum: 'Onaylandı',
          kategori: 'Eğitim',
          createdAt: '2024-01-13T09:15:00Z',
          email: 'mehmet@example.com',
          olusturanKisi: 'Mehmet Kaya',
          aciklama: 'Gelişmiş uzaktan eğitim platformu.',
          problem: 'Eğitim sürekliliği',
          hedefler: 'Öğrenciler ve eğitmenler'
        }
      ];

      let filteredData = mockData;

      // Filtreleme
      if (filters.durum !== 'Tümü') {
        filteredData = filteredData.filter(b => b.durum === filters.durum);
      }

      if (filters.tur !== 'Tümü') {
        filteredData = filteredData.filter(b => b.tur === filters.tur);
      }

      if (filters.kategori !== 'Tümü') {
        filteredData = filteredData.filter(b => b.kategori === filters.kategori);
      }

      setBasvurular(filteredData);
    } catch (error) {
      console.error('Başvurular getirilirken hata:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (basvuruId, action, not = '') => {
    try {
      setActionLoading(true);
      
      // Burada gerçek API çağrısı yapılacak
      console.log(`Başvuru ${basvuruId} için ${action} eylemi gerçekleştirildi`, not);
      
      // Mock güncelleme
      setBasvurular(prev => prev.map(b => {
        if (b._id === basvuruId) {
          return { ...b, durum: action };
        }
        return b;
      }));

      setShowModal(false);
      setSelectedBasvuru(null);
      
    } catch (error) {
      console.error('Eylem gerçekleştirilirken hata:', error);
    } finally {
      setActionLoading(false);
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
    <div className="moderation-page">
      <div className="container">
        <div className="page-header">
          <h1><i className="fas fa-shield-alt"></i> Moderasyon Paneli</h1>
          <p>Başvuruları inceleyin ve yönetin</p>
        </div>

        {/* Filtreler */}
        <div className="moderation-filters">
          <div className="filter-group">
            <label>Durum:</label>
            <select
              value={filters.durum}
              onChange={(e) => setFilters(prev => ({ ...prev, durum: e.target.value }))}
            >
              <option value="Tümü">Tümü</option>
              {durumlar.map(durum => (
                <option key={durum} value={durum}>{durum}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>Tür:</label>
            <select
              value={filters.tur}
              onChange={(e) => setFilters(prev => ({ ...prev, tur: e.target.value }))}
            >
              <option value="Tümü">Tümü</option>
              <option value="fikir">Fikir</option>
              <option value="proje">Proje</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Kategori:</label>
            <select
              value={filters.kategori}
              onChange={(e) => setFilters(prev => ({ ...prev, kategori: e.target.value }))}
            >
              {kategoriler.map(kategori => (
                <option key={kategori} value={kategori}>{kategori}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Başvuru Listesi */}
        <div className="moderation-list">
          {loading ? (
            <div className="loading">
              <i className="fas fa-spinner fa-spin"></i>
              Başvurular yükleniyor...
            </div>
          ) : basvurular.length === 0 ? (
            <div className="bos-durum">
              <i className="fas fa-inbox"></i>
              <p>Filtrelere uygun başvuru bulunamadı.</p>
            </div>
          ) : (
            <div className="basvuru-grid">
              {basvurular.map((basvuru) => (
                <div key={basvuru._id} className="moderation-card">
                  <div className="card-header">
                    <div className="baslik-bilgi">
                      <i className={getTurIcon(basvuru.tur)}></i>
                      <h3>{basvuru.baslik}</h3>
                      <span className="tur-label">{getTurLabel(basvuru.tur)}</span>
                    </div>
                    {getDurumBadge(basvuru.durum)}
                  </div>

                  <div className="card-content">
                    <div className="basvuru-detay">
                      <p><strong>Açıklama:</strong> {basvuru.aciklama}</p>
                      {basvuru.problem && (
                        <p><strong>Problem:</strong> {basvuru.problem}</p>
                      )}
                      {basvuru.hedefKitle && (
                        <p><strong>Hedef Kitle:</strong> {basvuru.hedefKitle}</p>
                      )}
                    </div>

                    <div className="basvuru-meta">
                      <div className="meta-item">
                        <i className="fas fa-user"></i>
                        <span>{basvuru.olusturanKisi}</span>
                      </div>
                      <div className="meta-item">
                        <i className="fas fa-envelope"></i>
                        <span>{basvuru.email}</span>
                      </div>
                      <div className="meta-item">
                        <i className="fas fa-calendar"></i>
                        <span>{formatDate(basvuru.createdAt)}</span>
                      </div>
                      <div className="meta-item">
                        <i className="fas fa-tag"></i>
                        <span>{basvuru.kategori}</span>
                      </div>
                    </div>
                  </div>

                  <div className="card-actions">
                    {basvuru.durum === 'Beklemede' && (
                      <>
                        <button 
                          className="action-btn approve"
                          onClick={() => {
                            setSelectedBasvuru(basvuru);
                            setShowModal(true);
                          }}
                        >
                          <i className="fas fa-check"></i>
                          Onayla
                        </button>
                        <button 
                          className="action-btn reject"
                          onClick={() => {
                            setSelectedBasvuru(basvuru);
                            setShowModal(true);
                          }}
                        >
                          <i className="fas fa-times"></i>
                          Reddet
                        </button>
                        <button 
                          className="action-btn request"
                          onClick={() => {
                            setSelectedBasvuru(basvuru);
                            setShowModal(true);
                          }}
                        >
                          <i className="fas fa-edit"></i>
                          Düzeltme Talebi
                        </button>
                      </>
                    )}
                    <button 
                      className="action-btn view"
                      onClick={() => {
                        setSelectedBasvuru(basvuru);
                        setShowModal(true);
                      }}
                    >
                      <i className="fas fa-eye"></i>
                      Detay
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal */}
        {showModal && selectedBasvuru && (
          <div className="modal-overlay" onClick={() => setShowModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>{selectedBasvuru.baslik}</h2>
                <button 
                  className="modal-close"
                  onClick={() => setShowModal(false)}
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>

              <div className="modal-body">
                <div className="modal-section">
                  <h3>Başvuru Detayları</h3>
                  <p><strong>Açıklama:</strong> {selectedBasvuru.aciklama}</p>
                  {selectedBasvuru.problem && (
                    <p><strong>Problem:</strong> {selectedBasvuru.problem}</p>
                  )}
                  {selectedBasvuru.hedefKitle && (
                    <p><strong>Hedef Kitle:</strong> {selectedBasvuru.hedefKitle}</p>
                  )}
                </div>

                <div className="modal-section">
                  <h3>Başvuran Bilgileri</h3>
                  <p><strong>Ad Soyad:</strong> {selectedBasvuru.olusturanKisi}</p>
                  <p><strong>E-posta:</strong> {selectedBasvuru.email}</p>
                  <p><strong>Başvuru Tarihi:</strong> {formatDate(selectedBasvuru.createdAt)}</p>
                </div>

                {selectedBasvuru.durum === 'Beklemede' && (
                  <div className="modal-section">
                    <h3>Eylem</h3>
                    <div className="action-buttons">
                      <button 
                        className="action-btn approve"
                        onClick={() => handleAction(selectedBasvuru._id, 'Onaylandı')}
                        disabled={actionLoading}
                      >
                        <i className="fas fa-check"></i>
                        Onayla
                      </button>
                      <button 
                        className="action-btn reject"
                        onClick={() => handleAction(selectedBasvuru._id, 'Reddedildi')}
                        disabled={actionLoading}
                      >
                        <i className="fas fa-times"></i>
                        Reddet
                      </button>
                      <button 
                        className="action-btn request"
                        onClick={() => handleAction(selectedBasvuru._id, 'Düzeltme Talebi')}
                        disabled={actionLoading}
                      >
                        <i className="fas fa-edit"></i>
                        Düzeltme Talebi
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Moderation; 
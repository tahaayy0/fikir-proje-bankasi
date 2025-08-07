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
      
      // API parametrelerini hazırla
      const params = new URLSearchParams();
      if (filters.durum !== 'Tümü') params.append('durum', filters.durum);
      if (filters.tur !== 'Tümü') params.append('tur', filters.tur);
      if (filters.kategori !== 'Tümü') params.append('kategori', filters.kategori);
      
      // Gerçek API çağrısı
      const response = await apiService.getModerationBasvurular(params.toString());
      
      if (response.data && response.data.success) {
        setBasvurular(response.data.data.projeler || []);
      } else {
        console.error('API yanıtı başarısız:', response.data);
        setBasvurular([]);
      }
    } catch (error) {
      console.error('Başvurular getirilirken hata:', error);
      setBasvurular([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (basvuruId, action, not = '') => {
    try {
      setActionLoading(true);
      
      // Gerçek API çağrısı
      const response = await apiService.updateBasvuruDurum(basvuruId, {
        durum: action,
        adminNotu: not
      });
      
      if (response.data && response.data.success) {
        // Başarılı güncelleme - listeyi yenile
        await fetchBasvurular();
        
        setShowModal(false);
        setSelectedBasvuru(null);
        
        // Başarı mesajı göster
        alert(`Başvuru durumu başarıyla ${action} olarak güncellendi.`);
      } else {
        console.error('API yanıtı başarısız:', response.data);
        alert('Başvuru durumu güncellenirken bir hata oluştu.');
      }
      
    } catch (error) {
      console.error('Eylem gerçekleştirilirken hata:', error);
      alert('Başvuru durumu güncellenirken bir hata oluştu.');
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
                  <p><strong>Başlık:</strong> {selectedBasvuru.baslik}</p>
                  <p><strong>Tür:</strong> {getTurLabel(selectedBasvuru.tur)}</p>
                  <p><strong>Kategori:</strong> {selectedBasvuru.kategori}</p>
                  <p><strong>Durum:</strong> {getDurumBadge(selectedBasvuru.durum)}</p>
                  
                  {/* Fikir için kısa açıklama, proje için açıklama */}
                  {selectedBasvuru.tur === 'fikir' && selectedBasvuru.kisaAciklama && (
                    <p><strong>Kısa Açıklama:</strong> {selectedBasvuru.kisaAciklama}</p>
                  )}
                  {selectedBasvuru.aciklama && (
                    <p><strong>Açıklama:</strong> {selectedBasvuru.aciklama}</p>
                  )}
                  
                  {selectedBasvuru.problem && (
                    <p><strong>Problem:</strong> {selectedBasvuru.problem}</p>
                  )}
                  {selectedBasvuru.hedefKitle && (
                    <p><strong>Hedef Kitle:</strong> {selectedBasvuru.hedefKitle}</p>
                  )}
                  {selectedBasvuru.olgunlukSeviyesi && (
                    <p><strong>Olgunluk Seviyesi:</strong> {selectedBasvuru.olgunlukSeviyesi}</p>
                  )}
                  {selectedBasvuru.kaynaklar && (
                    <p><strong>Kaynaklar:</strong> {selectedBasvuru.kaynaklar}</p>
                  )}
                  {selectedBasvuru.dosyaLink && (
                    <p><strong>Dosya/Link:</strong> <a href={selectedBasvuru.dosyaLink} target="_blank" rel="noopener noreferrer">{selectedBasvuru.dosyaLink}</a></p>
                  )}
                </div>

                {/* Proje türü için ek alanlar */}
                {selectedBasvuru.tur === 'proje' && (
                  <div className="modal-section">
                    <h3>Proje Detayları</h3>
                    {selectedBasvuru.teknolojiler && (
                      <p><strong>Teknolojiler:</strong> {selectedBasvuru.teknolojiler}</p>
                    )}
                    {selectedBasvuru.takimUyeleri && (
                      <p><strong>Takım Üyeleri:</strong> {selectedBasvuru.takimUyeleri}</p>
                    )}
                    {selectedBasvuru.hedefler && (
                      <p><strong>Hedefler:</strong> {selectedBasvuru.hedefler}</p>
                    )}
                    {selectedBasvuru.butce && (
                      <p><strong>Bütçe:</strong> {selectedBasvuru.butce} TL</p>
                    )}
                    {selectedBasvuru.baslangicTarihi && (
                      <p><strong>Başlangıç Tarihi:</strong> {formatDate(selectedBasvuru.baslangicTarihi)}</p>
                    )}
                    {selectedBasvuru.bitisTarihi && (
                      <p><strong>Bitiş Tarihi:</strong> {formatDate(selectedBasvuru.bitisTarihi)}</p>
                    )}
                  </div>
                )}

                <div className="modal-section">
                  <h3>Başvuran Bilgileri</h3>
                  <p><strong>Ad Soyad:</strong> {selectedBasvuru.olusturanKisi || selectedBasvuru.adSoyad}</p>
                  <p><strong>E-posta:</strong> {selectedBasvuru.email}</p>
                  {selectedBasvuru.telefon && (
                    <p><strong>Telefon:</strong> {selectedBasvuru.telefon}</p>
                  )}
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

// CSS stilleri
const styles = `
  .moderation-page {
    min-height: 100vh;
    background: #f8fafc;
    padding: 20px 0;
  }

  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
  }

  .page-header {
    text-align: center;
    margin-bottom: 30px;
  }

  .page-header h1 {
    color: #333;
    font-size: 32px;
    font-weight: 700;
    margin-bottom: 8px;
  }

  .page-header p {
    color: #666;
    font-size: 16px;
  }

  .moderation-filters {
    background: white;
    border-radius: 12px;
    padding: 20px;
    margin-bottom: 20px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    display: flex;
    gap: 20px;
    flex-wrap: wrap;
  }

  .filter-group {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .filter-group label {
    font-weight: 600;
    color: #333;
    font-size: 14px;
  }

  .filter-group select {
    padding: 8px 12px;
    border: 2px solid #e2e8f0;
    border-radius: 6px;
    font-size: 14px;
    min-width: 150px;
  }

  .basvurular-list {
    background: white;
    border-radius: 12px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    overflow: hidden;
  }

  .basvuru-item {
    padding: 20px;
    border-bottom: 1px solid #e2e8f0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 20px;
  }

  .basvuru-item:last-child {
    border-bottom: none;
  }

  .basvuru-info {
    flex: 1;
  }

  .basvuru-header {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 8px;
  }

  .basvuru-title {
    font-size: 18px;
    font-weight: 600;
    color: #333;
  }

  .durum-badge {
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 600;
    text-transform: uppercase;
  }

  .durum-badge.beklemede {
    background: #fef3c7;
    color: #92400e;
  }

  .durum-badge.onaylandı {
    background: #d1fae5;
    color: #065f46;
  }

  .durum-badge.reddedildi {
    background: #fee2e2;
    color: #991b1b;
  }

  .durum-badge.duzeltme {
    background: #dbeafe;
    color: #1e40af;
  }

  .durum-badge.aktif {
    background: #dcfce7;
    color: #166534;
  }

  .durum-badge.tamamlandı {
    background: #f3e8ff;
    color: #7c3aed;
  }

  .basvuru-meta {
    display: flex;
    gap: 16px;
    font-size: 14px;
    color: #666;
  }

  .action-buttons {
    display: flex;
    gap: 8px;
  }

  .action-btn {
    padding: 6px 12px;
    border: none;
    border-radius: 4px;
    font-size: 12px;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 4px;
    transition: all 0.3s ease;
  }

  .action-btn.approve {
    background: #10b981;
    color: white;
  }

  .action-btn.reject {
    background: #ef4444;
    color: white;
  }

  .action-btn.request {
    background: #3b82f6;
    color: white;
  }

  .action-btn.view {
    background: #6b7280;
    color: white;
  }

  .action-btn:hover {
    transform: translateY(-1px);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  }

  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
  }

  .modal-content {
    background: white;
    border-radius: 12px;
    max-width: 600px;
    width: 90%;
    max-height: 80vh;
    overflow-y: auto;
  }

  .modal-header {
    padding: 20px;
    border-bottom: 1px solid #e2e8f0;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .modal-header h2 {
    margin: 0;
    color: #333;
    font-size: 20px;
  }

  .modal-close {
    background: none;
    border: none;
    font-size: 20px;
    cursor: pointer;
    color: #666;
  }

  .modal-body {
    padding: 20px;
  }

  .modal-section {
    margin-bottom: 20px;
  }

  .modal-section h3 {
    color: #333;
    font-size: 16px;
    margin-bottom: 12px;
    border-bottom: 2px solid #e2e8f0;
    padding-bottom: 4px;
  }

  .modal-section p {
    margin: 8px 0;
    line-height: 1.5;
  }

  .modal-section strong {
    color: #333;
  }

  .loading {
    text-align: center;
    padding: 40px;
    color: #666;
  }

  .no-data {
    text-align: center;
    padding: 40px;
    color: #666;
  }

  @media (max-width: 768px) {
    .moderation-filters {
      flex-direction: column;
    }
    
    .basvuru-item {
      flex-direction: column;
      align-items: flex-start;
    }
    
    .action-buttons {
      width: 100%;
      justify-content: flex-end;
    }
  }
`;

// CSS'i sayfaya ekle
if (!document.getElementById('moderation-styles')) {
  const styleSheet = document.createElement('style');
  styleSheet.id = 'moderation-styles';
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
} 
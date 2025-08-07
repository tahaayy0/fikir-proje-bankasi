import React, { useState, useEffect } from 'react';
import { apiService } from '../services/api';

const Oyla = () => {
  const [projeler, setProjeler] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    kategori: '',
    durum: 'Onaylandı',
    siralama: 'yeni'
  });
  const [oylar, setOylar] = useState({});

  const kategoriler = [
    'Tümü', 'Teknoloji', 'Sağlık', 'Eğitim', 'Çevre', 'Sosyal', 'Ekonomi', 'Kültür', 'Diğer'
  ];

  const siralamaSecenekleri = [
    { value: 'yeni', label: 'En Yeni' },
    { value: 'eski', label: 'En Eski' },
    { value: 'populer', label: 'En Popüler' },
    { value: 'enCokOy', label: 'En Çok Oy Alan' }
  ];

  useEffect(() => {
    fetchProjeler();
  }, [filters]);

  const fetchProjeler = async () => {
    try {
      setLoading(true);
      
      // API parametrelerini hazırla
      const params = new URLSearchParams();
      if (filters.kategori && filters.kategori !== 'Tümü') params.append('kategori', filters.kategori);
      if (filters.siralama) params.append('siralama', filters.siralama);
      
      console.log('API parametreleri:', params.toString());
      console.log('Seçilen sıralama:', filters.siralama);
      
      // Oylama için onaylanmış projeleri getir
      const response = await apiService.getOylamaProjeleri(params.toString());
      
      console.log('API yanıtı:', response.data);
      
      if (response.data && response.data.success) {
        const projelerData = response.data.data.projeler || [];
        console.log('Gelen projeler:', projelerData);
        setProjeler(projelerData);
      } else {
        console.error('API yanıtı başarısız:', response.data);
        setProjeler([]);
      }
    } catch (error) {
      console.error('Projeler getirilirken hata:', error);
      setProjeler([]);
    } finally {
      setLoading(false);
    }
  };

  const handleOyVer = async (projeId, oy, email = '') => {
    try {
      // Gerçek API çağrısı
      const response = await apiService.oyVer(projeId, {
        oy: oy,
        email: email,
        kriterler: {
          toplulukFaydasi: oy,
          problemCozumu: oy,
          uygulanabilirlik: oy,
          surdurulebilirlik: oy,
          ilgiCekicilik: oy
        }
      });
      
      if (response.data && response.data.success) {
        // Local state'i güncelle
        setOylar(prev => ({
          ...prev,
          [projeId]: oy
        }));

        // Projeleri güncelle
        setProjeler(prev => prev.map(proje => {
          if (proje._id === projeId) {
            const yeniOySayisi = (proje.oySayisi || 0) + 1;
            const yeniToplamOy = (proje.toplamOy || 0) + oy;
            return {
              ...proje,
              oySayisi: yeniOySayisi,
              toplamOy: yeniToplamOy,
              ortalamaOy: yeniToplamOy / yeniOySayisi
            };
          }
          return proje;
        }));

        alert('Oyunuz başarıyla verildi!');
      } else {
        console.error('API yanıtı başarısız:', response.data);
        alert('Oy verilirken bir hata oluştu.');
      }

    } catch (error) {
      console.error('Oy verme hatası:', error);
      alert('Oy verilirken bir hata oluştu.');
    }
  };

  const renderYildizlar = (proje) => {
    const ortalamaOy = proje.ortalamaOy || 0;
    const oySayisi = proje.oySayisi || 0;
    
    return (
      <div className="yildiz-container">
        <div className="yildizlar">
          {[1, 2, 3, 4, 5].map(yildiz => (
            <button
              key={yildiz}
              className={`yildiz ${yildiz <= ortalamaOy ? 'dolu' : 'bos'}`}
              onClick={() => handleOyVer(proje._id, yildiz)}
              title={`${yildiz} yıldız ver`}
            >
              <i className="fas fa-star"></i>
            </button>
          ))}
        </div>
        <span className="oy-bilgisi">
          {ortalamaOy.toFixed(1)} ({oySayisi} oy)
        </span>
      </div>
    );
  };

  const renderProjeKarti = (proje) => (
    <div key={proje._id} className="proje-kart">
      <div className="proje-header">
        <div className="proje-baslik">
          <h3>{proje.baslik}</h3>
          <div className="proje-meta">
            <span className={`durum-badge ${proje.durum.toLowerCase()}`}>
              {proje.durum}
            </span>
            <span className="proje-kategori">
              <i className="fas fa-tag"></i>
              {proje.kategori}
            </span>
          </div>
        </div>
      </div>

      <div className="proje-icerik">
        <p className="proje-aciklama">{proje.aciklama}</p>
        
        <div className="proje-detaylar">
          {proje.problem && (
            <div className="proje-detay">
              <strong>Problem:</strong> {proje.problem}
            </div>
          )}
          
          {proje.hedefKitle && (
            <div className="proje-detay">
              <strong>Hedef Kitle:</strong> {proje.hedefKitle}
            </div>
          )}

          {proje.olgunlukSeviyesi && (
            <div className="proje-detay">
              <strong>Olgunluk:</strong> {proje.olgunlukSeviyesi}
            </div>
          )}
        </div>
      </div>

      <div className="proje-footer">
        <div className="proje-bilgiler">
          <span className="olusturan">
            <i className="fas fa-user"></i>
            {proje.olusturanKisi}
          </span>
          <span className="tarih">
            <i className="fas fa-calendar"></i>
            {new Date(proje.createdAt).toLocaleDateString('tr-TR')}
          </span>
        </div>

        <div className="oy-sistemi">
          {renderYildizlar(proje)}
        </div>
      </div>

      {proje.dosyaLink && (
        <div className="proje-link">
          <a href={proje.dosyaLink} target="_blank" rel="noopener noreferrer">
            <i className="fas fa-external-link-alt"></i>
            Destekleyici Dosya
          </a>
        </div>
      )}
    </div>
  );

  return (
    <div className="oyla-page">
      <div className="container">
        <div className="page-header">
          <h1><i className="fas fa-vote-yea"></i> Fikir ve Projeleri Oyla</h1>
          <p>Topluluğun en iyi fikirlerini seçmek için oy verin!</p>
        </div>

        {/* Filtreler */}
        <div className="filtreler">
          <div className="filtre-grup">
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

          <div className="filtre-grup">
            <label>Durum:</label>
            <select
              value={filters.durum}
              onChange={(e) => setFilters(prev => ({ ...prev, durum: e.target.value }))}
            >
              <option value="Onaylandı">Onaylandı</option>
              <option value="Aktif">Aktif</option>
              <option value="Tamamlandı">Tamamlandı</option>
            </select>
          </div>

          <div className="filtre-grup">
            <label>Sıralama:</label>
            <select
              value={filters.siralama}
              onChange={(e) => setFilters(prev => ({ ...prev, siralama: e.target.value }))}
            >
              {siralamaSecenekleri.map(secenek => (
                <option key={secenek.value} value={secenek.value}>
                  {secenek.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Projeler Listesi */}
        <div className="projeler-container">
          {loading ? (
            <div className="loading">
              <i className="fas fa-spinner fa-spin"></i>
              Projeler yükleniyor...
            </div>
          ) : projeler.length === 0 ? (
            <div className="bos-durum">
              <i className="fas fa-inbox"></i>
              <p>Henüz oylanacak proje bulunmuyor.</p>
            </div>
          ) : (
            <div className="projeler-grid">
              {projeler.map(renderProjeKarti)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Oyla;

// CSS stilleri
const styles = `
  .oyla-page {
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

  .filtreler {
    background: white;
    border-radius: 12px;
    padding: 20px;
    margin-bottom: 20px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    display: flex;
    gap: 20px;
    flex-wrap: wrap;
  }

  .filtre-grup {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .filtre-grup label {
    font-weight: 600;
    color: #333;
    font-size: 14px;
  }

  .filtre-grup select {
    padding: 8px 12px;
    border: 2px solid #e2e8f0;
    border-radius: 6px;
    font-size: 14px;
    min-width: 150px;
  }

  .projeler-container {
    background: white;
    border-radius: 12px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    overflow: hidden;
    width: 100% !important;
  }

  .projeler-grid {
    display: flex !important;
    flex-direction: column !important;
    flex-wrap: nowrap !important;
    gap: 20px !important;
    padding: 20px !important;
  }

  .proje-kart {
    border: 1px solid #e2e8f0;
    border-radius: 12px;
    padding: 20px;
    background: white;
    transition: all 0.3s ease;
    width: 100% !important;
    max-width: 100% !important;
    flex-shrink: 0 !important;
    flex-basis: 100% !important;
  }

  .proje-kart:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    transform: translateY(-2px);
  }

  .proje-header {
    margin-bottom: 15px;
  }

  .proje-baslik {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 8px;
  }

  .proje-baslik h3 {
    margin: 0;
    color: #333;
    font-size: 20px;
    font-weight: 600;
    flex: 1;
  }

  .proje-meta {
    display: flex;
    gap: 10px;
    align-items: center;
  }

  .durum-badge {
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 600;
    text-transform: uppercase;
    margin-left: 10px;
  }

  .durum-badge.onaylandı {
    background: #d1fae5;
    color: #065f46;
  }

  .durum-badge.aktif {
    background: #dcfce7;
    color: #166534;
  }

  .durum-badge.tamamlandı {
    background: #f3e8ff;
    color: #7c3aed;
  }

  .proje-kategori {
    color: #666;
    font-size: 14px;
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .proje-icerik {
    margin-bottom: 20px;
  }

  .proje-aciklama {
    color: #333;
    line-height: 1.6;
    margin-bottom: 15px;
    font-size: 16px;
  }

  .proje-detaylar {
    display: flex;
    flex-direction: column;
    gap: 15px;
    margin-top: 15px;
  }

  .proje-detay {
    font-size: 14px;
    color: #666;
    margin-bottom: 5px;
  }

  .proje-detay strong {
    color: #333;
  }

  .proje-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
    padding-top: 15px;
    border-top: 1px solid #e2e8f0;
  }

  .proje-bilgiler {
    display: flex;
    flex-direction: column;
    gap: 5px;
    font-size: 14px;
    color: #666;
  }

  .proje-bilgiler span {
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .oy-sistemi {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
  }

  .yildiz-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 5px;
  }

  .yildizlar {
    display: flex;
    gap: 2px;
  }

  .yildiz {
    background: none;
    border: none;
    font-size: 20px;
    cursor: pointer;
    color: #d1d5db;
    transition: all 0.2s ease;
    padding: 2px;
  }

  .yildiz:hover {
    transform: scale(1.1);
  }

  .yildiz.dolu {
    color: #fbbf24;
  }

  .yildiz.bos {
    color: #d1d5db;
  }

  .oy-bilgisi {
    font-size: 12px;
    color: #666;
    font-weight: 600;
  }

  .proje-link {
    text-align: center;
  }

  .proje-link a {
    color: #667eea;
    text-decoration: none;
    font-size: 14px;
    display: inline-flex;
    align-items: center;
    gap: 6px;
  }

  .proje-link a:hover {
    text-decoration: underline;
  }

  .loading {
    text-align: center;
    padding: 40px;
    color: #666;
  }

  .bos-durum {
    text-align: center;
    padding: 40px;
    color: #666;
  }

  .bos-durum i {
    font-size: 48px;
    margin-bottom: 16px;
    color: #d1d5db;
  }

  @media (max-width: 768px) {
    .filtreler {
      flex-direction: column;
    }
    
    .projeler-grid {
      padding: 15px;
    }
    
    .proje-baslik {
      flex-direction: column;
      align-items: flex-start;
      gap: 10px;
    }
    
    .proje-meta {
      flex-direction: column;
      align-items: flex-start;
      gap: 5px;
    }
    

    
    .proje-footer {
      flex-direction: column;
      align-items: flex-start;
      gap: 15px;
    }
  }
`;

// CSS'i sayfaya ekle
if (!document.getElementById('vote-styles')) {
  const styleSheet = document.createElement('style');
  styleSheet.id = 'vote-styles';
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
} 
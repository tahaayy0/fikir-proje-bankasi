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
    { value: 'oy', label: 'En Çok Oy Alan' }
  ];

  useEffect(() => {
    fetchProjeler();
  }, [filters]);

  const fetchProjeler = async () => {
    try {
      setLoading(true);
      const response = await apiService.getProjeler();
      let filteredProjeler = response.data || [];

      // Filtreleme
      if (filters.kategori && filters.kategori !== 'Tümü') {
        filteredProjeler = filteredProjeler.filter(p => p.kategori === filters.kategori);
      }

      if (filters.durum) {
        filteredProjeler = filteredProjeler.filter(p => p.durum === filters.durum);
      }

      // Sıralama
      switch (filters.siralama) {
        case 'yeni':
          filteredProjeler.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          break;
        case 'eski':
          filteredProjeler.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
          break;
        case 'populer':
          filteredProjeler.sort((a, b) => (b.oySayisi || 0) - (a.oySayisi || 0));
          break;
        case 'oy':
          filteredProjeler.sort((a, b) => (b.toplamOy || 0) - (a.toplamOy || 0));
          break;
        default:
          break;
      }

      setProjeler(filteredProjeler);
    } catch (error) {
      console.error('Projeler getirilirken hata:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOyVer = async (projeId, oy) => {
    try {
      // Burada oy verme API'si çağrılacak
      console.log(`Proje ${projeId} için ${oy} oyu verildi`);
      
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

    } catch (error) {
      console.error('Oy verme hatası:', error);
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
          <span className={`durum-badge ${proje.durum.toLowerCase()}`}>
            {proje.durum}
          </span>
        </div>
        <div className="proje-kategori">
          <i className="fas fa-tag"></i>
          {proje.kategori}
        </div>
      </div>

      <div className="proje-icerik">
        <p className="proje-aciklama">{proje.aciklama}</p>
        
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
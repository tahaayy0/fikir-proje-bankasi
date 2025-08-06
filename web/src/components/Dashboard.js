import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { apiService } from '../services/api';
import './Dashboard.css';

const Dashboard = () => {
  const [projeler, setProjeler] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    toplam: 0,
    aktif: 0,
    tamamlanan: 0,
    taslak: 0
  });
  
  const { admin, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchProjeler();
  }, []);

  const fetchProjeler = async () => {
    try {
      setLoading(true);
      const response = await apiService.getProjeler();
      const projelerData = response.data.data;
      
      setProjeler(projelerData);
      
      // İstatistikleri hesapla
      const stats = {
        toplam: projelerData.length,
        aktif: projelerData.filter(p => p.durum === 'Aktif').length,
        tamamlanan: projelerData.filter(p => p.durum === 'Tamamlandı').length,
        taslak: projelerData.filter(p => p.durum === 'Taslak').length
      };
      
      setStats(stats);
    } catch (error) {
      console.error('Projeler yüklenirken hata:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const getStatusColor = (durum) => {
    switch (durum) {
      case 'Aktif': return 'status-active';
      case 'Tamamlandı': return 'status-completed';
      case 'Taslak': return 'status-draft';
      case 'İptal': return 'status-cancelled';
      default: return 'status-default';
    }
  };

  const getPriorityColor = (oncelik) => {
    switch (oncelik) {
      case 'Kritik': return 'priority-critical';
      case 'Yüksek': return 'priority-high';
      case 'Orta': return 'priority-medium';
      case 'Düşük': return 'priority-low';
      default: return 'priority-default';
    }
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner">
          <i className="fas fa-spinner fa-spin"></i>
          <p>Yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-content">
          <div className="header-left">
            <h1>Admin Dashboard</h1>
            <p>Fikir Proje Bankası Yönetim Paneli</p>
          </div>
          <div className="header-right">
            <div className="admin-info">
              <span>Hoş geldin, {admin?.isim} {admin?.soyisim}</span>
            </div>
            <button onClick={handleLogout} className="logout-button">
              <i className="fas fa-sign-out-alt"></i>
              Çıkış
            </button>
          </div>
        </div>
      </header>

      {/* Stats Cards */}
      <section className="stats-section">
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">
              <i className="fas fa-project-diagram"></i>
            </div>
            <div className="stat-content">
              <h3>{stats.toplam}</h3>
              <p>Toplam Proje</p>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon active">
              <i className="fas fa-play-circle"></i>
            </div>
            <div className="stat-content">
              <h3>{stats.aktif}</h3>
              <p>Aktif Proje</p>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon completed">
              <i className="fas fa-check-circle"></i>
            </div>
            <div className="stat-content">
              <h3>{stats.tamamlanan}</h3>
              <p>Tamamlanan</p>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon draft">
              <i className="fas fa-edit"></i>
            </div>
            <div className="stat-content">
              <h3>{stats.taslak}</h3>
              <p>Taslak</p>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Table */}
      <section className="projects-section">
        <div className="section-header">
          <h2>Projeler</h2>
          <button className="refresh-button" onClick={fetchProjeler}>
            <i className="fas fa-sync-alt"></i>
            Yenile
          </button>
        </div>

        <div className="projects-table-container">
          <table className="projects-table">
            <thead>
              <tr>
                <th>Başlık</th>
                <th>Kategori</th>
                <th>Durum</th>
                <th>Öncelik</th>
                <th>Oluşturan</th>
                <th>Başlangıç</th>
                <th>İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {projeler.map((proje) => (
                <tr key={proje._id}>
                  <td>
                    <div className="project-title">
                      <strong>{proje.baslik}</strong>
                      <p>{proje.aciklama.substring(0, 50)}...</p>
                    </div>
                  </td>
                  <td>
                    <span className="category-badge">{proje.kategori}</span>
                  </td>
                  <td>
                    <span className={`status-badge ${getStatusColor(proje.durum)}`}>
                      {proje.durum}
                    </span>
                  </td>
                  <td>
                    <span className={`priority-badge ${getPriorityColor(proje.oncelik)}`}>
                      {proje.oncelik}
                    </span>
                  </td>
                  <td>{proje.olusturanKisi}</td>
                  <td>
                    {new Date(proje.baslangicTarihi).toLocaleDateString('tr-TR')}
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button className="action-btn view" title="Görüntüle">
                        <i className="fas fa-eye"></i>
                      </button>
                      <button className="action-btn edit" title="Düzenle">
                        <i className="fas fa-edit"></i>
                      </button>
                      <button className="action-btn delete" title="Sil">
                        <i className="fas fa-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {projeler.length === 0 && (
            <div className="no-projects">
              <i className="fas fa-inbox"></i>
              <p>Henüz proje bulunmuyor</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Dashboard; 
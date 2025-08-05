import React from 'react';
import './App.css';

function App() {
  return (
    <div className="container">
      <header className="header">
        <h1 className="title">Fikir Proje Bankası</h1>
        <p className="subtitle">Proje yönetim platformu</p>
      </header>
      
      <main className="main">
        <div className="card">
          <h2 className="card-title">Hoş Geldiniz! 🚀</h2>
          <p className="card-text">
            Fikir Proje Bankası, projelerinizi organize etmenize ve yönetmenize yardımcı olan modern bir platformdur.
          </p>
          <div className="features">
            <div className="feature">
              <h3 className="feature-title">Proje Yönetimi</h3>
              <p className="feature-text">Projelerinizi kolayca oluşturun ve yönetin</p>
            </div>
            <div className="feature">
              <h3 className="feature-title">Takım İşbirliği</h3>
              <p className="feature-text">Takım üyelerinizle etkili iletişim kurun</p>
            </div>
            <div className="feature">
              <h3 className="feature-title">İlerleme Takibi</h3>
              <p className="feature-text">Proje ilerlemenizi gerçek zamanlı takip edin</p>
            </div>
          </div>
        </div>
        
        <div className="card">
          <h2 className="card-title">API Durumu</h2>
          <div className="status">
            <div className="status-dot"></div>
            <span className="status-text">Backend API Bağlantısı Hazır</span>
          </div>
          <p className="card-text">
            API URL: {process.env.REACT_APP_API_URL || 'http://localhost:5000'}
          </p>
        </div>
      </main>
      
      <footer className="footer">
        <p>&copy; 2024 Fikir Proje Bankası. Tüm hakları saklıdır.</p>
      </footer>
    </div>
  );
}

export default App;

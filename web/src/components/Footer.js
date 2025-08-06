import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>Fikir Proje Bankası</h3>
            <p>Hayal gücünü işe dönüştürenlerin buluşma noktası</p>
            <div className="social-links">
              <a href="#" className="social-link">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" className="social-link">
                <i className="fab fa-linkedin"></i>
              </a>
              <a href="#" className="social-link">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="#" className="social-link">
                <i className="fab fa-github"></i>
              </a>
            </div>
          </div>
          
          <div className="footer-section">
            <h4>Hızlı Linkler</h4>
            <ul>
              <li><Link to="/fikir-ekle">Fikir Ekle</Link></li>
              <li><Link to="/proje-ekle">Proje Ekle</Link></li>
              <li><Link to="/oyla">Oyla</Link></li>
              <li><Link to="/basvuru-takip">Başvuru Takip</Link></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h4>Kategoriler</h4>
            <ul>
              <li><Link to="/kategori/teknoloji">Teknoloji</Link></li>
              <li><Link to="/kategori/saglik">Sağlık</Link></li>
              <li><Link to="/kategori/egitim">Eğitim</Link></li>
              <li><Link to="/kategori/cevre">Çevre</Link></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h4>İletişim</h4>
            <ul>
              <li><i className="fas fa-envelope"></i> info@fikirprojebankasi.com</li>
              <li><i className="fas fa-phone"></i> +90 555 123 45 67</li>
              <li><i className="fas fa-map-marker-alt"></i> İstanbul, Türkiye</li>
            </ul>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; 2025 Fikir Proje Bankası. Tüm hakları saklıdır.</p>
          <div className="footer-links">
            <Link to="/gizlilik">Gizlilik Politikası</Link>
            <Link to="/kullanim-kosullari">Kullanım Koşulları</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 
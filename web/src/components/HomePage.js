import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Hero from './Hero';
import Features from './Features';
import Footer from './Footer';

const HomePage = () => {
  const { admin } = useAuth();

  return (
    <div className="home-page">
      <Hero />
      
      {/* Admin Dashboard */}
      {admin && (
        <section className="admin-dashboard">
          <div className="container">
            <div className="dashboard-header">
              <h2>Admin Dashboard</h2>
              <p>Yönetim paneli araçları</p>
            </div>
            <div className="dashboard-grid">
              <Link to="/moderation" className="dashboard-card">
                <div className="card-icon">
                  <i className="fas fa-shield-alt"></i>
                </div>
                <div className="card-content">
                  <h3>Moderation</h3>
                  <p>Proje başvurularını incele ve onayla</p>
                </div>
              </Link>
            </div>
          </div>
        </section>
      )}
      
      <Features />
      <Footer />
    </div>
  );
};

export default HomePage; 
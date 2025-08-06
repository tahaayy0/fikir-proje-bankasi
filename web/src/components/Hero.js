import React from 'react';
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <section className="hero">
      <div className="hero-background"></div>
      <div className="hero-content">
        <div className="hero-text">
          <h1 className="hero-title">
            Fikrini Gerçeğe Dönüştür
          </h1>
          <p className="hero-subtitle">
            Fikir Proje Bankası, hayal gücünü işe dönüştürenlerin buluşma noktası.
            Fikirlerinizi paylaşın, topluluktan destek alın.
          </p>
          <div className="hero-buttons">
            <Link to="/add-idea" className="cta-button primary">
              <i className="fas fa-lightbulb"></i>
              Add Idea
            </Link>
            <Link to="/add-project" className="cta-button secondary">
              <i className="fas fa-rocket"></i>
              Add Project
            </Link>
          </div>
        </div>
        <div className="hero-illustration">
          <div className="idea-bulb">
            <i className="fas fa-lightbulb"></i>
          </div>
          <div className="floating-elements">
            <div className="element element-1">💡</div>
            <div className="element element-2">🚀</div>
            <div className="element element-3">⚡</div>
            <div className="element element-4">🎯</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero; 
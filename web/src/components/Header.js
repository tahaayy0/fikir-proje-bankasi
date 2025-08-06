import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          {/* Logo */}
          <Link to="/" className="logo">
            <i className="fas fa-lightbulb"></i>
            <span>Fikir Proje Bankası</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className={`nav ${isMenuOpen ? 'nav-open' : ''}`}>
            <ul className="nav-list">
              <li className="nav-item">
                <Link 
                  to="/" 
                  className={`nav-link ${isActive('/') ? 'active' : ''}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <i className="fas fa-home"></i>
                  Ana Sayfa
                </Link>
              </li>
              <li className="nav-item">
                <Link 
                  to="/add-idea" 
                  className={`nav-link ${isActive('/add-idea') ? 'active' : ''}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <i className="fas fa-lightbulb"></i>
                  Add Idea
                </Link>
              </li>
              <li className="nav-item">
                <Link 
                  to="/add-project" 
                  className={`nav-link ${isActive('/add-project') ? 'active' : ''}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <i className="fas fa-rocket"></i>
                  Add Project
                </Link>
              </li>
              <li className="nav-item">
                <Link 
                  to="/vote" 
                  className={`nav-link ${isActive('/vote') ? 'active' : ''}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <i className="fas fa-vote-yea"></i>
                  Vote
                </Link>
              </li>
              <li className="nav-item">
                <Link 
                  to="/application-tracking" 
                  className={`nav-link ${isActive('/application-tracking') ? 'active' : ''}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <i className="fas fa-tasks"></i>
                  Track Application
                </Link>
              </li>
              <li className="nav-item">
                <Link 
                  to="/moderation" 
                  className={`nav-link moderasyon ${isActive('/moderation') ? 'active' : ''}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <i className="fas fa-shield-alt"></i>
                  Moderation
                </Link>
              </li>
            </ul>
          </nav>

          {/* Mobile Menu Button */}
          <button className="mobile-menu-btn" onClick={toggleMenu}>
            <i className={`fas fa-${isMenuOpen ? 'times' : 'bars'}`}></i>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header; 
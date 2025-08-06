import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import HomePage from './components/HomePage';
import AddIdea from './components/AddIdea';
import AddProject from './components/AddProject';
import Vote from './components/Vote';
import ApplicationTracking from './components/ApplicationTracking';
import Moderation from './components/Moderation';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app">
        <Header />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/add-idea" element={<AddIdea />} />
            <Route path="/add-project" element={<AddProject />} />
            <Route path="/vote" element={<Vote />} />
            <Route path="/application-tracking" element={<ApplicationTracking />} />
            <Route path="/moderation" element={<Moderation />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;

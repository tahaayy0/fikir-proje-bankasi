import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [apiStatus, setApiStatus] = useState('loading');
  const [apiMessage, setApiMessage] = useState('');

  useEffect(() => {
    // Test API connection
    fetch('/api/test')
      .then(response => response.json())
      .then(data => {
        setApiStatus('success');
        setApiMessage(data.message);
      })
      .catch(error => {
        setApiStatus('error');
        setApiMessage('API bağlantısı başarısız');
        console.error('API Error:', error);
      });
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <h1 className="text-4xl font-bold text-blue-600 mb-4">
          Fikir Proje Bankası
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Proje yönetim platformu
        </p>
        
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-md">
          <h2 className="text-xl font-semibold mb-4">Sistem Durumu</h2>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-medium">Frontend:</span>
              <span className="text-green-600 font-semibold">✓ Çalışıyor</span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="font-medium">Backend API:</span>
              {apiStatus === 'loading' && (
                <span className="text-yellow-600 font-semibold">⏳ Kontrol ediliyor...</span>
              )}
              {apiStatus === 'success' && (
                <span className="text-green-600 font-semibold">✓ Çalışıyor</span>
              )}
              {apiStatus === 'error' && (
                <span className="text-red-600 font-semibold">✗ Bağlantı hatası</span>
              )}
            </div>
          </div>
          
          {apiStatus === 'success' && (
            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded">
              <p className="text-sm text-green-800">{apiMessage}</p>
            </div>
          )}
          
          {apiStatus === 'error' && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded">
              <p className="text-sm text-red-800">
                Backend servisi başlatılmamış olabilir. 
                Docker Compose ile servisleri başlatmayı deneyin.
              </p>
            </div>
          )}
        </div>
        
        <div className="mt-8 text-sm text-gray-500">
          <p>Geliştirme ortamı - v1.0.0</p>
        </div>
      </header>
    </div>
  );
}

export default App; 
import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [apiStatus, setApiStatus] = useState('loading');
  const [apiMessage, setApiMessage] = useState('');
  const [healthData, setHealthData] = useState(null);

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

    // Get health data
    fetch('/api/health')
      .then(response => response.json())
      .then(data => {
        setHealthData(data);
      })
      .catch(error => {
        console.error('Health check error:', error);
      });
  }, []);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'success':
        return '🟢';
      case 'error':
        return '🔴';
      case 'loading':
        return '🟡';
      default:
        return '⚪';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'success':
        return 'Çalışıyor';
      case 'error':
        return 'Bağlantı Hatası';
      case 'loading':
        return 'Kontrol Ediliyor...';
      default:
        return 'Bilinmiyor';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-block p-4 bg-white rounded-full shadow-lg mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <span className="text-white text-2xl font-bold">💡</span>
            </div>
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Fikir Proje Bankası
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Projelerinizi organize edin, fikirlerinizi hayata geçirin
          </p>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto">
          {/* Status Cards */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {/* Frontend Status */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Frontend</h3>
                <div className="flex items-center space-x-2">
                  <span className="text-2xl">🟢</span>
                  <span className="text-green-600 font-medium">Çalışıyor</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Port:</span>
                  <span className="font-medium">3000</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Framework:</span>
                  <span className="font-medium">React 18</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Styling:</span>
                  <span className="font-medium">Tailwind CSS</span>
                </div>
              </div>
            </div>

            {/* Backend Status */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Backend API</h3>
                <div className="flex items-center space-x-2">
                  <span className="text-2xl">{getStatusIcon(apiStatus)}</span>
                  <span className={`font-medium ${
                    apiStatus === 'success' ? 'text-green-600' : 
                    apiStatus === 'error' ? 'text-red-600' : 'text-yellow-600'
                  }`}>
                    {getStatusText(apiStatus)}
                  </span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Port:</span>
                  <span className="font-medium">5001</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Framework:</span>
                  <span className="font-medium">Express.js</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Database:</span>
                  <span className="font-medium">MongoDB</span>
                </div>
              </div>
            </div>
          </div>

          {/* Health Information */}
          {healthData && (
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 mb-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Sistem Sağlığı</h3>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl mb-2">🕐</div>
                  <div className="text-sm text-gray-600">Son Güncelleme</div>
                  <div className="font-medium text-sm">
                    {new Date(healthData.timestamp).toLocaleTimeString('tr-TR')}
                  </div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl mb-2">📊</div>
                  <div className="text-sm text-gray-600">Durum</div>
                  <div className="font-medium text-sm text-green-600">{healthData.status}</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl mb-2">🗄️</div>
                  <div className="text-sm text-gray-600">Veritabanı</div>
                  <div className={`font-medium text-sm ${
                    healthData.database === 'connected' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {healthData.database === 'connected' ? 'Bağlı' : 'Bağlantısız'}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* API Message */}
          {apiStatus === 'success' && (
            <div className="bg-green-50 border border-green-200 rounded-2xl p-6 mb-8">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <span className="text-2xl">✅</span>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-green-800">Bağlantı Başarılı</h3>
                  <div className="mt-2 text-sm text-green-700">
                    <p>{apiMessage}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {apiStatus === 'error' && (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-6 mb-8">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <span className="text-2xl">❌</span>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">Bağlantı Hatası</h3>
                  <div className="mt-2 text-sm text-red-700">
                    <p>Backend servisi başlatılmamış olabilir. Docker Compose ile servisleri başlatmayı deneyin.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

      
        </div>

        {/* Footer */}
        <div className="text-center mt-12 text-sm text-gray-500">
          <p>Geliştirme ortamı - v1.0.0</p>
          <p className="mt-1">Fikir Proje Bankası © 2025</p>
        </div>
      </div>
    </div>
  );
}

export default App; 
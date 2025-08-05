# Render Deployment Rehberi

Bu rehber, Fikir Proje Bankası uygulamasını Render'da deploy etmek için hazırlanmıştır.

## 🚀 Hızlı Başlangıç

### 1. MongoDB Atlas Kurulumu

1. [MongoDB Atlas](https://www.mongodb.com/atlas) hesabı oluşturun
2. Yeni bir cluster oluşturun (Free tier yeterli)
3. Database Access'ten bir kullanıcı oluşturun
4. Network Access'ten IP whitelist'e `0.0.0.0/0` ekleyin (tüm IP'lere izin)
5. Connect butonuna tıklayıp connection string'i kopyalayın

### 2. Render'da Deployment

1. [Render Dashboard](https://dashboard.render.com)'a gidin
2. "New +" butonuna tıklayın
3. "Blueprint" seçin
4. GitHub repository'nizi bağlayın
5. `render.yaml` dosyası otomatik olarak algılanacak

### 3. Environment Variables Ayarlama

Backend servisi için şu environment variable'ları ayarlayın:

```
NODE_ENV=production
PORT=10000
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/fikir_proje_bankasi
JWT_SECRET=your-super-secret-jwt-key-here
```

Frontend servisi için:
```
REACT_APP_API_URL=https://fikir-proje-bankasi-backend.onrender.com/api
```

## 📁 Dosya Yapısı

```
fikir-proje-bankasi/
├── render.yaml              # Render deployment konfigürasyonu
├── env.example              # Environment variables örneği
├── backend/
│   ├── index.js            # Express server
│   ├── package.json        # Backend dependencies
│   └── Dockerfile          # Backend container
├── web/
│   ├── src/
│   │   ├── App.js          # React ana component
│   │   └── App.css         # Styling
│   ├── package.json        # Frontend dependencies
│   └── Dockerfile          # Frontend container
└── docker-compose.yml      # Local development
```

## 🔧 Konfigürasyon Detayları

### Backend Service
- **Type**: Web Service (Node.js)
- **Plan**: Free
- **Build Command**: `cd backend && npm install --production`
- **Start Command**: `cd backend && npm start`
- **Health Check**: `/api/health`

### Frontend Service
- **Type**: Static Site
- **Plan**: Free
- **Build Command**: `cd web && npm install && npm run build`
- **Publish Path**: `./web/build`

## 🌐 URL'ler

Deployment sonrası şu URL'ler oluşacak:
- **Frontend**: `https://fikir-proje-bankasi-frontend.onrender.com`
- **Backend API**: `https://fikir-proje-bankasi-backend.onrender.com`

## 🔍 Health Check

Backend'in çalışıp çalışmadığını kontrol etmek için:
```
https://fikir-proje-bankasi-backend.onrender.com/api/health
```

## 🛠️ Troubleshooting

### MongoDB Bağlantı Hatası
- MongoDB Atlas'ta IP whitelist'i kontrol edin
- Connection string'in doğru olduğundan emin olun
- Username/password'ün doğru olduğunu kontrol edin

### Build Hatası
- Node.js versiyonunun uyumlu olduğunu kontrol edin
- Package.json dosyalarının doğru olduğunu kontrol edin
- Build loglarını inceleyin

### CORS Hatası
- Backend'de CORS ayarlarının doğru olduğunu kontrol edin
- Frontend URL'inin backend'de whitelist'te olduğunu kontrol edin

## 📊 Monitoring

Render dashboard'da şu metrikleri takip edebilirsiniz:
- CPU kullanımı
- Memory kullanımı
- Response time
- Error rate
- Request count

## 🔄 Auto-Deploy

Her GitHub push'unda otomatik deploy için:
1. Render dashboard'da servis ayarlarına gidin
2. "Auto-Deploy" seçeneğini aktif edin
3. Branch'i `main` veya `dev` olarak ayarlayın

## 💰 Maliyet

Free plan'da:
- Backend: 750 saat/ay (yaklaşık 31 gün)
- Frontend: Sınırsız
- Bandwidth: 100GB/ay

## 🔐 Güvenlik

Production'da mutlaka:
- Güçlü JWT_SECRET kullanın
- MongoDB Atlas'ta güvenli connection string kullanın
- Environment variable'ları Render dashboard'dan ayarlayın
- HTTPS kullanın (Render otomatik sağlar)

## 📞 Destek

Sorun yaşarsanız:
1. Render loglarını kontrol edin
2. Health check endpoint'ini test edin
3. Environment variable'ları kontrol edin
4. MongoDB Atlas bağlantısını test edin 
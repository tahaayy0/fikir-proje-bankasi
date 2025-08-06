const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// JWT Secret - Production'da environment variable'dan al
const JWT_SECRET = process.env.JWT_SECRET || 'fikir-proje-bankasi-jwt-secret-key-2025';
process.env.JWT_SECRET = JWT_SECRET;

// Swagger configuration
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Fikir Proje Bankası API',
      version: '1.0.0',
      description: 'Fikir Proje Bankası için RESTful API dokümantasyonu',
      contact: {
        name: 'API Destek',
        email: 'destek@fikirprojebankasi.com'
      }
    },
    servers: [
      {
        url: 'http://localhost:5001',
        description: 'Development server (Docker)'
      },
      {
        url: `http://localhost:${PORT}`,
        description: 'Development server (Direct)'
      },
      {
        url: 'https://fikir-proje-bankasi-backend.onrender.com',
        description: 'Production server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    }
  },
  apis: ['./routes/*.js', './index.js']
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

// CORS Configuration
const corsOptions = {
  origin: [
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    'http://localhost:3001',
    'http://127.0.0.1:3001',
    'http://localhost:5001',
    'http://127.0.0.1:5001',
    'https://fikir-proje-bankasi.onrender.com',
    'https://fikir-proje-bankasi-web.onrender.com',
    'https://fikir-proje-bankasi-frontend.onrender.com'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: [
    'Origin',
    'X-Requested-With',
    'Content-Type',
    'Accept',
    'Authorization',
    'Cache-Control',
    'Pragma'
  ],
  exposedHeaders: ['Content-Length', 'X-Requested-With'],
  optionsSuccessStatus: 200
};

// Helmet CSP Configuration for Swagger UI
const helmetConfig = {
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "http://localhost:5000", "http://localhost:5001", "http://localhost:3000", "https://fikir-proje-bankasi-backend.onrender.com"],
      frameSrc: ["'self'"],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: []
    }
  }
};

// Middleware
app.use(helmet(helmetConfig));
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// MongoDB Connection - Render'da farklı environment variable isimleri kullanılıyor olabilir
// Eğer MONGO_URI yoksa veya Atlas bağlantısı çalışmıyorsa local MongoDB kullan
const mongoURI = process.env.MONGO_URI || process.env.MONGODB_URI || 'mongodb://localhost:27017/myappdb';

const connectDB = async () => {
  try {
    console.log('MongoDB bağlantısı kuruluyor...');
    console.log('Environment variables:');
    console.log('MONGO_URI:', process.env.MONGO_URI ? 'Set' : 'Not set');
    console.log('MONGODB_URI:', process.env.MONGODB_URI ? 'Set' : 'Not set');
    
    // Render'da farklı environment variable isimleri kullanılıyor olabilir
    const mongoURI = process.env.MONGO_URI || process.env.MONGODB_URI || 'mongodb://localhost:27017/myappdb';
    console.log('Using URI:', mongoURI);
    
    // MongoDB Atlas için özel ayarlar
    const connectionOptions = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 60000,
      socketTimeoutMS: 60000,
      maxPoolSize: 5,
      minPoolSize: 1,
      maxIdleTimeMS: 30000,
      retryWrites: true,
      w: 'majority',
      bufferCommands: true,
      autoIndex: true,
      autoCreate: true
    };

    // MongoDB Atlas için ek güvenlik ayarları
    if (mongoURI.includes('mongodb+srv://')) {
      connectionOptions.ssl = true;
      connectionOptions.sslValidate = false; // Development için
      connectionOptions.retryReads = true;
      connectionOptions.retryWrites = true;
    }

    await mongoose.connect(mongoURI, connectionOptions);
    
    console.log('MongoDB connected successfully');
    console.log('Connection state:', mongoose.connection.readyState);
    console.log('Database name:', mongoose.connection.name);
    
  } catch (err) {
    console.error('MongoDB connection error:', err);
    
    // Eğer MongoDB Atlas bağlantısı başarısız olursa, local MongoDB'yi dene
    if (mongoURI.includes('mongodb+srv://') && !mongoURI.includes('localhost')) {
      console.log('MongoDB Atlas bağlantısı başarısız, local MongoDB deneniyor...');
      try {
        await mongoose.connect('mongodb://localhost:27017/myappdb', {
          useNewUrlParser: true,
          useUnifiedTopology: true,
          serverSelectionTimeoutMS: 5000,
          socketTimeoutMS: 10000
        });
        console.log('Local MongoDB connected successfully');
        return;
      } catch (localErr) {
        console.error('Local MongoDB connection also failed:', localErr);
      }
    }
    
    // Render'da MongoDB servisi yoksa, in-memory database kullan
    if (process.env.NODE_ENV === 'production' && !process.env.MONGO_URI) {
      console.log('Production ortamında MongoDB URI yok, in-memory database kullanılıyor...');
      try {
        // Basit bir in-memory storage (geçici çözüm)
        global.inMemoryDB = global.inMemoryDB || [];
        console.log('In-memory database initialized');
        return;
      } catch (memErr) {
        console.error('In-memory database failed:', memErr);
      }
    }
    
    console.log('Retrying connection in 10 seconds...');
    // Retry connection after 10 seconds
    setTimeout(connectDB, 10000);
  }
};

// MongoDB bağlantı durumunu kontrol eden middleware
const checkDBConnection = (req, res, next) => {
  // Render üzerinde bağlantı biraz zaman alabiliyor, bu yüzden daha esnek olalım
  if (mongoose.connection.readyState === 1) {
    next();
  } else if (mongoose.connection.readyState === 2) {
    // Bağlantı kuruluyor, biraz bekle
    setTimeout(() => {
      if (mongoose.connection.readyState === 1) {
        next();
      } else {
        res.status(503).json({ 
          success: false, 
          message: 'Veritabanı bağlantısı henüz hazır değil. Lütfen birkaç saniye sonra tekrar deneyin.',
          error: 'Database connection not ready'
        });
      }
    }, 2000); // 2 saniye bekle
  } else {
    res.status(503).json({ 
      success: false, 
      message: 'Veritabanı bağlantısı henüz hazır değil. Lütfen birkaç saniye sonra tekrar deneyin.',
      error: 'Database connection not ready'
    });
  }
};

connectDB();

// Swagger UI with custom options
const swaggerUiOptions = {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'Fikir Proje Bankası API',
  customfavIcon: '/favicon.ico',
  swaggerOptions: {
    persistAuthorization: true,
    displayRequestDuration: true,
    filter: true,
    deepLinking: true,
    tryItOutEnabled: true,
    defaultModelsExpandDepth: 1,
    defaultModelExpandDepth: 1,
    docExpansion: 'list'
  }
};

// Swagger UI route with CSP disabled
app.use('/api-docs', (req, res, next) => {
  // Disable CSP for Swagger UI
  res.setHeader('Content-Security-Policy', "default-src 'self' 'unsafe-inline' 'unsafe-eval' data: http: https:;");
  next();
}, swaggerUi.serve, swaggerUi.setup(swaggerSpec, swaggerUiOptions));

// Routes
const projeRoutes = require('./routes/projeler');
const adminRoutes = require('./routes/admin');

// Basic route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Fikir Proje Bankası API is running!',
    documentation: '/api-docs',
    health: '/api/health'
  });
});

/**
 * @swagger
 * /api/test:
 *   get:
 *     summary: Test endpoint
 *     tags: [Test]
 *     responses:
 *       200:
 *         description: API çalışıyor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
app.get('/api/test', (req, res) => {
  res.json({ message: 'Backend API is working!' });
});

/**
 * @swagger
 * /api/health:
 *   get:
 *     summary: Sistem sağlık kontrolü
 *     tags: [System]
 *     responses:
 *       200:
 *         description: Sistem durumu
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                 database:
 *                   type: object
 *                   properties:
 *                     status:
 *                       type: string
 *                     readyState:
 *                       type: integer
 *                     host:
 *                       type: string
 *                     port:
 *                       type: integer
 *                     name:
 *                       type: string
 *                 services:
 *                   type: object
 *                   properties:
 *                     api:
 *                       type: string
 *                     database:
 *                       type: string
 */
app.get('/api/health', (req, res) => {
  const dbState = mongoose.connection.readyState;
  const dbStates = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting'
  };
  
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    database: {
      status: dbStates[dbState] || 'unknown',
      readyState: dbState,
      host: mongoose.connection.host || 'unknown',
      port: mongoose.connection.port || 'unknown',
      name: mongoose.connection.name || 'unknown'
    },
    services: {
      api: 'running',
      database: dbState === 1 ? 'connected' : 'disconnected'
    }
  });
});

// Handle preflight requests
app.options('*', cors(corsOptions));

// API Routes
app.use('/api/projeler', checkDBConnection, projeRoutes);
app.use('/api/admin', checkDBConnection, adminRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
  console.log(`Swagger Documentation: http://localhost:${PORT}/api-docs`);
}); 
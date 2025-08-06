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

// MongoDB Connection
const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/myappdb';

const connectDB = async () => {
  try {
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 30000, // 30 saniye server seçim timeout
      socketTimeoutMS: 45000, // 45 saniye socket timeout
      bufferMaxEntries: 0, // Buffer'ı devre dışı bırak
      bufferCommands: false, // Buffer komutlarını devre dışı bırak
      maxPoolSize: 10, // Maksimum bağlantı havuzu boyutu
      minPoolSize: 1, // Minimum bağlantı havuzu boyutu
      maxIdleTimeMS: 30000, // Maksimum boşta kalma süresi
      retryWrites: true, // Yazma işlemlerini yeniden dene
      w: 'majority' // Write concern
    });
    console.log('MongoDB connected successfully');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    // Retry connection after 5 seconds
    setTimeout(connectDB, 5000);
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
app.use('/api/projeler', projeRoutes);

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
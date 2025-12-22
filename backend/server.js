const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const session = require('express-session');
const cookieParser = require('cookie-parser');
// const MongoStore = require('connect-mongo');
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const app = express();

// const allowedOrigins = [
//   process.env.FRONTEND_URL,  // Your Vercel URL
//   'http://localhost:5173',   // Local development
//   'http://localhost:3000'    // Alternative local port
// ];


// const corsOptions = {
//   origin: function (origin, callback) {
//     // Allow requests with no origin (like mobile apps or curl requests)
//     if (!origin) return callback(null, true);
    
//     if (allowedOrigins.includes(origin)) {
//       callback(null, true);
//     } else {
//       console.log('❌ Blocked by CORS:', origin);
//       callback(new Error('Not allowed by CORS'));
//     }
//   },
//   credentials: true,
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
//   allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
//   exposedHeaders: ['set-cookie']
// };


// In server.js - Production CORS
const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      'https://festro.vercel.app', // Your Vercel URL
      'https://www.festro.vercel.app', // With www
      'http://localhost:5173' // For dev
    ];
    
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log('❌ Blocked by CORS:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['set-cookie']
};

app.use(cors(corsOptions));

// const corsOptions = {
//   origin: process.env.FRONTEND_URL || 'https://festro.vercel.app',
//   credentials: true,
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
//   allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
// };

// app.use(cors(corsOptions));


// Middleware
app.use(express.json());
app.use(cookieParser());

// Session middleware
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  // store: MongoStore.create({ 
  //   mongoUrl: process.env.MONGODB_URI,
  //   ttl: 14 * 24 * 60 * 60 // 14 days
  // }),
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 7 * 24 * 60 * 60 * 1000,
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  },
  name: 'festro.sid',
  proxy: true // ← TRUST PROXY FOR COOKIES
}));

// MUST COME AFTER SESSION MIDDLEWARE
if (process.env.NODE_ENV === 'production') {
  app.set('trust proxy', 1);
}



// MongoDB Connection
// mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/event-management', {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// })
// .then(() => console.log('MongoDB connected'))
// .catch(err => console.log('MongoDB connection error:', err));

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/event-management')
.then(() => console.log('MongoDB connected'))
.catch(err => console.log('MongoDB connection error:', err));


// Import routes
const authRoutes = require('./routes/auth');
const usersRouter = require('./routes/users');
const bookingsRouter = require('./routes/bookings');
const ratingsRouter = require('./routes/ratings');
const eventRoutes = require('./routes/events'); // ADD THIS
const dashboardRoutes = require('./routes/dashboard');
const experiencesRoutes = require('./routes/experiences');
const reportRoutes = require('./routes/report');



// app.use('/uploads', express.static(path.join(__dirname, '../frontend/public/uploads')));
// app.use('/experiences', express.static(path.join(__dirname, '../frontend/public/experiences'))); 


const uploadsDir = path.join(__dirname, '../frontend/public/uploads');
const experiencesDir = path.join(__dirname, '../frontend/public/experiences');

// Create directories if they don't exist
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log('Created uploads directory');
}

if (!fs.existsSync(experiencesDir)) {
  fs.mkdirSync(experiencesDir, { recursive: true });
  console.log('Created experiences directory');
}

// Then your static routes
app.use('/uploads', express.static(uploadsDir));
app.use('/experiences', express.static(experiencesDir));



// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/users', usersRouter);
app.use('/api/bookings', bookingsRouter);
app.use('/api/ratings', ratingsRouter);
app.use('/api/events', eventRoutes); 
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/experiences', experiencesRoutes);
app.use("/api/newsletter", require("./routes/newsletter"));
app.use('/api/report', reportRoutes);

app.get('/', (req, res) => {
  res.json({ 
    message: 'Event Management API Running',
    session: req.sessionID ? 'Active' : 'None',
    environment: process.env.NODE_ENV || 'development'
  });
});

// Clear session (logout test)
app.get('/api/auth/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: 'Failed to logout' });
    }
    res.clearCookie('festro.sid');
    res.json({ message: 'Logged out successfully' });
  });
});


// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: process.env.NODE_ENV === 'production' 
      ? 'Something went wrong' 
      : err.message 
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');
// require('dotenv').config();

// // Debug: Check environment variables
// console.log('=== Environment Variables Check ===');
// console.log('GOOGLE_CLIENT_ID exists:', !!process.env.GOOGLE_CLIENT_ID);
// console.log('GOOGLE_CLIENT_ID length:', process.env.GOOGLE_CLIENT_ID?.length || 0);
// if (process.env.GOOGLE_CLIENT_ID) {
//   console.log('GOOGLE_CLIENT_ID starts with:', process.env.GOOGLE_CLIENT_ID.substring(0, 20) + '...');
// }
// console.log('JWT_SECRET exists:', !!process.env.JWT_SECRET);
// console.log('MONGODB_URI exists:', !!process.env.MONGODB_URI);
// if (process.env.MONGODB_URI) {
//   // Hide password for security
//   const safeUri = process.env.MONGODB_URI.replace(/\/\/([^:]+):([^@]+)@/, '//***:***@');
//   console.log('MongoDB URI:', safeUri);
// }

// console.log('==================================');

// const app = express();

// // Middleware
// app.use(cors({
//   origin: 'http://localhost:3000', // Your React app URL
//   credentials: true
// }));
// app.use(express.json());

// // Request logging middleware
// app.use((req, res, next) => {
//   console.log(`${new Date().toISOString()} ${req.method} ${req.url}`);
//   next();
// });

// // MongoDB Connection
// mongoose.connect(process.env.MONGODB_URI, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// })
// .then(() => {
//   console.log('MongoDB Connected Successfully!');
//   console.log('Database:', mongoose.connection.db.databaseName);
// })
// .catch(err => {
//   console.error('MongoDB Connection Error:', err.message);
//   console.log('Check your .env file and MongoDB Atlas connection');
// });

// // Routes
// const authRoutes = require('./routes/auth');
// app.use('/api/auth', authRoutes);

// // Test route
// app.get('/', (req, res) => {
//   res.json({ 
//     message: 'Event Management API Running',
//     endpoints: {
//       signup: 'POST /api/auth/signup',
//       login: 'POST /api/auth/login',
//       google: 'POST /api/auth/google'
//     }
//   });
// });

// // Error handling middleware
// app.use((err, req, res, next) => {
//   console.error('Server error:', err);
//   res.status(500).json({ 
//     message: 'Internal server error',
//     error: process.env.NODE_ENV === 'development' ? err.message : undefined
//   });
// });

// // 404 handler
// app.use((req, res) => {
//   res.status(404).json({ 
//     message: `Route ${req.method} ${req.url} not found` 
//   });
// });

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`Server running on http://localhost:${PORT}`);
//   console.log(`Test: curl http://localhost:${PORT}/`);
//   console.log(`Google OAuth: ${process.env.GOOGLE_CLIENT_ID ? '✅ Configured' : '❌ Not configured'}`);
// });
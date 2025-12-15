const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());

app.use(express.json());

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong" });
});

app.use("/api/newsletter", require("./routes/newsletter"));

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/event-management', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.log('MongoDB connection error:', err));

// Routes
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);


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
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address']
  },
  googleId: {
    type: String,
    unique: true,
    sparse: true // Allows multiple null values
  },
  password: {
    type: String,
    required: true
    // required: function() {
    //   return !this.googleId; // Only required for non-Google users
    // }
  },
  role: {
    type: String,
    enum: ['user', 'organiser'],
    default: 'user'
  },
  // profileImage: {
  //   type: String,
  //   default: ''
  // },
  // isVerified: {
  //   type: Boolean,
  //   default: false
  // },
  lastLogin: {
    type: Date
  },
  activeSessions: [{
    sessionId: String,
    loginAt: Date,
    userAgent: String,
    ipAddress: String
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  resetOtpHash: {
    type: String
  },
  resetOtpExpiry: {
    type: Date
  }

});

// Hash password only if it's modified and exists
userSchema.pre('save', async function(next) {
  if (!this.isModified('password') || !this.password) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method (only for non-Google users)
userSchema.methods.comparePassword = async function(candidatePassword) {
  if (!this.password) {
    throw new Error('This user uses Google login');
  }
  return await bcrypt.compare(candidatePassword, this.password);
};

// Update timestamp on save
userSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('User', userSchema);
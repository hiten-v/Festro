const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const sendEmail = require("../utils/SendEmail");
const otpEmailTemplate = require("../utils/otpEmailTemp");

// const { OAuth2Client } = require('google-auth-library');
// const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

// Signup
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const normalizedEmail = email.toLowerCase().trim();

    if (!isValidEmail(normalizedEmail)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }

    // Check if user exists
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create new user
    const user = new User({
      name: name.trim(),
      email: normalizedEmail,
      password,
      role: role || 'user'
    });

    await user.save();

    // Create token
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    // Remove password from response
    const userResponse = user.toObject();
    delete userResponse.password;

    res.status(201).json({
      message: 'User created successfully',
      token,
      user: userResponse
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Find user
    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    
    // Check password
    try 
    {
      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }
    } 
    catch (err) {
      return res.status(400).json({ message: err.message });
    }


    // Create token
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    // Remove password from response
    const userResponse = user.toObject();
    delete userResponse.password;

    res.json({
      message: 'Login successful',
      token,
      user: userResponse
    });
  } 
  catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});


// Forgot Password - Send OTP
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return res.status(400).json({ message: 'Email not registered' });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpHash = await bcrypt.hash(otp, 10);
    user.resetOtpHash = otpHash;
    user.resetOtpExpiry = Date.now() + 10 * 60 * 1000; // 10 minutes

    await user.save();

    await sendEmail({
      to: normalizedEmail,
      subject: "Password Reset OTP",
      text: `Your OTP is ${otp}. It is valid for 10 minutes.`,
      html: otpEmailTemplate(otp)
    });
    // console.log("OTP for dev only:", otp); 

    res.json({ message: 'OTP sent to email' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Verify OTP
router.post('/verify-otp', async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: 'Email and OTP required' });
    }

    const normalizedEmail = email.toLowerCase().trim();


    const user = await User.findOne({
      email: normalizedEmail,
      resetOtpExpiry: { $gt: Date.now() }
    });

    if (!user || !user.resetOtpHash) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    const isValid = await bcrypt.compare(otp, user.resetOtpHash);

    if (!isValid) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    res.json({ message: 'OTP verified' });


  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Reset Password
router.post('/reset-password', async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const normalizedEmail = email.toLowerCase().trim();

    const user = await User.findOne({
      email: normalizedEmail,
      resetOtpExpiry: { $gt: Date.now() }
    });

    if (!user || !user.resetOtpHash) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    const isValid = await bcrypt.compare(otp, user.resetOtpHash);
    if (!isValid) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    // Update password (bcrypt handled by pre-save)
    user.password = newPassword;
    user.resetOtpHash = undefined;
    user.resetOtpExpiry = undefined;

    await user.save();

    res.json({ message: 'Password reset successful' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});


// router.post('/google', async (req, res) => {
//   try {
//     const { token } = req.body;
    
//     if (!token) {
//       return res.status(400).json({ message: 'Google token is required' });
//     }

//     console.log('Google OAuth attempt with token:', token.substring(0, 20) + '...');
    
//     // Verify Google token
//     const ticket = await client.verifyIdToken({
//       idToken: token,
//       audience: process.env.GOOGLE_CLIENT_ID
//     });
    
//     const payload = ticket.getPayload();
//     const { sub: googleId, email, name, picture } = payload;

//     console.log('Google OAuth successful for:', email);

//     // Check if user exists
//     let user = await User.findOne({ 
//       $or: [
//         { email: email.toLowerCase() },
//         { googleId }
//       ] 
//     });

//     if (!user) {
//       // Create new user for Google
//       user = new User({
//         name,
//         email: email.toLowerCase(),
//         googleId,
//         profileImage: picture,
//         isVerified: true,
//         role: 'user'
//         // No password needed for Google users
//       });
//       await user.save();
//       console.log('New Google user created:', email);
//     } else {
//       // Update existing user
//       if (!user.googleId) {
//         user.googleId = googleId;
//       }
//       if (!user.profileImage && picture) {
//         user.profileImage = picture;
//       }
//       user.isVerified = true;
//       await user.save();
//       console.log('Existing user logged in via Google:', email);
//     }

//     // Create JWT token
//     const jwtToken = jwt.sign(
//       { userId: user._id, role: user.role },
//       process.env.JWT_SECRET,
//       { expiresIn: '7d' }
//     );

//     // Prepare response
//     const userResponse = {
//       _id: user._id,
//       name: user.name,
//       email: user.email,
//       role: user.role,
//       profileImage: user.profileImage,
//       googleId: user.googleId,
//       isVerified: user.isVerified
//     };

//     res.json({
//       message: 'Google Sign-In successful',
//       token: jwtToken,
//       user: userResponse
//     });

//   } catch (error) {
//     console.error('Google OAuth error:', error);
    
//     if (error.message.includes('Token used too late')) {
//       return res.status(400).json({ message: 'Google token expired' });
//     }
    
//     res.status(400).json({ 
//       message: 'Google authentication failed',
//       error: error.message 
//     });
//   }
// });



module.exports = router;
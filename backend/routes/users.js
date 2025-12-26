// routes/users.js - Session-only version
const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const Favorite = require('../models/Favorite');
const Review = require('../models/Review');
const Report = require('../models/Report');

// Session auth middleware
const requireAuth = (req, res, next) => {
  if (req.session && req.session.userId) {
    next();
  } else {
    res.status(401).json({ error: 'Please authenticate.' });
  }
};



// Get user's favorites
router.get('/favorites', requireAuth, async (req, res) => {
  try {
    const favorites = await Favorite.find({ user: req.session.userId })
      .populate('event')
      .sort('-addedAt');
    
    // Return just the events
    const events = favorites.map(fav => fav.event).filter(event => event);
    res.json(events);
  } catch (err) {
    console.error("Get favorites error:", err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Toggle favorite
router.post('/favorites/:eventId', requireAuth, async (req, res) => {
  try {
    const eventId = req.params.eventId;
    const userId = req.session.userId;

    const existing = await Favorite.findOne({
      user: userId,
      event: eventId
    });

    if (existing) {
      await Favorite.findByIdAndDelete(existing._id);
      res.json({ 
        message: 'Removed from favorites', 
        isFavorite: false 
      });
    } else {
      const favorite = new Favorite({
        user: userId,
        event: eventId
      });
      await favorite.save();
      res.json({ 
        message: 'Added to favorites', 
        isFavorite: true 
      });
    }
  } catch (err) {
    console.error("Toggle favorite error:", err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// =============== DASHBOARD DATA ROUTES ===============

// Dashboard endpoint
router.get('/dashboard', requireAuth, async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const userId = req.session.userId;
    
    // Get user bookings
    const bookings = await Booking.find({ 
      user: userId,
      status: 'confirmed'
    }).sort('-bookingDate');

    // Split bookings
    const upcomingBookings = bookings.filter(b => 
      b.eventInfo?.date && b.eventInfo.date >= today
    ).slice(0, 5);
    
    const pastBookings = bookings.filter(b => 
      b.eventInfo?.date && b.eventInfo.date < today
    ).slice(0, 5);

    // Get favorites
    const favorites = await Favorite.find({ user: userId })
      .populate('event')
      .sort('-addedAt')
      .limit(4);
    
    const favoriteEvents = favorites.map(f => f.event).filter(e => e);

    res.json({
      upcomingBookings,
      pastBookings,
      favoriteEvents
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Upcoming events
router.get('/upcoming-bookings', requireAuth, async (req, res) => {
  try {
    const userId = req.session.userId;
    const today = new Date().toISOString().split('T')[0];
    
    // Get upcoming bookings (events with date >= today)
    const upcomingBookings = await Booking.find({
      user: userId,
      status: 'confirmed',
      'eventInfo.date': { $gte: today }
    })
    .sort({ 'eventInfo.date': 1 }) // Sort by date ascending
    .limit(10); // Limit to 10 upcoming events
    
    res.json(upcomingBookings);
  } catch (error) {
    console.error("Get upcoming bookings error:", error);
    res.status(500).json({ message: 'Server error' });
  }
});

// =============== REVIEW & REPORT ROUTES ===============

// Submit review
router.post('/events/:eventId/review', requireAuth, async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const { eventId } = req.params;
    const userId = req.session.userId;

    // Check if user booked the event
    const booking = await Booking.findOne({
      user: userId,
      event: eventId,
      status: 'confirmed'
    });

    if (!booking) {
      return res.status(400).json({ message: 'You must book the event first' });
    }

    // Check if already reviewed
    const existingReview = await Review.findOne({
      user: userId,
      event: eventId,
      booking: booking._id
    });

    if (existingReview) {
      return res.status(400).json({ message: 'Already reviewed this event' });
    }

    const review = new Review({
      user: userId,
      event: eventId,
      booking: booking._id,
      rating,
      comment
    });

    await review.save();
    
    // Update booking with rating
    booking.rating = {
      stars: rating,
      feedback: comment,
      ratedAt: new Date()
    };
    await booking.save();
    
    res.json({ message: 'Review submitted successfully', review });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Report event
router.post('/events/:eventId/report', requireAuth, async (req, res) => {
  try {
    const { reason, description } = req.body;
    const { eventId } = req.params;
    const userId = req.session.userId;

    const report = new Report({
      user: userId,
      event: eventId,
      reason,
      description
    });

    await report.save();
    res.json({ message: 'Report submitted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user stats
router.get('/stats', requireAuth, async (req, res) => {
  try {
    const userId = req.session.userId;
    const today = new Date().toISOString().split('T')[0];
    
    const totalBookings = await Booking.countDocuments({ user: userId });
    const upcomingBookings = await Booking.countDocuments({ 
      user: userId,
      status: 'confirmed',
      'eventInfo.date': { $gte: today }
    });
    const favoriteCount = await Favorite.countDocuments({ user: userId });
    
    res.json({
      totalBookings,
      upcomingBookings,
      favoriteCount
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
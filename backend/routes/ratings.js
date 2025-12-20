// routes/ratings.js - SESSION-ONLY VERSION
const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const Booking = require('../models/Booking');

// Session auth middleware
const requireAuth = (req, res, next) => {
  if (req.session && req.session.userId) {
    next();
  } else {
    res.status(401).json({ error: 'Please authenticate.' });
  }
};

// Submit rating
router.post('/', requireAuth, async (req, res) => {
  try {
    const { eventId, bookingId, rating, feedback } = req.body;
    const userId = req.session.userId;

    // Verify the booking belongs to the user
    const booking = await Booking.findOne({
      _id: bookingId,
      user: userId,
      event: eventId
    });

    if (!booking) {
      return res.status(400).json({ message: 'Invalid booking' });
    }

    // Check if already reviewed
    const existingReview = await Review.findOne({
      user: userId,
      event: eventId,
      booking: bookingId
    });

    if (existingReview) {
      return res.status(400).json({ message: 'Already reviewed this event' });
    }

    // Create review
    const review = new Review({
      user: userId,
      event: eventId,
      booking: bookingId,
      rating,
      comment: feedback
    });

    await review.save();
    
    // Update booking rating
    await Booking.findByIdAndUpdate(bookingId, {
      'rating.stars': rating,
      'rating.feedback': feedback,
      'rating.ratedAt': new Date()
    });

    res.json({ message: 'Rating submitted successfully', review });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user's reviews
router.get('/my-reviews', requireAuth, async (req, res) => {
  try {
    const reviews = await Review.find({ user: req.session.userId })
      .populate('event')
      .sort('-createdAt');
    
    res.json(reviews);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
const express = require('express');
const router = express.Router();
const Review = require('../models/Review');


// routes/review.js
router.get('/all-reviews', async (req, res) => {
  try {
    const reviews = await Review.find({})
      .populate('user', 'name profileImage')  
      .populate('event', 'title date location')  
      .populate('booking')  
      .sort('-createdAt')
      .limit(9);  

    // Check if no reviews
    if (reviews.length === 0) {
      return res.status(200).json({
        success: true,
        count: 0,
        reviews: [],
        message: 'No reviews found'
      });
    }

    res.json({
      success: true,
      count: reviews.length,
      reviews: reviews
    });
    
  } 
  catch (error) {
    console.error(error);
    res.status(500).json({ 
      success: false,
      message: 'Server error' 
    });
  }
});

module.exports=router;
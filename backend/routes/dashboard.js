// routes/dashboard.js - SESSION-ONLY VERSION
const express = require('express');
const router = express.Router();
const Event = require('../models/Event');
const Booking = require('../models/Booking');
const User = require('../models/User');

// Session auth middleware for organizer
const requireOrganizerAuth = (req, res, next) => {
  if (req.session && req.session.userId) {
    // Check if user is organizer
    User.findById(req.session.userId)
      .then(user => {
        if (user && user.role === 'organiser') {
          req.userId = req.session.userId;
          next();
        } else {
          res.status(403).json({ error: 'Access denied. Organizer role required.' });
        }
      })
      .catch(err => {
        res.status(500).json({ error: 'Server error' });
      });
  } else {
    res.status(401).json({ error: 'Please authenticate.' });
  }
};

// GET /api/dashboard/stats - Organizer dashboard
router.get('/stats', requireOrganizerAuth, async (req, res) => {
  try {
    const userId = req.userId;
    
    // Get organizer's events
    const myEvents = await Event.find({ organizer: userId });
    const eventIds = myEvents.map(e => e._id);
    
    if (eventIds.length === 0) {
      // Return empty data if no events created yet
      return res.json({
        stats: {
          totalEvents: 0,
          totalTicketsSold: 0,
          totalRevenue: 0,
          revenueToday: 0,
          avgTicketPrice: 0,
          topEventName: 'No events yet'
        },
        recentSales: [],
        categoryData: [],
        dailySales: [],
        monthlySales: []
      });
    }

    // Fetch all bookings for organizer's events
    // const allBookings = await Booking.find({ event: { $in: eventIds } }).populate('event');
    const allBookings = await Booking.find({ 
      event: { $in: eventIds },
      status: { $ne: 'cancelled' } // EXCLUDE CANCELLED BOOKINGS
    }).populate('event');


    let totalRevenue = 0;
    let totalTicketsSold = 0;
    let revenueToday = 0;
    const today = new Date().toISOString().split('T')[0];

    const categoryStats = {};
    const eventRevenue = {};

    allBookings.forEach(booking => {
      // Basic Aggregates
      totalRevenue += booking.totalAmount;
      totalTicketsSold += booking.tickets;

      // Revenue Today
      if (booking.bookingDate) {
        const bDate = new Date(booking.createdAt || booking.bookingDate).toISOString().split('T')[0];
        if (bDate === today) {
          revenueToday += booking.totalAmount;
        }
      }

      // Category Stats
      if (booking.event && booking.event.category) {
        const cat = booking.event.category;
        categoryStats[cat] = (categoryStats[cat] || 0) + booking.totalAmount;
      }

      // Top Event Stats
      if (booking.event) {
        const title = booking.event.title;
        eventRevenue[title] = (eventRevenue[title] || 0) + booking.totalAmount;
      }
    });

    const totalEvents = myEvents.length;
    const avgTicketPrice = totalTicketsSold > 0 ? Math.round(totalRevenue / totalTicketsSold) : 0;

    // Top Event
    let topEventName = "No events";
    let maxRev = -1;
    Object.entries(eventRevenue).forEach(([name, rev]) => {
      if (rev > maxRev) {
        maxRev = rev;
        topEventName = name;
      }
    });

    // Recent Sales
    // const recentSales = await Booking.find({ event: { $in: eventIds } })
    //   .sort({ bookingDate: -1 })
    //   .limit(5)
    //   .populate('user', 'name email')
    //   .populate('event', 'title');

    const recentSales = await Booking.find({ 
      event: { $in: eventIds },
      status: { $ne: 'cancelled' } // EXCLUDE CANCELLED FROM RECENT SALES TOO
    })
      .sort({ bookingDate: -1 })
      .limit(5)
      .populate('user', 'name email')
      .populate('event', 'title');

    // Category Data Array
    const categoryData = Object.keys(categoryStats).map(key => ({
      name: key,
      value: categoryStats[key]
    })).sort((a, b) => b.value - a.value);

    // Daily Sales (last 7 days)
    const dailySales = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });

      let dayRevenue = 0;
      let dayTickets = 0;
      allBookings.forEach(b => {
        const bDate = new Date(b.createdAt || b.bookingDate).toISOString().split('T')[0];
        if (bDate === dateStr) {
          dayRevenue += b.totalAmount;
          dayTickets += b.tickets;
        }
      });
      dailySales.push({ day: dayName, date: dateStr, revenue: dayRevenue, tickets: dayTickets });
    }

    // Monthly Sales (last 6 months)
    const monthlySales = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const monthStr = d.toLocaleDateString('en-US', { month: 'short' });
      const yearMonth = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;

      let monthRevenue = 0;
      let monthTickets = 0;
      allBookings.forEach(b => {
        const bDate = new Date(b.createdAt || b.bookingDate);
        const bYearMonth = `${bDate.getFullYear()}-${String(bDate.getMonth() + 1).padStart(2, '0')}`;
        if (bYearMonth === yearMonth) {
          monthRevenue += b.totalAmount;
          monthTickets += b.tickets;
        }
      });
      monthlySales.push({ month: monthStr, yearMonth, revenue: monthRevenue, tickets: monthTickets });
    }

    res.json({
      stats: {
        totalEvents,
        totalTicketsSold,
        totalRevenue: parseFloat(totalRevenue.toFixed(2)),
        revenueToday: parseFloat(revenueToday.toFixed(2)),
        avgTicketPrice: parseFloat(avgTicketPrice.toFixed(2)),
        topEventName
      },
      recentSales,
      categoryData,
      dailySales,
      monthlySales
    });

  } catch (err) {
    console.error("Dashboard Stats Error:", err);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/dashboard/events - Get organizer's events
router.get('/events', requireOrganizerAuth, async (req, res) => {
  try {
    const events = await Event.find({ organizer: req.userId })
      .sort({ createdAt: -1 });
    
    res.json(events);
  } catch (err) {
    console.error("Organizer events error:", err);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/dashboard/bookings - Get organizer's bookings
router.get('/bookings', requireOrganizerAuth, async (req, res) => {
  try {
    // Get organizer's events first
    const events = await Event.find({ organizer: req.userId });
    const eventIds = events.map(e => e._id);
    
    if (eventIds.length === 0) {
      return res.json([]);
    }
    
    const bookings = await Booking.find({ event: { $in: eventIds } })
      .populate('user', 'name email')
      .populate('event', 'title')
      .sort({ bookingDate: -1 });
    
    res.json(bookings);
  } catch (err) {
    console.error("Organizer bookings error:", err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
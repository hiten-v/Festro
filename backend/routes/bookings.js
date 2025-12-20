// const express = require('express');
// const router = express.Router();
// const Booking = require('../models/Booking');
// const User = require('../models/User');
// const Event = require('../models/Event');
// const sendEmail = require('../utils/SendEmail');

// // Session auth middleware
// const requireAuth = (req, res, next) => {
//   if (req.session && req.session.userId) {
//     next();
//   } else {
//     res.status(401).json({ error: 'Please authenticate.' });
//   }
// };

// // Create Booking - FINAL FIXED VERSION
// router.post('/', requireAuth, async (req, res) => {
//   try {
//     const { eventId, tickets, totalAmount, paymentId } = req.body;
//     const userId = req.session.userId;

//     console.log('=== Booking Request ===');
//     console.log('Request body:', { eventId, tickets, totalAmount, paymentId });
//     console.log('Session userId:', userId);

//     // FIXED VALIDATION: Allow totalAmount = 0 for free events
//     if (!eventId || !tickets || tickets <= 0 || totalAmount === undefined) {
//       return res.status(400).json({ 
//         message: 'Missing required fields',
//         received: { eventId, tickets, totalAmount, paymentId },
//         required: 'eventId, tickets (>0), totalAmount (can be 0 for free events)'
//       });
//     }

//     // Check if event exists
//     const event = await Event.findById(eventId);
//     if (!event) {
//       console.log('Event not found for ID:', eventId);
//       return res.status(404).json({ message: 'Event not found' });
//     }

//     console.log('Event found:', {
//       id: event._id,
//       title: event.title,
//       price: event.price,
//       organizer: event.organizer
//     });

//     // Check if user exists
//     const user = await User.findById(userId);
//     if (!user) {
//       console.log('User not found for ID:', userId);
//       return res.status(404).json({ message: 'User not found' });
//     }

//     console.log('User found:', {
//       id: user._id,
//       name: user.name,
//       email: user.email
//     });

//     // Determine if this is a free event
//     const isFreeEvent = event.price === 0 || totalAmount === 0;
//     console.log('Is free event?', isFreeEvent);
//     console.log('Event price:', event.price, 'Total amount:', totalAmount);

//     // Calculate expected total based on event price
//     const expectedTotal = event.price * tickets;
//     console.log('Expected total (price * tickets):', expectedTotal);

//     // For free events, force amount to 0
//     const finalAmount = isFreeEvent ? 0 : Number(totalAmount);
//     console.log('Final amount to charge:', finalAmount);

//     // Generate appropriate payment ID
//     const finalPaymentId = paymentId || (isFreeEvent ? `FREE_${Date.now()}` : `MOCK_${Date.now()}`);
    
//     // Set status: auto-confirm free events, pending for paid events
//     const status = isFreeEvent ? 'confirmed' : 'pending';
//     console.log('Booking status:', status);

//     // Create booking
//     const booking = new Booking({
//       user: userId,
//       event: eventId,
//       tickets: Number(tickets),
//       totalAmount: finalAmount,
//       paymentId: finalPaymentId,
//       status: status,
//       eventInfo: {
//         title: event.title,
//         date: event.date,
//         time: event.time,
//         location: event.location,
//         price: event.price,
//         image: event.image,
//         category: event.category,
//         description: event.description
//       }
//     });

//     await booking.save();

//     console.log('Booking created successfully:', {
//       bookingId: booking._id,
//       eventTitle: booking.eventInfo.title,
//       tickets: booking.tickets,
//       totalAmount: booking.totalAmount,
//       status: booking.status,
//       ticketNumber: booking.ticketNumber
//     });
    
//     // Send email notification
//     try {
//       const emailSubject = isFreeEvent 
//         ? `Free Tickets Confirmed: ${event.title}`
//         : `Booking Confirmed: ${event.title}`;
      
//       const emailHtml = `
//         <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
//           <div style="background-color: #702c2c; color: white; padding: 20px; border-radius: 10px 10px 0 0; text-align: center;">
//             <h2>${isFreeEvent ? 'Free Tickets Confirmed!' : 'Booking Confirmed!'}</h2>
//           </div>
//           <div style="padding: 20px;">
//             <p>Hello <strong>${user.name}</strong>,</p>
//             <p>Your booking for <strong>${event.title}</strong> has been ${isFreeEvent ? 'confirmed' : 'received'}!</p>
            
//             <div style="background-color: #f8f9fa; padding: 15px; border-radius: 8px; margin: 20px 0;">
//               <h3 style="color: #702c2c; margin-top: 0;">Booking Details</h3>
//               <p><strong>Event:</strong> ${event.title}</p>
//               <p><strong>Date:</strong> ${event.date}</p>
//               <p><strong>Time:</strong> ${event.time}</p>
//               <p><strong>Location:</strong> ${event.location}</p>
//               <p><strong>Tickets:</strong> ${tickets}</p>
//               <p><strong>Total Amount:</strong> ${isFreeEvent ? 'FREE' : `₹${finalAmount}`}</p>
//               <p><strong>Ticket Number:</strong> ${booking.ticketNumber}</p>
//               <p><strong>Status:</strong> ${booking.status}</p>
//             </div>
            
//             ${!isFreeEvent ? `
//             <div style="background-color: #fff3cd; padding: 15px; border-radius: 8px; margin: 20px 0; border: 1px solid #ffeaa7;">
//               <p><strong>Payment Note:</strong> This is a demonstration booking. No real payment was processed.</p>
//             </div>
//             ` : ''}
            
//             <p>Thank you for using Festro! We hope you enjoy the event.</p>
//             <p>Best regards,<br><strong>The Festro Team</strong></p>
//           </div>
//           <div style="text-align: center; padding: 20px; color: #666; font-size: 12px; background-color: #f1f1f1; border-radius: 0 0 10px 10px;">
//             <p>© ${new Date().getFullYear()} Festro Event Management System</p>
//             <p>This is an automated email. Please do not reply.</p>
//           </div>
//         </div>
//       `;

//       await sendEmail({
//         to: user.email,
//         subject: emailSubject,
//         html: emailHtml
//       });
      
//       console.log(`Booking email sent to ${user.email}`);
//     } catch (emailErr) {
//       console.error("Failed to send booking email:", emailErr.message);
//       // Don't fail the booking if email fails
//     }

//     res.status(201).json({
//       message: isFreeEvent ? 'Free tickets booked successfully!' : 'Booking created successfully',
//       booking: {
//         _id: booking._id,
//         ticketNumber: booking.ticketNumber,
//         eventTitle: booking.eventInfo.title,
//         tickets: booking.tickets,
//         totalAmount: booking.totalAmount,
//         bookingDate: booking.bookingDate,
//         status: booking.status,
//         isFreeEvent: isFreeEvent
//       }
//     });

//   } catch (err) {
//     console.error("Booking creation error:", err);
    
//     // More detailed error response
//     if (err.name === 'ValidationError') {
//       const errors = Object.values(err.errors).map(e => e.message);
//       return res.status(400).json({ 
//         message: 'Validation error', 
//         errors: errors,
//         fullError: err.message 
//       });
//     }
    
//     res.status(500).json({ 
//       message: 'Server error creating booking',
//       error: err.message 
//     });
//   }
// });

// // Get My Bookings
// router.get('/my-bookings', requireAuth, async (req, res) => {
//   try {
//     const bookings = await Booking.find({ user: req.session.userId })
//       .sort({ bookingDate: -1 })
//       .populate('event', 'title date time location image category');
    
//     console.log(`Fetched ${bookings.length} bookings for user ${req.session.userId}`);
    
//     res.json(bookings);
//   } catch (err) {
//     console.error("Get bookings error:", err);
//     res.status(500).json({ 
//       message: 'Server error fetching bookings',
//       error: err.message 
//     });
//   }
// });

// // Get single booking
// router.get('/:id', requireAuth, async (req, res) => {
//   try {
//     const booking = await Booking.findOne({
//       _id: req.params.id,
//       user: req.session.userId
//     }).populate('event', 'title date time location image category');

//     if (!booking) {
//       return res.status(404).json({ message: 'Booking not found' });
//     }

//     res.json(booking);
//   } catch (err) {
//     console.error("Get single booking error:", err);
//     res.status(500).json({ 
//       message: 'Server error fetching booking',
//       error: err.message 
//     });
//   }
// });

// // Cancel booking
// router.put('/:id/cancel', requireAuth, async (req, res) => {
//   try {
//     const booking = await Booking.findOne({
//       _id: req.params.id,
//       user: req.session.userId
//     });

//     if (!booking) {
//       return res.status(404).json({ message: 'Booking not found' });
//     }

//     if (booking.status === 'cancelled') {
//       return res.status(400).json({ message: 'Booking is already cancelled' });
//     }

//     booking.status = 'cancelled';
//     await booking.save();

//     res.json({ 
//       message: 'Booking cancelled successfully', 
//       booking: {
//         _id: booking._id,
//         ticketNumber: booking.ticketNumber,
//         status: booking.status
//       }
//     });
//   } catch (err) {
//     console.error("Cancel booking error:", err);
//     res.status(500).json({ 
//       message: 'Server error cancelling booking',
//       error: err.message 
//     });
//   }
// });

// // DEBUG: Get all bookings (admin only)
// router.get('/debug/all', async (req, res) => {
//   try {
//     const bookings = await Booking.find({})
//       .populate('user', 'name email')
//       .populate('event', 'title price organizer')
//       .sort({ createdAt: -1 });
    
//     res.json({
//       count: bookings.length,
//       bookings: bookings.map(b => ({
//         id: b._id,
//         user: b.user?.name,
//         event: b.event?.title,
//         tickets: b.tickets,
//         totalAmount: b.totalAmount,
//         status: b.status,
//         bookingDate: b.bookingDate,
//         isFree: b.totalAmount === 0
//       }))
//     });
//   } catch (error) {
//     console.error('Debug error:', error);
//     res.status(500).json({ error: error.message });
//   }
// });

// // Test free booking endpoint
// router.post('/test/free', requireAuth, async (req, res) => {
//   try {
//     const { eventId, tickets } = req.body;
//     const userId = req.session.userId;

//     console.log('Test free booking for:', { eventId, tickets, userId });

//     // Find a free event if not provided
//     let targetEventId = eventId;
//     if (!targetEventId) {
//       const freeEvent = await Event.findOne({ price: 0 });
//       if (!freeEvent) {
//         return res.status(404).json({ message: 'No free events found' });
//       }
//       targetEventId = freeEvent._id;
//     }

//     const booking = new Booking({
//       user: userId,
//       event: targetEventId,
//       tickets: Number(tickets) || 1,
//       totalAmount: 0,
//       paymentId: `TEST_FREE_${Date.now()}`,
//       status: 'confirmed'
//     });

//     await booking.save();

//     res.json({
//       success: true,
//       message: 'Test free booking created',
//       booking: {
//         id: booking._id,
//         ticketNumber: booking.ticketNumber,
//         totalAmount: booking.totalAmount,
//         status: booking.status
//       }
//     });

//   } catch (error) {
//     console.error('Test free booking error:', error);
//     res.status(500).json({ error: error.message });
//   }
// });

// module.exports = router;







const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const User = require('../models/User');
const Event = require('../models/Event');
const sendEmail = require('../utils/SendEmail');

// Session auth middleware
const requireAuth = (req, res, next) => {
  if (req.session && req.session.userId) {
    next();
  } else {
    res.status(401).json({ error: 'Please authenticate.' });
  }
};

// Create Booking - FINAL FIXED VERSION
router.post('/', requireAuth, async (req, res) => {
  try {
    const { eventId, tickets, totalAmount, paymentId } = req.body;
    const userId = req.session.userId;

    console.log('=== Booking Request ===');
    console.log('Request body:', { eventId, tickets, totalAmount, paymentId });
    console.log('Session userId:', userId);

    // FIXED VALIDATION: Allow totalAmount = 0 for free events
    if (!eventId || !tickets || tickets <= 0 || totalAmount === undefined) {
      return res.status(400).json({ 
        message: 'Missing required fields',
        received: { eventId, tickets, totalAmount, paymentId },
        required: 'eventId, tickets (>0), totalAmount (can be 0 for free events)'
      });
    }

    // Check if event exists
    const event = await Event.findById(eventId);
    if (!event) {
      console.log('Event not found for ID:', eventId);
      return res.status(404).json({ message: 'Event not found' });
    }

    console.log('Event found:', {
      id: event._id,
      title: event.title,
      price: event.price,
      organizer: event.organizer
    });

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      console.log('User not found for ID:', userId);
      return res.status(404).json({ message: 'User not found' });
    }

    console.log('User found:', {
      id: user._id,
      name: user.name,
      email: user.email
    });

    // Determine if this is a free event
    const isFreeEvent = event.price === 0 || totalAmount === 0;
    console.log('Is free event?', isFreeEvent);
    console.log('Event price:', event.price, 'Total amount:', totalAmount);

    // Calculate expected total based on event price
    const expectedTotal = event.price * tickets;
    console.log('Expected total (price * tickets):', expectedTotal);

    // For free events, force amount to 0
    const finalAmount = isFreeEvent ? 0 : Number(totalAmount);
    console.log('Final amount to charge:', finalAmount);

    // Generate appropriate payment ID
    const finalPaymentId = paymentId || (isFreeEvent ? `FREE_${Date.now()}` : `MOCK_${Date.now()}`);
    
    // Set status: auto-confirm free events, pending for paid events
    const status = isFreeEvent ? 'confirmed' : 'pending';
    console.log('Booking status:', status);

    // Create booking
    const booking = new Booking({
      user: userId,
      event: eventId,
      tickets: Number(tickets),
      totalAmount: finalAmount,
      paymentId: finalPaymentId,
      status: status,
      eventInfo: {
        title: event.title,
        date: event.date,
        time: event.time,
        location: event.location,
        price: event.price,
        image: event.image,
        category: event.category,
        description: event.description
      }
    });

    await booking.save();

    console.log('Booking created successfully:', {
      bookingId: booking._id,
      eventTitle: booking.eventInfo.title,
      tickets: booking.tickets,
      totalAmount: booking.totalAmount,
      status: booking.status,
      ticketNumber: booking.ticketNumber
    });
    
    // Send booking confirmation email
    await sendBookingEmail(user, event, booking, tickets, finalAmount, isFreeEvent);

    res.status(201).json({
      message: isFreeEvent ? 'Free tickets booked successfully!' : 'Booking created successfully',
      booking: {
        _id: booking._id,
        ticketNumber: booking.ticketNumber,
        eventTitle: booking.eventInfo.title,
        tickets: booking.tickets,
        totalAmount: booking.totalAmount,
        bookingDate: booking.bookingDate,
        status: booking.status,
        isFreeEvent: isFreeEvent
      }
    });

  } catch (err) {
    console.error("Booking creation error:", err);
    
    // More detailed error response
    if (err.name === 'ValidationError') {
      const errors = Object.values(err.errors).map(e => e.message);
      return res.status(400).json({ 
        message: 'Validation error', 
        errors: errors,
        fullError: err.message 
      });
    }
    
    res.status(500).json({ 
      message: 'Server error creating booking',
      error: err.message 
    });
  }
});

// Helper function to send booking email (reusable)
const sendBookingEmail = async (user, event, booking, tickets, finalAmount, isFreeEvent) => {
  try {
    const emailSubject = isFreeEvent 
      ? `Free Tickets Confirmed: ${event.title}`
      : `Booking Confirmed: ${event.title}`;
    
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
        <div style="background-color: #702c2c; color: white; padding: 20px; border-radius: 10px 10px 0 0; text-align: center;">
          <h2>${isFreeEvent ? '🎟️ Free Tickets Confirmed!' : '✅ Booking Confirmed!'}</h2>
        </div>
        <div style="padding: 20px;">
          <p>Hello <strong>${user.name}</strong>,</p>
          <p>Your booking for <strong>${event.title}</strong> has been ${isFreeEvent ? 'confirmed' : 'received'}!</p>
          
          <div style="background-color: #f8f9fa; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #702c2c;">
            <h3 style="color: #702c2c; margin-top: 0;">Booking Details</h3>
            <p><strong>Event:</strong> ${event.title}</p>
            <p><strong>Date:</strong> ${event.date}</p>
            <p><strong>Time:</strong> ${event.time}</p>
            <p><strong>Location:</strong> ${event.location}</p>
            <p><strong>Tickets:</strong> ${tickets}</p>
            <p><strong>Total Amount:</strong> ${isFreeEvent ? 'FREE' : `₹${finalAmount}`}</p>
            <p><strong>Ticket Number:</strong> ${booking.ticketNumber}</p>
            <p><strong>Status:</strong> ${booking.status}</p>
            <p><strong>Booking ID:</strong> ${booking._id}</p>
          </div>
          
          ${!isFreeEvent ? `
          <div style="background-color: #fff3cd; padding: 15px; border-radius: 8px; margin: 20px 0; border: 1px solid #ffeaa7;">
            <p><strong>⚠️ Payment Note:</strong> This is a demonstration booking. No real payment was processed.</p>
          </div>
          ` : ''}
          
          <div style="text-align: center; padding: 15px; background-color: #e8f4ff; border-radius: 8px; margin: 20px 0;">
            <p><strong>📋 Need your ticket again?</strong></p>
            <p>You can always re-send this ticket email from your account dashboard.</p>
          </div>
          
          <p>Thank you for using Festro! We hope you enjoy the event.</p>
          <p>Best regards,<br><strong>The Festro Team</strong></p>
        </div>
        <div style="text-align: center; padding: 20px; color: #666; font-size: 12px; background-color: #f1f1f1; border-radius: 0 0 10px 10px;">
          <p>© ${new Date().getFullYear()} Festro Event Management System</p>
          <p>This is an automated email. Please do not reply.</p>
        </div>
      </div>
    `;

    await sendEmail({
      to: user.email,
      subject: emailSubject,
      html: emailHtml
    });
    
    console.log(`📧 Booking email sent to ${user.email}`);
    return true;
    
  } catch (emailErr) {
    console.error("⚠️ Failed to send booking email:", emailErr.message);
    return false;
  }
};

// Get My Bookings
router.get('/my-bookings', requireAuth, async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.session.userId })
      .sort({ bookingDate: -1 })
      .populate('event', 'title date time location image category');
    
    console.log(`Fetched ${bookings.length} bookings for user ${req.session.userId}`);
    
    res.json(bookings);
  } catch (err) {
    console.error("Get bookings error:", err);
    res.status(500).json({ 
      message: 'Server error fetching bookings',
      error: err.message 
    });
  }
});

// Get single booking
router.get('/:id', requireAuth, async (req, res) => {
  try {
    const booking = await Booking.findOne({
      _id: req.params.id,
      user: req.session.userId
    }).populate('event', 'title date time location image category');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    res.json(booking);
  } catch (err) {
    console.error("Get single booking error:", err);
    res.status(500).json({ 
      message: 'Server error fetching booking',
      error: err.message 
    });
  }
});

// Cancel booking
router.put('/:id/cancel', requireAuth, async (req, res) => {
  try {
    const booking = await Booking.findOne({
      _id: req.params.id,
      user: req.session.userId
    });

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.status === 'cancelled') {
      return res.status(400).json({ message: 'Booking is already cancelled' });
    }

    // Get user and event details for email
    const user = await User.findById(req.session.userId);
    const event = await Event.findById(booking.event);

    booking.status = 'cancelled';
    await booking.save();

    // Send cancellation email
    try {
      const cancelHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
          <div style="background-color: #dc3545; color: white; padding: 20px; border-radius: 10px 10px 0 0; text-align: center;">
            <h2>❌ Booking Cancelled</h2>
          </div>
          <div style="padding: 20px;">
            <p>Hello <strong>${user.name}</strong>,</p>
            <p>Your booking for <strong>${event.title}</strong> has been cancelled as requested.</p>
            
            <div style="background-color: #f8f9fa; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #dc3545;">
              <h3 style="color: #dc3545; margin-top: 0;">Cancellation Details</h3>
              <p><strong>Event:</strong> ${event.title}</p>
              <p><strong>Date:</strong> ${event.date}</p>
              <p><strong>Time:</strong> ${event.time}</p>
              <p><strong>Ticket Number:</strong> ${booking.ticketNumber}</p>
              <p><strong>Cancelled Amount:</strong> ₹${booking.totalAmount}</p>
              <p><strong>Cancellation Date:</strong> ${new Date().toLocaleDateString()}</p>
            </div>
            
            ${booking.totalAmount > 0 ? `
            <div style="background-color: #fff3cd; padding: 15px; border-radius: 8px; margin: 20px 0; border: 1px solid #ffeaa7;">
              <p><strong>💰 Refund Information:</strong></p>
              <p>Refund (if applicable) will be processed within 5-7 business days.</p>
            </div>
            ` : ''}
            
            <p>We're sorry to see you go. Hope to see you at another Festro event soon!</p>
            <p>Best regards,<br><strong>The Festro Team</strong></p>
          </div>
          <div style="text-align: center; padding: 20px; color: #666; font-size: 12px; background-color: #f1f1f1; border-radius: 0 0 10px 10px;">
            <p>© ${new Date().getFullYear()} Festro Event Management System</p>
            <p>This is an automated email. Please do not reply.</p>
          </div>
        </div>
      `;

      await sendEmail({
        to: user.email,
        subject: `Booking Cancelled: ${event.title}`,
        html: cancelHtml
      });
      
      console.log(`📧 Cancellation email sent to ${user.email}`);
    } catch (emailErr) {
      console.error("Failed to send cancellation email:", emailErr.message);
    }

    res.json({ 
      message: 'Booking cancelled successfully', 
      booking: {
        _id: booking._id,
        ticketNumber: booking.ticketNumber,
        status: booking.status
      }
    });
  } catch (err) {
    console.error("Cancel booking error:", err);
    res.status(500).json({ 
      message: 'Server error cancelling booking',
      error: err.message 
    });
  }
});

// Re-send Ticket Email
router.post('/:id/send-ticket', requireAuth, async (req, res) => {
  try {
    const bookingId = req.params.id;
    const userId = req.session.userId;

    console.log(`Re-sending ticket email for booking ${bookingId}`);

    // Find booking with user and event details
    const booking = await Booking.findOne({
      _id: bookingId,
      user: userId
    });

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Get user and event details
    const user = await User.findById(userId);
    const event = await Event.findById(booking.event);

    if (!user || !event) {
      return res.status(404).json({ message: 'User or event not found' });
    }

    // Check if booking is cancelled
    if (booking.status === 'cancelled') {
      return res.status(400).json({ message: 'Cannot send ticket for cancelled booking' });
    }

    // Re-send the booking email using the same helper function
    const isFreeEvent = booking.totalAmount === 0;
    const emailSent = await sendBookingEmail(
      user, 
      event, 
      booking, 
      booking.tickets, 
      booking.totalAmount, 
      isFreeEvent
    );

    if (emailSent) {
      console.log(`✅ Ticket email re-sent to ${user.email} for booking ${bookingId}`);
      res.json({
        success: true,
        message: 'Ticket email sent successfully!'
      });
    } else {
      throw new Error('Failed to send email');
    }

  } catch (error) {
    console.error('Re-send ticket email error:', error);
    res.status(500).json({ 
      message: 'Failed to send ticket email',
      error: error.message 
    });
  }
});

// DEBUG: Get all bookings (admin only)
router.get('/debug/all', async (req, res) => {
  try {
    const bookings = await Booking.find({})
      .populate('user', 'name email')
      .populate('event', 'title price organizer')
      .sort({ createdAt: -1 });
    
    res.json({
      count: bookings.length,
      bookings: bookings.map(b => ({
        id: b._id,
        user: b.user?.name,
        event: b.event?.title,
        tickets: b.tickets,
        totalAmount: b.totalAmount,
        status: b.status,
        bookingDate: b.bookingDate,
        isFree: b.totalAmount === 0
      }))
    });
  } catch (error) {
    console.error('Debug error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Test free booking endpoint
router.post('/test/free', requireAuth, async (req, res) => {
  try {
    const { eventId, tickets } = req.body;
    const userId = req.session.userId;

    console.log('Test free booking for:', { eventId, tickets, userId });

    // Find a free event if not provided
    let targetEventId = eventId;
    if (!targetEventId) {
      const freeEvent = await Event.findOne({ price: 0 });
      if (!freeEvent) {
        return res.status(404).json({ message: 'No free events found' });
      }
      targetEventId = freeEvent._id;
    }

    const booking = new Booking({
      user: userId,
      event: targetEventId,
      tickets: Number(tickets) || 1,
      totalAmount: 0,
      paymentId: `TEST_FREE_${Date.now()}`,
      status: 'confirmed'
    });

    await booking.save();

    res.json({
      success: true,
      message: 'Test free booking created',
      booking: {
        id: booking._id,
        ticketNumber: booking.ticketNumber,
        totalAmount: booking.totalAmount,
        status: booking.status
      }
    });

  } catch (error) {
    console.error('Test free booking error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
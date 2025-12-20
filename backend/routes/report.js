const express = require('express');
const router = express.Router();
const PDFDocument = require('pdfkit');
const Booking = require('../models/Booking');
const Event = require('../models/Event');
const fs = require('fs');
const path = require('path');


// Fixed PDF Report for your schema
router.get('/simple-report', async (req, res) => {
  try {
    console.log('=== Starting PDF Generation ===');
    const organizerId = req.session.userId;
    console.log('Organizer ID:', organizerId);

    // Get ALL bookings with status = "confirmed"
    const allBookings = await Booking.find({ status: 'confirmed' })
      .populate('user', 'name email')
      .sort({ bookingDate: 1 });

    console.log('Total confirmed bookings:', allBookings.length);

    // We need to get events separately and match them
    const eventIds = [...new Set(allBookings.map(b => b.event))];
    console.log('Unique event IDs:', eventIds.length);
    
    // Get events with their organizers
    const events = await Event.find({ _id: { $in: eventIds } });
    console.log('Events found:', events.length);
    
    // Create event map for quick lookup
    const eventMap = {};
    events.forEach(event => {
      eventMap[event._id.toString()] = event;
    });

    // Filter bookings for this organizer
    const myBookings = allBookings.filter(booking => {
      const event = eventMap[booking.event.toString()];
      return event && event.organizer && event.organizer.toString() === organizerId;
    });

    console.log('My bookings (for this organizer):', myBookings.length);

    // If no bookings found, create empty report
    if (myBookings.length === 0) {
      const doc = new PDFDocument({ margin: 50 });
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename="festro-no-data.pdf"');
      doc.pipe(res);

      doc.fontSize(16)
         .text('Festro Sales Report', { align: 'center' })
         .moveDown(1);
      
      doc.fontSize(12)
         .text('No confirmed bookings found.', { align: 'center' })
         .moveDown(0.5);
      
      doc.fontSize(10)
         .text(`Organizer: ${organizerId.substring(0, 8)}...`, { align: 'center' })
         .text(`Date: ${new Date().toLocaleDateString()}`, { align: 'center' })
         .moveDown(1);
      
      doc.text('Note: Bookings must have status "confirmed" to appear in this report.');
      doc.end();
      return;
    }

    // Process data for report
    const dailyData = {};
    const monthlyData = {};
    const yearlyData = {};

    myBookings.forEach(booking => {
      if (booking.bookingDate) {
        const date = new Date(booking.bookingDate);
        const dayKey = date.toISOString().split('T')[0];
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        const yearKey = date.getFullYear();

        // Daily
        if (!dailyData[dayKey]) {
          dailyData[dayKey] = { revenue: 0, tickets: 0, bookings: 0 };
        }
        dailyData[dayKey].revenue += booking.totalAmount || 0;
        dailyData[dayKey].tickets += booking.tickets || 0;
        dailyData[dayKey].bookings += 1;

        // Monthly
        if (!monthlyData[monthKey]) {
          monthlyData[monthKey] = {
            revenue: 0,
            tickets: 0,
            bookings: 0,
            monthName: date.toLocaleString('default', { month: 'long' }),
            year: date.getFullYear()
          };
        }
        monthlyData[monthKey].revenue += booking.totalAmount || 0;
        monthlyData[monthKey].tickets += booking.tickets || 0;
        monthlyData[monthKey].bookings += 1;

        // Yearly
        if (!yearlyData[yearKey]) {
          yearlyData[yearKey] = { revenue: 0, tickets: 0, bookings: 0 };
        }
        yearlyData[yearKey].revenue += booking.totalAmount || 0;
        yearlyData[yearKey].tickets += booking.tickets || 0;
        yearlyData[yearKey].bookings += 1;
      }
    });

    // Calculate averages
    const dailyAverages = {};
    Object.entries(yearlyData).forEach(([year, data]) => {
      dailyAverages[year] = {
        avgRevenuePerDay: (data.revenue / 365).toFixed(2),
        avgTicketsPerDay: (data.tickets / 365).toFixed(1),
        avgBookingsPerDay: (data.bookings / 365).toFixed(1)
      };
    });

    // Create PDF
    const doc = new PDFDocument({ margin: 50 });
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="festro-report-${Date.now()}.pdf"`);
    doc.pipe(res);


    const logoPath = path.join(__dirname, '../frontend/public/logo.png');
    const hasLogo = fs.existsSync(logoPath);

    if (hasLogo) {
    // Add logo at top left
    doc.image(logoPath, 50, 45, { width: 40, height: 40 });
    
    // Title next to logo
    doc.fontSize(20)
        .fillColor('#702c2c')
        .text('FESTRO', 100, 45)
        .fontSize(14)
        .text('Sales Report', 100, 65);
    } 
    else 
    {
        doc.fontSize(18)
       .fillColor('#702c2c')
       .text('Festro Organiser Sales Report', { align: 'center' })
       .moveDown(0.5);
    }
    
    doc.fontSize(10)
       .fillColor('black')
       .text(`Generated: ${new Date().toLocaleDateString('en-IN')}`, { align: 'center' })
       .text(`Total Confirmed Bookings: ${myBookings.length}`, { align: 'center' })
       .moveDown(1);
    

    // Separator line
    doc.moveTo(50, doc.y)
    .lineTo(550, doc.y)
    .strokeColor('#702c2c')
    .stroke()
    .moveDown(1);
    // Summary
    const totalRevenue = myBookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0);
    const totalTickets = myBookings.reduce((sum, b) => sum + (b.tickets || 0), 0);

    doc.fontSize(14)
       .fillColor('#702c2c')
       .text('SUMMARY', { underline: true })
       .moveDown(0.5);
    
    doc.fontSize(11)
       .fillColor('black')
       .text(`Total Revenue: ₹${totalRevenue.toFixed(2)}`)
       .text(`Total Tickets Sold: ${totalTickets}`)
       .text(`Total Bookings: ${myBookings.length}`)
       .moveDown(1);

    // Yearly Data
    doc.fontSize(14)
       .fillColor('#702c2c')
       .text('YEARLY DATA', { underline: true })
       .moveDown(0.5);

    Object.entries(yearlyData).sort((a, b) => b[0] - a[0]).forEach(([year, data]) => {
      doc.fontSize(10)
         .text(`Year ${year}:`)
         .text(`  Revenue: ₹${data.revenue.toFixed(2)}`, { indent: 20 })
         .text(`  Tickets: ${data.tickets}`, { indent: 20 })
         .text(`  Bookings: ${data.bookings}`, { indent: 20 })
         .moveDown(0.5);
    });

    doc.moveDown(1);

    // Monthly Data
    doc.fontSize(14)
       .fillColor('#702c2c')
       .text('MONTHLY DATA', { underline: true })
       .moveDown(0.5);

    Object.entries(monthlyData).sort((a, b) => b[0].localeCompare(a[0])).forEach(([key, data]) => {
      doc.fontSize(10)
         .text(`${data.monthName} ${data.year}:`)
         .text(`  Revenue: ₹${data.revenue.toFixed(2)}`, { indent: 20 })
         .text(`  Tickets: ${data.tickets}`, { indent: 20 })
         .text(`  Bookings: ${data.bookings}`, { indent: 20 })
         .moveDown(0.5);
    });

    doc.moveDown(1);

    // Daily Data (Last 30 days)
    doc.fontSize(14)
       .fillColor('#702c2c')
       .text('DAILY DATA (Last 30 Days)', { underline: true })
       .moveDown(0.5);

    const sortedDates = Object.keys(dailyData).sort().reverse().slice(0, 30);
    
    if (sortedDates.length === 0) {
      doc.fontSize(10).text('No daily data available').moveDown(0.5);
    } else {
      sortedDates.forEach(date => {
        const data = dailyData[date];
        const formattedDate = new Date(date).toLocaleDateString('en-IN', {
          day: '2-digit',
          month: 'short',
          year: 'numeric'
        });
        
        doc.fontSize(9)
           .text(`${formattedDate}:`)
           .text(`  Revenue: ₹${data.revenue.toFixed(2)}`, { indent: 20 })
           .text(`  Tickets: ${data.tickets}`, { indent: 20 })
           .text(`  Bookings: ${data.bookings}`, { indent: 20 })
           .moveDown(0.3);
      });
    }

    doc.moveDown(1);

    // Averages
    doc.fontSize(14)
       .fillColor('#702c2c')
       .text('DAILY AVERAGES', { underline: true })
       .moveDown(0.5);

    Object.entries(dailyAverages).forEach(([year, averages]) => {
      doc.fontSize(10)
         .text(`Year ${year}:`)
         .text(`  Avg Revenue/Day: ₹${averages.avgRevenuePerDay}`, { indent: 20 })
         .text(`  Avg Tickets/Day: ${averages.avgTicketsPerDay}`, { indent: 20 })
         .text(`  Avg Bookings/Day: ${averages.avgBookingsPerDay}`, { indent: 20 })
         .moveDown(0.5);
    });

    // Recent Bookings
    doc.addPage();
    doc.fontSize(14)
       .fillColor('#702c2c')
       .text('RECENT BOOKINGS', { align: 'center' })
       .moveDown(1);

    myBookings.slice(0, 20).forEach((booking, index) => {
      const event = eventMap[booking.event.toString()];
      const date = new Date(booking.bookingDate);
      
      doc.fontSize(9)
         .text(`${index + 1}. ${date.toLocaleDateString('en-IN')} - ${event?.title || 'Unknown Event'}`)
         .text(`   Customer: ${booking.user?.name || 'Guest'}`)
         .text(`   Tickets: ${booking.tickets} x ₹${event?.price || 0} = ₹${booking.totalAmount}`)
         .text(`   Status: ${booking.status}`)
         .moveDown(0.5);
    });

    // Footer
    doc.fontSize(8)
       .fillColor('#666')
       .text('Generated by Festro Event Management System', { align: 'center' })
       .text(new Date().toLocaleString(), { align: 'center' });

    doc.end();
    
    console.log('=== PDF Generation Completed ===');

  } catch (error) {
    console.error('Report error:', error);
    res.status(500).json({ 
      message: 'Failed to generate report', 
      error: error.message 
    });
  }
});

// Test endpoint to verify data
router.get('/test-fix', async (req, res) => {
  try {
    const organizerId = req.session.userId;
    
    // Get bookings with status = confirmed
    const bookings = await Booking.find({ status: 'confirmed' });
    console.log('Bookings with status "confirmed":', bookings.length);
    
    // Get events for these bookings
    const eventIds = bookings.map(b => b.event);
    const events = await Event.find({ _id: { $in: eventIds } });
    
    // Count events for this organizer
    const myEvents = events.filter(e => e.organizer.toString() === organizerId);
    const myEventIds = myEvents.map(e => e._id.toString());
    
    // Count bookings for my events
    const myBookings = bookings.filter(b => myEventIds.includes(b.event.toString()));
    
    res.json({
      totalBookings: bookings.length,
      totalEvents: events.length,
      myEvents: myEvents.length,
      myBookings: myBookings.length,
      sampleBooking: bookings[0] ? {
        id: bookings[0]._id,
        eventId: bookings[0].event,
        status: bookings[0].status,
        amount: bookings[0].totalAmount,
        tickets: bookings[0].tickets,
        date: bookings[0].bookingDate
      } : null,
      sampleEvent: myEvents[0] ? {
        id: myEvents[0]._id,
        title: myEvents[0].title,
        organizer: myEvents[0].organizer,
        price: myEvents[0].price
      } : null
    });
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
// // routes/events.js
// const express = require('express');
// const router = express.Router();
// const Event = require('../models/Event');

// // Get all events
// router.get('/', async (req, res) => {
//     try {
//         const events = await Event.find().sort('-createdAt');
//         res.json(events);
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Server error' });
//     }
// });

// // Get single event by ID
// router.get('/:id', async (req, res) => {
//     try {
//         const event = await Event.findById(req.params.id);
//         if (!event) {
//             return res.status(404).json({ message: 'Event not found' });
//         }
//         res.json(event);
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Server error' });
//     }
// });

// module.exports = router;



// // routes/events.js - SESSION-ONLY VERSION
// const express = require('express');
// const router = express.Router();
// const Event = require('../models/Event');
// const multer = require('multer');
// const path = require('path');
// const fs = require('fs');

// // Session auth middleware
// const requireAuth = (req, res, next) => {
//   if (req.session && req.session.userId) {
//     next();
//   } else {
//     res.status(401).json({ error: 'Please authenticate.' });
//   }
// };

// // Configure Multer Storage
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     const uploadPath = path.join(__dirname, '../../frontend/public/uploads');
//     // Ensure directory exists
//     if (!fs.existsSync(uploadPath)) {
//       fs.mkdirSync(uploadPath, { recursive: true });
//     }
//     cb(null, uploadPath);
//   },
//   filename: function (req, file, cb) {
//     cb(null, Date.now() + '-' + file.originalname);
//   }
// });

// const upload = multer({ storage: storage });

// // GET all events (public - no auth required)
// router.get('/', async (req, res) => {
//   try {
//     const events = await Event.find().sort({ createdAt: -1 });
//     res.json(events);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

// // GET single event (public - no auth required)
// router.get('/:id', async (req, res) => {
//   try {
//     const event = await Event.findById(req.params.id);
//     if (!event) return res.status(404).json({ message: 'Event not found' });
//     res.json(event);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

// // POST Create Event (Protected - requires session auth)
// router.post('/', requireAuth, upload.single('image'), async (req, res) => {
//   try {
//     const imagePath = req.file ? `/uploads/${req.file.filename}` : '';

//     const event = new Event({
//       title: req.body.title,
//       date: req.body.date,
//       time: req.body.time,
//       location: req.body.location,
//       price: req.body.price,
//       category: req.body.category,
//       description: req.body.description,
//       image: imagePath,
//       organizer: req.session.userId, // Use session userId
//       lat: req.body.lat || 0,
//       lng: req.body.lng || 0
//     });

//     const newEvent = await event.save();
//     res.status(201).json(newEvent);
//   } catch (err) {
//     console.error("Create Event Error:", err);
//     res.status(400).json({ message: err.message });
//   }
// });

// // PUT Update Event (Protected)
// router.put('/:id', requireAuth, upload.single('image'), async (req, res) => {
//   try {
//     const event = await Event.findById(req.params.id);
//     if (!event) return res.status(404).json({ message: 'Event not found' });
    
//     // Check if user is organizer
//     if (event.organizer.toString() !== req.session.userId) {
//       return res.status(403).json({ message: 'Not authorized to update this event' });
//     }

//     // Update fields
//     event.title = req.body.title || event.title;
//     event.date = req.body.date || event.date;
//     event.time = req.body.time || event.time;
//     event.location = req.body.location || event.location;
//     event.price = req.body.price !== undefined ? req.body.price : event.price;
//     event.category = req.body.category || event.category;
//     event.description = req.body.description || event.description;
//     event.lat = req.body.lat || event.lat;
//     event.lng = req.body.lng || event.lng;

//     if (req.file) {
//       event.image = `/uploads/${req.file.filename}`;
//     }

//     const updatedEvent = await event.save();
//     res.json(updatedEvent);
//   } catch (err) {
//     res.status(400).json({ message: err.message });
//   }
// });

// // DELETE Event (Protected)
// router.delete('/:id', requireAuth, async (req, res) => {
//   try {
//     const event = await Event.findById(req.params.id);
//     if (!event) return res.status(404).json({ message: 'Event not found' });
    
//     // Check if user is organizer
//     if (event.organizer.toString() !== req.session.userId) {
//       return res.status(403).json({ message: 'Not authorized to delete this event' });
//     }

//     await event.deleteOne();
//     res.json({ message: 'Event deleted successfully' });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

// // Seed Data (Dev only - public)
// router.post('/seed', async (req, res) => {
//   try {
//     const count = await Event.countDocuments();
//     if (count > 0) return res.json({ message: 'Events already seeded' });

//     const mockEvents = [
//       {
//         title: "Bangalore Tech Summit",
//         date: "2026-02-15",
//         time: "09:00 AM",
//         location: "Bangalore, Karnataka",
//         lat: 12.9716, lng: 77.5946,
//         price: 499,
//         category: "Business",
//         image: "/events/tech.jpg",
//         description: "Come meet the biggest names in tech. It's going to be a huge day for networking."
//       },
//       {
//         title: "Sunburn Festival Goa",
//         date: "2025-12-28",
//         time: "04:00 PM",
//         location: "Vagator, Goa",
//         lat: 15.6019, lng: 73.7430,
//         price: 2500,
//         category: "Music",
//         image: "/events/music.jpg",
//         description: "Asia's biggest electronic dance music festival. Experience the magic properly."
//       },
//       {
//         title: "Jaipur Literature Festival",
//         date: "2026-01-20",
//         time: "10:00 AM",
//         location: "Jaipur, Rajasthan",
//         lat: 26.9124, lng: 75.7873,
//         price: 0,
//         category: "Arts",
//         image: "/events/arts.jpg",
//         description: "The greatest literary show on Earth. A haven for book lovers."
//       },
//       {
//         title: "Mumbai Food Fest",
//         date: "2026-03-10",
//         time: "12:00 PM",
//         location: "Mumbai, Maharashtra",
//         lat: 19.0760, lng: 72.8777,
//         price: 999,
//         category: "Food",
//         image: "/events/food.jpg",
//         description: "Taste the best cuisines from around the city. A paradise for foodies."
//       }
//     ];

//     await Event.insertMany(mockEvents);
//     res.json({ message: 'Seeded successfully', count: mockEvents.length });

//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

// module.exports = router;




const express = require('express');
const router = express.Router();
const Event = require('../models/Event');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Session auth middleware
const requireAuth = (req, res, next) => {
  if (req.session && req.session.userId) {
    next();
  } else {
    res.status(401).json({ error: 'Please authenticate.' });
  }
};

// Configure Multer Storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, '../../frontend/public/uploads');
    // Ensure directory exists
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// GET all events (public - no auth required)
router.get('/', async (req, res) => {
  try {
    const { category, search } = req.query;
    let query = {};
    
    if (category) {
      query.category = category;
    }
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } }
      ];
    }
    
    const events = await Event.find(query).sort({ createdAt: -1 });
    res.json(events);
  } catch (err) {
    console.error("Get events error:", err);
    res.status(500).json({ message: 'Server error fetching events' });
  }
});

// GET single event (public - no auth required)
router.get('/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });
    res.json(event);
  } catch (err) {
    console.error("Get event error:", err);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Event not found' });
    }
    res.status(500).json({ message: 'Server error fetching event' });
  }
});

// POST Create Event (Protected - requires session auth)
router.post('/', requireAuth, upload.single('image'), async (req, res) => {
  try {
    const { title, date, time, location, price, category, description, lat, lng } = req.body;
    
    // Validate required fields
    if (!title || !date || !time || !location || !price || !category || !description) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    
    // If no image uploaded but image field exists in request (from form)
    let imagePath = '';
    if (req.file) {
      imagePath = `/uploads/${req.file.filename}`;
    } else if (req.body.image) {
      imagePath = req.body.image;
    } else {
      // Default image based on category
      const defaultImages = {
        'Music': '/events/music.jpg',
        'Business': '/events/tech.jpg',
        'Arts': '/events/arts.jpg',
        'Food': '/events/food.jpg',
        'Technology': '/events/tech.jpg',
        'Sports': '/events/sports.jpg',
        'Education': '/events/education.jpg'
      };
      imagePath = defaultImages[category] || '/events/default.jpg';
    }

    const event = new Event({
      title,
      date,
      time,
      location,
      price: Number(price),
      category,
      description,
      image: imagePath,
      organizer: req.session.userId,
      lat: lat || 0,
      lng: lng || 0
    });

    const newEvent = await event.save();
    res.status(201).json({
      message: 'Event created successfully',
      event: newEvent
    });
  } catch (err) {
    console.error("Create Event Error:", err);
    if (err.name === 'ValidationError') {
      return res.status(400).json({ message: err.message });
    }
    res.status(500).json({ message: 'Server error creating event' });
  }
});

// PUT Update Event (Protected)
router.put('/:id', requireAuth, upload.single('image'), async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });
    
    // Check if user is organizer
    if (event.organizer.toString() !== req.session.userId) {
      return res.status(403).json({ message: 'Not authorized to update this event' });
    }

    // Update fields
    event.title = req.body.title || event.title;
    event.date = req.body.date || event.date;
    event.time = req.body.time || event.time;
    event.location = req.body.location || event.location;
    event.price = req.body.price !== undefined ? Number(req.body.price) : event.price;
    event.category = req.body.category || event.category;
    event.description = req.body.description || event.description;
    event.lat = req.body.lat || event.lat;
    event.lng = req.body.lng || event.lng;

    if (req.file) {
      event.image = `/uploads/${req.file.filename}`;
    }

    const updatedEvent = await event.save();
    res.json({
      message: 'Event updated successfully',
      event: updatedEvent
    });
  } catch (err) {
    console.error("Update event error:", err);
    if (err.name === 'ValidationError') {
      return res.status(400).json({ message: err.message });
    }
    res.status(500).json({ message: 'Server error updating event' });
  }
});

// DELETE Event (Protected)
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });
    
    // Check if user is organizer
    if (event.organizer.toString() !== req.session.userId) {
      return res.status(403).json({ message: 'Not authorized to delete this event' });
    }

    await event.deleteOne();
    res.json({ message: 'Event deleted successfully' });
  } catch (err) {
    console.error("Delete event error:", err);
    res.status(500).json({ message: 'Server error deleting event' });
  }
});

// Get events by organizer
router.get('/organizer/my-events', requireAuth, async (req, res) => {
  try {
    const events = await Event.find({ organizer: req.session.userId })
      .sort({ createdAt: -1 });
    res.json(events);
  } catch (err) {
    console.error("Get organizer events error:", err);
    res.status(500).json({ message: 'Server error fetching organizer events' });
  }
});

// Seed Data (Dev only - public)
router.post('/seed', async (req, res) => {
  try {
    const count = await Event.countDocuments();
    if (count > 0) return res.json({ message: 'Events already seeded' });

    const mockEvents = [
      {
        title: "Bangalore Tech Summit",
        date: "2026-02-15",
        time: "09:00 AM",
        location: "Bangalore, Karnataka",
        lat: 12.9716, lng: 77.5946,
        price: 499,
        category: "Business",
        image: "/events/tech.jpg",
        description: "Come meet the biggest names in tech. It's going to be a huge day for networking."
      },
      {
        title: "Sunburn Festival Goa",
        date: "2025-12-28",
        time: "04:00 PM",
        location: "Vagator, Goa",
        lat: 15.6019, lng: 73.7430,
        price: 2500,
        category: "Music",
        image: "/events/music.jpg",
        description: "Asia's biggest electronic dance music festival. Experience the magic properly."
      },
      {
        title: "Jaipur Literature Festival",
        date: "2026-01-20",
        time: "10:00 AM",
        location: "Jaipur, Rajasthan",
        lat: 26.9124, lng: 75.7873,
        price: 0,
        category: "Arts",
        image: "/events/arts.jpg",
        description: "The greatest literary show on Earth. A haven for book lovers."
      },
      {
        title: "Mumbai Food Fest",
        date: "2026-03-10",
        time: "12:00 PM",
        location: "Mumbai, Maharashtra",
        lat: 19.0760, lng: 72.8777,
        price: 999,
        category: "Food",
        image: "/events/food.jpg",
        description: "Taste the best cuisines from around the city. A paradise for foodies."
      }
    ];

    await Event.insertMany(mockEvents);
    res.json({ 
      message: 'Seeded successfully', 
      count: mockEvents.length,
      events: mockEvents 
    });

  } catch (err) {
    console.error("Seed events error:", err);
    res.status(500).json({ message: 'Server error seeding events' });
  }
});

module.exports = router;
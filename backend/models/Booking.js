// const mongoose = require('mongoose');

// const bookingSchema = new mongoose.Schema({
//     user: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'User',
//         required: true
//     },
//     event: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'Event',
//         required: true
//     },
//     bookingDate: {
//         type: Date,
//         default: Date.now
//     },
//     status: {
//         type: String,
//         enum: ['confirmed', 'cancelled', 'pending'],
//         default: 'confirmed'
//     },
//     tickets: {
//         type: Number,
//         default: 1
//     },
//     totalAmount: {
//         type: Number,
//         required: true
//     },
//     paymentId: {
//         type: String
//     },
//     // NEW: For user dashboard - store complete event info
//     eventInfo: {
//         title: String,
//         date: String,
//         time: String,
//         location: String,
//         price: Number,
//         image: String,
//         category: String,
//         description: String
//     },
//     // NEW: For ticket management
//     ticketNumber: {
//         type: String,
//         unique: true,
//         default: () => 'TICKET-' + Date.now() + '-' + Math.random().toString(36).substr(2, 6).toUpperCase()
//     },
//     // NEW: For rating system
//     rating: {
//         stars: { type: Number, min: 1, max: 5 },
//         feedback: String,
//         ratedAt: Date
//     },
//     // NEW: For attendee info (optional)
//     attendees: [{
//         name: String,
//         email: String
//     }]
// });

// // When creating booking, copy event info
// bookingSchema.pre('save', async function(next) {
//     if (this.isNew && !this.eventInfo) {
//         try {
//             const Event = mongoose.model('Event');
//             const event = await Event.findById(this.event);
//             if (event) {
//                 this.eventInfo = {
//                     title: event.title,
//                     date: event.date,
//                     time: event.time,
//                     location: event.location,
//                     price: event.price,
//                     image: event.image,
//                     category: event.category,
//                     description: event.description
//                 };
//             }
//         } catch (error) {
//             console.error("Error copying event info:", error);
//         }
//     }
//     next();
// });

// module.exports = mongoose.model('Booking', bookingSchema);



const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    event: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event',
        required: true
    },
    bookingDate: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        enum: ['confirmed', 'cancelled', 'pending'],
        default: 'confirmed'
    },
    tickets: {
        type: Number,
        default: 1
    },
    totalAmount: {
        type: Number,
        required: true
    },
    paymentId: {
        type: String
    },
    // For user dashboard - store complete event info
    eventInfo: {
        title: String,
        date: String,
        time: String,
        location: String,
        price: Number,
        image: String,
        category: String,
        description: String
    },
    // For ticket management
    ticketNumber: {
        type: String,
        unique: true,
        default: () => 'TICKET-' + Date.now() + '-' + Math.random().toString(36).substr(2, 6).toUpperCase()
    },
    // For rating system
    rating: {
        stars: { type: Number, min: 1, max: 5 },
        feedback: String,
        ratedAt: Date
    },
    // For attendee info (optional)
    attendees: [{
        name: String,
        email: String
    }]
}, {
    timestamps: true
});


bookingSchema.pre('save', async function(next) {
    if (this.isNew && !this.eventInfo) {
        try {
            const Event = mongoose.model('Event');
            const event = await Event.findById(this.event);
            if (event) {
                this.eventInfo = {
                    title: event.title,
                    date: event.date,
                    time: event.time,
                    location: event.location,
                    price: event.price,
                    image: event.image,
                    category: event.category,
                    description: event.description
                };
            }
        } catch (error) {
            console.error("Error copying event info:", error);
        }
    }
    next();
});

module.exports = mongoose.model('Booking', bookingSchema);
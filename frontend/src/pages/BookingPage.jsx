import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaArrowLeft, FaCalendarAlt, FaMapMarkerAlt, FaTicketAlt, FaCheckCircle } from 'react-icons/fa';
import Toast from '../component/Toast';

const BookingPage = () => {
const { eventId } = useParams();
const navigate = useNavigate();
const [event, setEvent] = useState(null);
const [tickets, setTickets] = useState(1);
const [isConfirmed, setIsConfirmed] = useState(false);
const [loading, setLoading] = useState(true);
const [isSubmitting, setIsSubmitting] = useState(false);
const [isLoggedIn, setIsLoggedIn] = useState(false);

// Check login status when component mounts
useEffect(() => {
    const checkLogin = async () => {
        try {
            const response = await fetch(`${process.env.VITE_API_URL}/api/auth/me`, {
                credentials: 'include'
            });
            setIsLoggedIn(response.ok);
        } catch (error) {
            console.error("Login check error:", error);
            setIsLoggedIn(false);
        }
    };
    checkLogin();
}, []);

// Fetch event details
useEffect(() => {
    const fetchEvent = async () => {
        try {
            const response = await fetch(`${process.env.VITE_API_URL}/api/events/${eventId}`);
            if (!response.ok) throw new Error('Event not found');
            const data = await response.json();
            setEvent(data);
        } catch (error) {
            console.error("Error fetching event:", error);
            showToast("Event not found","error");
            navigate('/events');
        } finally {
            setLoading(false);
        }
    };
    fetchEvent();
}, [eventId, navigate]);

// Toast state
const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success",
});

const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => {
        setToast((prev) => ({ ...prev, show: false }));
    }, 3000);
};

// Redirect to login if not logged in
if (!isLoggedIn && !loading) {
    return (
        <div className="min-h-screen bg-[#ebe9e1] pt-28 pb-12 px-4 flex flex-col items-center justify-center">
            <div className="bg-white rounded-3xl p-8 max-w-md text-center shadow-lg border border-stone-100">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FaTicketAlt className="text-2xl text-red-600" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 mb-4">Login Required</h2>
                <p className="text-stone-600 mb-6">Please login to book tickets for this event.</p>
                <button
                    onClick={() => navigate('/login')}
                    className="w-full py-3 bg-[#702c2c] text-white rounded-xl font-medium hover:bg-[#5a2323] mb-3"
                >
                    Go to Login
                </button>
                <button
                    onClick={() => navigate('/events')}
                    className="w-full py-3 border border-stone-300 text-slate-700 rounded-xl font-medium hover:bg-stone-50"
                >
                    Browse Events
                </button>
            </div>
        </div>
    );
}

if (loading) return <div className="min-h-screen bg-[#ebe9e1] flex items-center justify-center pt-28">Loading event details...</div>;
if (!event) return null;

// Calculate prices
const totalPrice = event.price * tickets;
const isFreeEvent = event.price === 0;
const taxes = isFreeEvent ? 0 : totalPrice * 0.18;
const finalAmount = isFreeEvent ? 0 : totalPrice + taxes;

const handleConfirm = async () => {
    if (isSubmitting) return;

    setIsSubmitting(true);

    try {
        const response = await fetch(`${process.env.VITE_API_URL}/api/bookings`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({
                eventId: event._id,
                tickets: Number(tickets),
                totalAmount: Number(finalAmount), // This will be 0 for free events
                paymentId: isFreeEvent ? `FREE_${Date.now()}` : `MOCK_PAYMENT_${Date.now()}`
            })
        });

        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || `Booking failed: ${response.status}`);
        }
        
        setIsConfirmed(true);
        showToast(isFreeEvent ? "Free tickets booked successfully!" : "Booking Confirmed! Check your email.", "success");

    } catch (error) {
        console.error("Booking error:", error);
        showToast(error.message || "Booking failed. Please try again.", "error");
        setIsSubmitting(false);
    }
};

if (isConfirmed) {
    return (
        <>
            <div className="w-full bg-slate-900 p-11.5"></div>
            <div className="min-h-screen bg-[#ebe9e1] flex flex-col items-center justify-center">
                <Toast toast={toast} setToast={setToast} />
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="bg-white p-8 rounded-3xl shadow-xl text-center max-w-md w-full border border-stone-100 px-4 pt-20"
                >
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <FaCheckCircle className="text-4xl text-green-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">
                        {isFreeEvent ? 'Tickets Booked!' : 'Booking Confirmed!'}
                    </h2>
                    <p className="text-stone-500 mb-6">You're all set for <strong>{event.title}</strong>.</p>
                    <div className="bg-stone-50 p-4 rounded-xl mb-6 text-left text-sm">
                        <div className="flex justify-between mb-2">
                            <span className="text-stone-500">Event</span>
                            <span className="font-semibold text-slate-800">{event.title}</span>
                        </div>
                        <div className="flex justify-between mb-2">
                            <span className="text-stone-500">Tickets</span>
                            <span className="font-semibold text-slate-800">x{tickets}</span>
                        </div>
                        <div className="flex justify-between mb-2">
                            <span className="text-stone-500">Date</span>
                            <span className="font-semibold text-slate-800">{event.date}</span>
                        </div>
                        <div className="flex justify-between pt-2 border-t border-stone-200">
                            <span className="font-bold text-slate-800">Total {isFreeEvent ? 'Cost' : 'Paid'}</span>
                            <span className="font-bold text-[#702c2c]">
                                {isFreeEvent ? 'FREE' : `₹${finalAmount.toFixed(0)}`}
                            </span>
                        </div>
                    </div>
                    <button
                        onClick={() => navigate('/events')}
                        className="w-full py-3 bg-slate-900 text-white rounded-xl font-medium hover:bg-slate-800 transition-all"
                    >
                        Explore More Events
                    </button>
                </motion.div>
            </div>
        </>
    );
}

return (
    <div className="min-h-screen bg-[#ebe9e1] ">
        <Toast toast={toast} setToast={setToast} />
        <div className="w-full bg-slate-900 top-0 bottom-90 p-11.5"></div>
        <div className="max-w-6xl mx-auto pt-20 pb-12 px-4 md:px-8">
            <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-stone-500 hover:text-slate-900 mb-8 transition-colors font-medium"
            >
                <FaArrowLeft /> Back
            </button>

            <div className="flex flex-col lg:flex-row gap-12">
                {/* Left: Event Details */}
                <div className="w-full lg:w-3/5">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-3xl overflow-hidden shadow-sm border border-stone-100"
                    >
                        <img
                            src={event.image}
                            alt={event.title}
                            className="w-full h-64 object-cover"
                            onError={(e) => {
                                e.target.src = "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80&w=1000";
                            }}
                        />
                        <div className="p-8">
                            <h1 className="text-3xl font-extrabold text-slate-900 mb-4">{event.title}</h1>
                            <div className="space-y-3 mb-8">
                                <div className="flex items-center gap-3 text-stone-600">
                                    <div className="w-10 h-10 rounded-full bg-[#702c2c]/10 flex items-center justify-center text-[#702c2c]">
                                        <FaCalendarAlt />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold uppercase tracking-wider text-stone-400">Date & Time</p>
                                        <p className="font-medium">{event.date} • {event.time}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 text-stone-600">
                                    <div className="w-10 h-10 rounded-full bg-[#702c2c]/10 flex items-center justify-center text-[#702c2c]">
                                        <FaMapMarkerAlt />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold uppercase tracking-wider text-stone-400">Location</p>
                                        <p className="font-medium">{event.location}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="border-t border-stone-100 pt-8">
                                <h3 className="text-lg font-bold text-slate-800 mb-4">Select Tickets</h3>
                                <div className="flex items-center gap-6">
                                    <div className="flex items-center border border-stone-200 rounded-xl overflow-hidden">
                                        <button
                                            onClick={() => setTickets(Math.max(1, tickets - 1))}
                                            className="w-12 h-12 flex items-center justify-center hover:bg-stone-50 text-xl font-bold text-slate-700 transition-colors"
                                        >
                                            -
                                        </button>
                                        <span className="w-12 h-12 flex items-center justify-center font-bold text-lg bg-stone-50 border-x border-stone-200">
                                            {tickets}
                                        </span>
                                        <button
                                            onClick={() => setTickets(tickets + 1)}
                                            className="w-12 h-12 flex items-center justify-center hover:bg-stone-50 text-xl font-bold text-slate-700 transition-colors"
                                        >
                                            +
                                        </button>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-sm text-stone-500">Price per ticket</span>
                                        <span className="text-xl font-bold text-slate-900">
                                            {isFreeEvent ? 'FREE' : `₹${event.price}`}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Right: Order Summary */}
                <div className="w-full lg:w-2/5">
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-white rounded-3xl p-8 shadow-lg border border-stone-100 sticky top-28"
                    >
                        <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                            <FaTicketAlt className="text-[#702c2c]" /> Order Summary
                        </h3>

                        <div className="space-y-4 mb-6">
                            <div className="flex justify-between text-stone-600">
                                <span>{tickets} x Ticket{tickets > 1 ? 's' : ''}</span>
                                <span>{isFreeEvent ? 'FREE' : `₹${totalPrice}`}</span>
                            </div>
                            
                            {/* Only show taxes for paid events */}
                            {!isFreeEvent && (
                                <div className="flex justify-between text-stone-600">
                                    <span>Taxes & Fees (18%)</span>
                                    <span>₹{taxes.toFixed(0)}</span>
                                </div>
                            )}
                            
                            <div className="border-t border-dashed border-stone-200 pt-4 flex justify-between items-center">
                                <span className="font-bold text-lg text-slate-900">Total</span>
                                <div className="text-right">
                                    <span className="block text-2xl font-extrabold text-[#702c2c]">
                                        {isFreeEvent ? 'FREE' : `₹${finalAmount.toFixed(0)}`}
                                    </span>
                                    <span className="text-[10px] text-stone-400 uppercase tracking-wide">
                                        {isFreeEvent ? 'No payment required' : 'Included all taxes'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={handleConfirm}
                            disabled={isSubmitting}
                            className={`w-full py-4 rounded-xl font-bold text-lg transition-all active:scale-[0.98] ${isSubmitting ? 'bg-stone-400 cursor-not-allowed' : 'bg-[#702c2c] hover:bg-[#5a2323] shadow-lg shadow-[#702c2c]/20'} text-white`}
                        >
                            {isSubmitting 
                                ? 'Processing...' 
                                : isFreeEvent 
                                    ? 'Get Free Tickets' 
                                    : 'Confirm & Pay'
                            }
                        </button>

                        {!isFreeEvent && (
                            <p className="text-center text-xs text-stone-400 mt-4">
                                This is a mock payment for demonstration. <br /> No real money will be deducted.
                            </p>
                        )}
                    </motion.div>
                </div>
            </div>
        </div>
    </div>
);
};

export default BookingPage;
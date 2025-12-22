import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaCalendarAlt, 
  FaMapMarkerAlt, 
  FaHeart, 
  FaHistory, 
  FaSearch, 
  FaBell,
  FaArrowRight,
  FaChevronLeft,
  FaChevronRight,
  FaExclamationCircle,
  FaStar
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import SkeletonLoader from '../component/SkeletonLoader';
import Toast from '../component/Toast';
import EventPopup from '../component/EventPopup';
import RatingPopup from '../component/RatingPopup';

const UserDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [favoriteEvents, setFavoriteEvents] = useState([]);
  const [pastBookings, setPastBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [favoritesSlide, setFavoritesSlide] = useState(0);
  // Popup states
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showEventPopup, setShowEventPopup] = useState(false);
  const [showRatingPopup, setShowRatingPopup] = useState(false);
  const [selectedPastEvent, setSelectedPastEvent] = useState(null);
  
  // Store user reviews for events - key: eventId
  const [userReviews, setUserReviews] = useState({});
  
  // Report state
  const [showReportForm, setShowReportForm] = useState(false);
  const [reportData, setReportData] = useState({
    eventName: '',
    eventDate: '',
    category: 'fraud',
    description: ''
  });
  
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

  // Helper function to check if event is in the past (considering both date and time)
  const isEventInPast = (eventDate, eventTime) => {
    if (!eventDate) return false;
    
    const today = new Date();
    const eventDateTime = new Date(`${eventDate}T${eventTime || '23:59:59'}`);
    
    return eventDateTime < today;
  };

  // Helper function to check if event is upcoming
  const isEventUpcoming = (eventDate, eventTime) => {
    if (!eventDate) return true;
    
    const today = new Date();
    const eventDateTime = new Date(`${eventDate}T${eventTime || '00:00:00'}`);
    
    return eventDateTime > today;
  };

  const API_URL = import.meta.env.VITE_API_URL;

  // Function to fetch user reviews and process them
  const fetchUserReviews = async () => {
    try {
      console.log("Fetching user reviews from /api/ratings/my-reviews...");
      const response = await fetch(`${API_URL}/api/ratings/my-reviews`, {
        credentials: 'include'
      });
      
      if (response.ok) {
        const reviews = await response.json();
        // console.log("Raw reviews data from API:", reviews);
        
        // Create a map of reviews by eventId
        const reviewsMap = {};
        reviews.forEach(review => {
          // Extract event ID - handle both object and string
          let eventId;
          if (review.event && typeof review.event === 'object') {
            eventId = review.event._id || review.event;
          } else {
            eventId = review.event;
          }
          
          // Extract booking ID - handle both object and string
          let bookingId;
          if (review.booking && typeof review.booking === 'object') {
            bookingId = review.booking._id || review.booking;
          } else {
            bookingId = review.booking;
          }
          
          if (eventId) {
            reviewsMap[eventId] = {
              rating: review.rating,
              comment: review.comment,
              createdAt: review.createdAt,
              bookingId: bookingId,
              reviewId: review._id
            };
          }
        });
        
        // console.log("Processed reviews map:", reviewsMap);
        setUserReviews(reviewsMap);
        return reviewsMap;
      } else {
        console.error("Failed to fetch reviews:", response.status);
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
    return {};
  };

  // Function to check if a specific booking has been reviewed
  const checkIfBookingReviewed = (reviewsMap, eventId, bookingId) => {
    if (!reviewsMap[eventId]) return false;
    
    // If the review has a bookingId, check if it matches
    if (reviewsMap[eventId].bookingId) {
      return reviewsMap[eventId].bookingId === bookingId;
    }
    
    // If no bookingId in review, just check if event has any review
    return true;
  };

  // Helper function to extract event ID from booking
  const getEventIdFromBooking = (booking) => {
    // Handle both cases: booking.event could be an object or a string
    if (booking.event && typeof booking.event === 'object') {
      return booking.event._id || booking.event;
    }
    return booking.event || booking._id;
  };

  // Helper function to extract event info from booking
  const getEventInfoFromBooking = (booking) => {
    // If booking has eventInfo, use that
    if (booking.eventInfo) {
      return booking.eventInfo;
    }
    // If booking.event is an object with event details
    if (booking.event && typeof booking.event === 'object') {
      return booking.event;
    }
    return {};
  };

  // Function to refresh all dashboard data
  const refreshDashboardData = async () => {
    try {
      console.log("Refreshing dashboard data...");
      
      // First, fetch user reviews
      const reviewsMap = await fetchUserReviews();
      // console.log("Reviews map after fetch:", reviewsMap);
      
      // Refresh upcoming bookings
      const upcomingRes = await fetch(`${API_URL}/api/users/upcoming-bookings`, {
        credentials: 'include'
      });
      
      if (upcomingRes.ok) {
        const upcomingBookings = await upcomingRes.json();
        
        // Filter out past events (considering both date and time)
        const upcomingEvents = upcomingBookings
          .filter(booking => {
            const eventInfo = getEventInfoFromBooking(booking);
            const eventDate = eventInfo.date || booking.date;
            const eventTime = eventInfo.time || booking.time || '00:00:00';
            return isEventUpcoming(eventDate, eventTime);
          })
          .map(booking => {
            const eventInfo = getEventInfoFromBooking(booking);
            return {
              _id: getEventIdFromBooking(booking),
              title: eventInfo.title || 'Event',
              date: eventInfo.date || 'Date',
              time: eventInfo.time || booking.time || '',
              location: eventInfo.location || 'Location',
              description: eventInfo.description || 'Description',
              image: eventInfo.image || 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30',
              price: eventInfo.price || 0,
              category: eventInfo.category || 'General',
              bookingId: booking._id,
              status: booking.status || 'confirmed',
              tickets: booking.tickets,
              totalAmount: booking.totalAmount,
              ticketNumber: booking.ticketNumber,
              bookingDate: booking.bookingDate
            };
          })
          .sort((a, b) => new Date(a.date + 'T' + a.time) - new Date(b.date + 'T' + b.time));
        
        setUpcomingEvents(upcomingEvents);
      }
      
      // Refresh past bookings
      const bookingsRes = await fetch(`${API_URL}/api/bookings/my-bookings`, {
        credentials: 'include'
      });
      
      if (bookingsRes.ok) {
        const bookings = await bookingsRes.json();
        // console.log("All bookings from API:", bookings);
        
        const past = bookings
          .filter(booking => {
            const eventInfo = getEventInfoFromBooking(booking);
            const eventDate = eventInfo.date || booking.date;
            const eventTime = eventInfo.time || booking.time || '23:59:59';
            return isEventInPast(eventDate, eventTime);
          })
          .map(booking => {
            const eventId = getEventIdFromBooking(booking);
            const bookingId = booking._id;
            const eventInfo = getEventInfoFromBooking(booking);
            
            // Check if this specific booking has been reviewed
            const hasReview = checkIfBookingReviewed(reviewsMap, eventId, bookingId);
            const userReview = reviewsMap[eventId];
            
            // console.log(`Processing booking - Event: ${eventId}, Booking: ${bookingId}, Has Review: ${hasReview}`);
            // console.log(`Event ID type: ${typeof eventId}, Booking ID: ${bookingId}`);
            // console.log(`Reviews map keys:`, Object.keys(reviewsMap));
            
            return {
              _id: eventId,
              title: eventInfo.title || 'Event',
              date: eventInfo.date || 'Date',
              time: eventInfo.time || booking.time || '',
              location: eventInfo.location || 'Location',
              description: eventInfo.description || 'Description',
              image: eventInfo.image || 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30',
              price: eventInfo.price || 0,
              category: eventInfo.category || 'General',
              bookingId: bookingId,
              bookingDate: booking.bookingDate,
              tickets: booking.tickets,
              hasReview,
              userReview
            };
          })
          .sort((a, b) => new Date(b.date + 'T' + b.time) - new Date(a.date + 'T' + a.time));
        
        // console.log("Final past bookings with review status:", past);
        setPastBookings(past);
      }
      
      // Refresh favorites
      const favRes = await fetch(`${API_URL}/api/users/favorites`, {
        credentials: 'include'
      });
      
      if (favRes.ok) {
        const favorites = await favRes.json();
        const favArray = Array.isArray(favorites) ? favorites : favorites.favorites || [];
        
        // Filter out past favorites
        const upcomingFavorites = favArray.filter(event => {
          if (!event || !event.date) return false;
          const eventTime = event.time || '00:00:00';
          return isEventUpcoming(event.date, eventTime);
        });
        
        setFavoriteEvents(upcomingFavorites);
      }
      
    } catch (error) {
      console.error("Refresh error:", error);
      showToast("Error refreshing data", "error");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. Check if user is logged in via session
        const sessionCheck = await fetch(`${API_URL}/api/auth/check`, {
          credentials: 'include'
        });
        
        if (!sessionCheck.ok) {
          navigate('/login');
          return;
        }
        
        const sessionData = await sessionCheck.json();
        if (!sessionData.isAuthenticated) {
          navigate('/login');
          return;
        }

        // 2. Get user info
        const userRes = await fetch(`${API_URL}/api/auth/me`, {
          credentials: 'include'
        });
        
        if (!userRes.ok) {
          navigate('/login');
          return;
        }
        
        const userData = await userRes.json();
        setUser(userData.user);
        // console.log("Current user:", userData.user);

        // 3. Fetch all data using refreshDashboardData
        await refreshDashboardData();

      } catch (error) {
        console.error("Dashboard fetch error:", error);
        showToast("Error loading dashboard data", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  // Handle remove favorite (SESSION auth)
  const handleRemoveFavorite = async (eventId) => {
    try {
      const response = await fetch(`${API_URL}/api/users/favorites/${eventId}`, {
        method: 'POST',
        credentials: 'include'
      });
      
      if (response.ok) {
        // Refresh favorites data
        await refreshDashboardData();
        showToast("Removed from favorites", "success");
      }
    } catch (error) {
      showToast("Failed to remove favorite", "error");
    }
  };

  const handleBookEvent = (eventId) => {
    navigate(`/book/${eventId}`);
  };

  const handleEventClick = (event) => {
    setSelectedEvent({
      ...event,
      status: 'confirmed',
      bookingId: event.bookingId
    });
    setShowEventPopup(true);
  };

  const handlePastEventClick = (event) => {
    // If user has already reviewed this event, don't open rating popup
    if (event.hasReview) {
      showToast("You have already reviewed this event", "info");
      return;
    }
    setSelectedPastEvent(event);
    setShowRatingPopup(true);
  };

  const handleSubmitRating = async (rating, feedback) => {
    try {
      console.log("Submitting rating for event:", selectedPastEvent._id, "booking:", selectedPastEvent.bookingId);
      const response = await fetch(`${API_URL}/api/ratings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          eventId: selectedPastEvent._id,
          bookingId: selectedPastEvent.bookingId,
          rating,
          feedback
        })
      });
      
      if (response.ok) {
        showToast("Thank you for your feedback!", "success");
        setShowRatingPopup(false);
        
        // Refresh all data to get updated reviews
        await refreshDashboardData();
        
        setSelectedPastEvent(null);
      } else {
        const errorData = await response.json();
        showToast(errorData.message || "Failed to submit rating", "error");
      }
    } catch (error) {
      console.error("Rating submission error:", error);
      showToast("Failed to submit rating", "error");
    }
  };

  const handleSubmitReport = async (e) => {
    e.preventDefault();
    try {
      if (!selectedPastEvent && !selectedEvent) {
        showToast("Please select an event to report", "error");
        return;
      }
      
      const eventId = selectedPastEvent?._id || selectedEvent?._id;
      
      const response = await fetch(`${API_URL}/api/users/events/${eventId}/report`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          reason: reportData.category,
          description: reportData.description
        })
      });
      
      if (response.ok) {
        showToast("Report submitted successfully!", "success");
        setShowReportForm(false);
        setReportData({
          eventName: '',
          eventDate: '',
          category: 'fraud',
          description: ''
        });
      }
    } catch (error) {
      showToast("Failed to submit report", "error");
    }
  };

  // Function to render star rating
  const renderStarRating = (rating) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <FaStar
            key={star}
            className={`text-sm ${
              star <= rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'
            }`}
          />
        ))}
        <span className="text-xs text-gray-600 ml-1">({rating}/5)</span>
      </div>
    );
  };

  const quickActions = [
    { icon: <FaCalendarAlt />, label: "Browse Events", action: () => navigate('/events') },
    { icon: <FaHeart />, label: "My Favorites", action: () => document.getElementById('favorites').scrollIntoView({ behavior: 'smooth' }) },
    { icon: <FaHistory />, label: "History", action: () => document.getElementById('history').scrollIntoView({ behavior: 'smooth' }) },
    { icon: <FaBell />, label: "Notifications", action: () => showToast("No new notifications", "info") },
  ];

  const nextSlide = () => {
    const slideIncrement = 3;
    setCurrentSlide((prev) => {
      const maxSlide = Math.max(0, filteredUpcomingEvents.length - slideIncrement);
      return prev + slideIncrement > maxSlide ? 0 : prev + slideIncrement;
    });
  };

  const prevSlide = () => {
    const slideIncrement = 3;
    setCurrentSlide((prev) => {
      const maxSlide = Math.max(0, filteredUpcomingEvents.length - slideIncrement);
      return prev - slideIncrement < 0 ? maxSlide : prev - slideIncrement;
    });
  };

  // Filter events based on search
  const filteredUpcomingEvents = upcomingEvents.filter(event =>
    event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#ebe9e1] font-sans text-slate-900 ">
      <div className="w-full bg-slate-900 top-0 bottom-90 p-11.5"></div>
      <Toast toast={toast} setToast={setToast} />

      {/* Welcome Section */}
      {loading ? (
        <div className="max-w-7xl mx-auto mb-8 ">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="w-full md:w-auto">
              <div className="h-10 bg-stone-100 rounded-full w-64 mb-2 animate-pulse" />
              <div className="h-4 bg-stone-100 rounded-full w-48 animate-pulse" />
            </div>
            <div className="relative w-full md:w-80">
              <div className="h-12 bg-stone-100 rounded-xl animate-pulse" />
            </div>
          </div>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto mb-8 pt-10 max-md:m-10 max-2xl:m-5">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900">
                Welcome back, <span className="text-[#702c2c]">{user?.name || 'User'}!</span>
              </h1>
              <p className="text-stone-600 mt-2">
                {upcomingEvents.length > 0 
                  ? `You have ${upcomingEvents.length} upcoming events` 
                  : "No upcoming events. Let's explore some!"}
              </p>
            </div>
            
            {/* Search Bar */}
            <div className="relative w-full md:w-auto">
              <div className="relative group">
                <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                <input
                  type="text"
                  placeholder="Search events..."
                  className="pl-10 pr-4 py-3 bg-white border border-stone-200 rounded-xl 
                    focus:ring-2 focus:ring-[#702c2c]/20 focus:border-[#702c2c] 
                    outline-none transition-all w-full md:w-80 text-sm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="max-w-7xl mx-auto mb-10 max-md:m-10 max-2xl:m-5">
        <h2 className="text-lg font-bold text-slate-800 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {quickActions.map((action, index) => (
            <motion.button
              key={index}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={action.action}
              className="bg-white p-4 rounded-xl border border-stone-200 
                hover:border-[#702c2c]/30 hover:shadow-md transition-all 
                flex flex-col items-center justify-center gap-2 cursor-pointer"
            >
              <div className="text-[#702c2c] text-xl">{action.icon}</div>
              <span className="text-sm font-medium text-slate-800">{action.label}</span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Upcoming Events Slider */}
      <div className="max-w-7xl mx-auto mb-12 max-md:m-5 max-2xl:m-5">
        <div className="flex justify-between items-center mb-6">
          <div className="w-full flex items-center justify-between gap-2">
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <FaCalendarAlt className="text-[#702c2c]" />
            Your Upcoming Events
            </h2>
            <span className="text-sm font-normal text-stone-500 flex justify-center items-center gap-1">
              <span>({filteredUpcomingEvents.length}</span> 
              <span>booked)</span>
            </span>
          </div>
          
          {filteredUpcomingEvents.length > 3 && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-stone-500">
                Slide {Math.min(Math.floor(currentSlide / 3) + 1, Math.ceil(filteredUpcomingEvents.length / 3))} / {Math.ceil(filteredUpcomingEvents.length / 3)}
              </span>
              <button 
                onClick={prevSlide}
                disabled={currentSlide === 0}
                className={`p-2 rounded-full border border-stone-200 ${
                  currentSlide === 0 
                    ? 'bg-stone-100 text-stone-300 cursor-not-allowed' 
                    : 'bg-white hover:bg-stone-50 text-stone-700'
                }`}
              >
                <FaChevronLeft className="text-sm" />
              </button>
              <button 
                onClick={nextSlide}
                disabled={currentSlide + 3 >= filteredUpcomingEvents.length}
                className={`p-2 rounded-full border border-stone-200 ${
                  currentSlide + 3 >= filteredUpcomingEvents.length
                    ? 'bg-stone-100 text-stone-300 cursor-not-allowed' 
                    : 'bg-white hover:bg-stone-50 text-stone-700'
                }`}
              >
                <FaChevronRight className="text-sm" />
              </button>
            </div>
          )}
        </div>
        
        {loading ? (
          <SkeletonLoader />
        ) : filteredUpcomingEvents.length > 0 ? (
          <div className="relative overflow-hidden rounded-2xl">
            <motion.div
              className="flex"
              animate={{ x: `-${currentSlide * 33.333}%` }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              {(() => {
                const groups = [];
                for (let i = 0; i < filteredUpcomingEvents.length; i += 3) {
                  groups.push(filteredUpcomingEvents.slice(i, i + 3));
                }
                return groups;
              })().map((group, groupIndex) => (
                <div key={groupIndex} className="w-full shrink-0 px-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {group.map((event) => (
                      <motion.div
                        key={event._id}
                        whileHover={{ y: -4 }}
                        onClick={() => handleEventClick(event)}
                        className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-sm hover:shadow-md transition-all cursor-pointer"
                      >
                        <div className="relative h-44 overflow-hidden bg-stone-100">
                          <img
                            src={event.image}
                            alt={event.title}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.src = "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80&w=1000";
                            }}
                          />
                          <span className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded-full">
                            {event.category}
                          </span>
                          <span className="absolute top-2 right-2 bg-[#702c2c] text-white text-xs px-2 py-1 rounded-full">
                            Booked
                          </span>
                        </div>
                        
                        <div className="p-4">
                          <h3 className="font-bold text-slate-800 mb-2 line-clamp-1">{event.title}</h3>
                          <p className="text-stone-500 text-sm mb-3 flex items-center gap-1">
                            <FaMapMarkerAlt className="text-xs" /> {event.location}
                          </p>
                          <p className="text-stone-500 text-sm mb-4 line-clamp-2">{event.description}</p>
                          
                          <div className="space-y-2 border-t border-stone-100 pt-3">
                            <div className="flex justify-between text-xs">
                              <span className="text-stone-500">Date:</span>
                              <span className="font-medium text-slate-700">{event.date}</span>
                            </div>
                            <div className="flex justify-between text-xs">
                              <span className="text-stone-500">Time:</span>
                              <span className="font-medium text-slate-700">{event.time || 'N/A'}</span>
                            </div>
                            <div className="flex justify-between text-xs">
                              <span className="text-stone-500">Tickets:</span>
                              <span className="font-medium text-slate-700">{event.tickets || 1}</span>
                            </div>
                            <div className="flex justify-between text-xs">
                              <span className="text-stone-500">Ticket #:</span>
                              <span className="font-medium text-slate-700">{event.ticketNumber || 'N/A'}</span>
                            </div>
                          </div>

                          <button className="w-full mt-4 py-2.5 bg-[#702c2c] text-white text-sm font-medium rounded-lg hover:bg-[#5a2323] transition-colors">
                            View Ticket Details
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              ))}
            </motion.div>
            
            {(() => {
              const totalGroups = Math.ceil(filteredUpcomingEvents.length / 3);
              if (totalGroups > 1) {
                return (
                  <div className="flex justify-center gap-2 mt-6">
                    {Array.from({ length: totalGroups }).map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentSlide(idx * 3)}
                        className={`w-2 h-2 rounded-full transition-all ${
                          Math.floor(currentSlide / 3) === idx ? 'bg-[#702c2c] w-6' : 'bg-stone-300'
                        }`}
                      />
                    ))}
                  </div>
                );
              }
              return null;
            })()}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-stone-300">
            <FaCalendarAlt className="text-4xl text-stone-300 mx-auto mb-3" />
            <p className="text-stone-500">No upcoming booked events</p>
            <p className="text-sm text-stone-400 mb-4">Book events to see them here</p>
            <button 
              onClick={() => navigate('/events')}
              className="mt-2 px-6 py-2 bg-[#702c2c] text-white rounded-lg font-medium hover:bg-[#5a2323]"
            >
              Browse Events
            </button>
          </div>
        )}
      </div>

      {/* Favorite Events Slider */}
      {!loading && favoriteEvents.length > 0 && (
        <div id="favorites" className="max-w-7xl pt-20 mx-auto mb-12 max-md:m-4 max-2xl:m-5">
          <div className="flex flex-col justify-center gap-2 items-center mb-6">
            <div className="w-full flex justify-between gap-2">
              <h2 className="text-xl font-bold text-slate-800 flex items-center justify-center gap-2">
                <FaHeart className="text-[#702c2c] text-xl" />
                <span>Your Favorite Events</span>
              </h2>
              <span className="text-sm font-normal text-stone-500 flex justify-center items-center gap-1">
                <span>({favoriteEvents.length}</span> 
                <span>favourited)</span>
              </span>
            </div>
            {favoriteEvents.length > 3 && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-stone-500">
                  Slide {Math.floor(favoritesSlide / 3) + 1} / {Math.ceil(favoriteEvents.length / 3)}
                </span>
                <button 
                  onClick={() => {
                    const newSlide = favoritesSlide - 3;
                    setFavoritesSlide(newSlide < 0 ? 0 : newSlide);
                  }}
                  disabled={favoritesSlide === 0}
                  className={`p-2 rounded-full border border-stone-200 ${
                    favoritesSlide === 0 
                      ? 'bg-stone-100 text-stone-300 cursor-not-allowed' 
                      : 'bg-white hover:bg-stone-50 text-stone-700'
                  }`}
                >
                  <FaChevronLeft className="text-sm" />
                </button>
                <button 
                  onClick={() => {
                    const maxSlide = Math.max(0, Math.ceil(favoriteEvents.length / 3) - 1) * 3;
                    const newSlide = favoritesSlide + 3;
                    setFavoritesSlide(newSlide > maxSlide ? maxSlide : newSlide);
                  }}
                  disabled={favoritesSlide + 3 >= favoriteEvents.length}
                  className={`p-2 rounded-full border border-stone-200 ${
                    favoritesSlide + 3 >= favoriteEvents.length
                      ? 'bg-stone-100 text-stone-300 cursor-not-allowed' 
                      : 'bg-white hover:bg-stone-50 text-stone-700'
                  }`}
                >
                  <FaChevronRight className="text-sm" />
                </button>
              </div>
            )}
          </div>
          
          <div className="relative overflow-hidden rounded-2xl">
            <>
              <motion.div
                className="flex"
                animate={{ x: `-${favoritesSlide * 33.333}%` }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              >
                {(() => {
                  const groups = [];
                  for (let i = 0; i < favoriteEvents.length; i += 3) {
                    groups.push(favoriteEvents.slice(i, i + 3));
                  }
                  return groups;
                })().map((group, groupIndex) => (
                  <div key={groupIndex} className="w-full shrink-0 px-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {group.map((event) => (
                        <motion.div
                          key={event._id}
                          whileHover={{ y: -4 }}
                          onClick={() => handleBookEvent(event._id)}
                          className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-sm hover:shadow-md transition-all cursor-pointer"
                        >
                          <div className="relative h-44 overflow-hidden bg-stone-100">
                            <img
                              src={event.image}
                              alt={event.title}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.src = "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80&w=1000";
                              }}
                            />
                            <span className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded-full">
                              {event.category}
                            </span>
                          </div>
                          
                          <div className="p-4">
                            <h3 className="font-bold text-slate-800 mb-2 line-clamp-1">{event.title}</h3>
                            <p className="text-stone-500 text-sm mb-3 flex items-center gap-1">
                              <FaMapMarkerAlt className="text-xs" /> {event.location}
                            </p>
                            <p className="text-stone-500 text-sm mb-4 line-clamp-2">{event.description}</p>
                            
                            <div className="space-y-2 border-t border-stone-100 pt-3">
                              <div className="flex justify-between text-xs">
                                <span className="text-stone-500">Date:</span>
                                <span className="font-medium text-slate-700">{event.date}</span>
                              </div>
                              <div className="flex justify-between text-xs">
                                <span className="text-stone-500">Time:</span>
                                <span className="font-medium text-slate-700">{event.time || 'N/A'}</span>
                              </div>
                              <div className="flex justify-between text-xs">
                                <span className="text-stone-500">Price:</span>
                                <span className="font-medium text-slate-700">
                                  {event.price === 0 ? 'Free' : `₹${event.price}`}
                                </span>
                              </div>
                            </div>

                            <div className="flex gap-2 mt-4">
                              <button className="flex-1 bg-[#702c2c] text-white py-2.5 text-sm font-medium rounded-lg hover:bg-[#5a2323] transition-colors">
                                Book Now
                              </button>
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleRemoveFavorite(event._id);
                                }}
                                className="px-4 py-2.5 border border-stone-300 text-stone-600 text-sm font-medium rounded-lg hover:bg-stone-50 transition-colors"
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                ))}
              </motion.div>
              
              {(() => {
                const totalGroups = Math.ceil(favoriteEvents.length / 3);
                if (totalGroups > 1) {
                  return (
                    <div className="flex justify-center gap-2 mt-6">
                      {Array.from({ length: totalGroups }).map((_, idx) => (
                        <button
                          key={idx}
                          onClick={() => setFavoritesSlide(idx * 3)}
                          className={`w-2 h-2 rounded-full transition-all ${
                            Math.floor(favoritesSlide / 3) === idx ? 'bg-red-500 w-6' : 'bg-stone-300'
                          }`}
                        />
                      ))}
                    </div>
                  );
                }
                return null;
              })()}
            </>
          </div>
        </div>
      )}

      {/* Past Events History */}
      <div id="history" className="max-w-7xl mx-auto mb-12 max-md:m-10 max-2xl:m-5">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <FaHistory className="text-stone-500" />
            Event History
          </h2>
        </div>
        
        {loading ? (
          <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden">
            {[1, 2, 3].map((_, idx) => (
              <div key={idx} className="p-4 border-b border-stone-100">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-stone-100 rounded-lg animate-pulse" />
                  <div className="flex-1">
                    <div className="h-5 bg-stone-100 rounded-full w-1/2 mb-2 animate-pulse" />
                    <div className="h-3 bg-stone-100 rounded-full w-1/3 animate-pulse" />
                  </div>
                  <div className="h-8 bg-stone-100 rounded-lg w-20 animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        ) : pastBookings.length > 0 ? (
          <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden">
            <div className="divide-y divide-stone-100">
              {pastBookings.slice(0, 5).map((event) => (
                <div
                  key={`${event.bookingId || event._id}-${event.hasReview ? 'rated' : 'not-rated'}`}
                  className="p-4 hover:bg-stone-50 transition-colors flex items-center justify-between"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-stone-100 rounded-lg flex items-center justify-center">
                      <FaCalendarAlt className="text-stone-400" />
                    </div>
                    <div>
                      <h4 className="font-medium text-slate-800">{event.title}</h4>
                      <div className="flex items-center text-stone-500 text-sm gap-3 mt-1">
                        <span>{event.date} {event.time && `• ${event.time}`}</span>
                        <span>•</span>
                        <span>{event.location}</span>
                      </div>
                      {event.hasReview && event.userReview && (
                        <div className="mt-2 flex items-center gap-2">
                          <span className="text-xs text-gray-600">Your rating:</span>
                          {renderStarRating(event.userReview.rating)}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {event.hasReview ? (
                    <div className="text-sm text-green-600 font-medium flex items-center gap-1">
                      <FaStar className="text-yellow-500" />
                      Rated
                    </div>
                  ) : (
                    <button 
                      onClick={() => handlePastEventClick(event)}
                      className="text-sm text-[#702c2c] font-medium hover:underline flex items-center gap-1"
                    >
                      Rate & Review <FaStar className="text-xs" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-stone-200 p-8 text-center">
            <FaHistory className="text-4xl text-stone-300 mx-auto mb-3" />
            <p className="text-stone-500">No past events attended yet</p>
          </div>
        )}
      </div>

      {/* Report Section */}
      <div className="max-w-7xl mx-auto pb-12 max-md:mx-10 max-2xl:mx-5">
        <div className="bg-white rounded-2xl border border-stone-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <FaExclamationCircle className="text-orange-500" />
              Report an Issue
            </h2>
            <button
              onClick={() => setShowReportForm(!showReportForm)}
              className={`text-sm font-medium px-4 py-2 rounded-lg transition-colors ${
                showReportForm 
                  ? 'bg-stone-100 text-stone-700 hover:bg-stone-200' 
                  : 'bg-[#702c2c] text-white hover:bg-[#5a2323]'
              }`}
            >
              {showReportForm ? 'Cancel' : 'File a Report'}
            </button>
          </div>
          
          <p className="text-stone-600 text-sm mb-6">
            Experienced fraud or issues at an event? Report it here.
          </p>
          
          <AnimatePresence>
            {showReportForm && (
              <motion.form
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                onSubmit={handleSubmitReport}
                className="space-y-4 overflow-hidden"
              >
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Event Name *
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-lg 
                        focus:ring-2 focus:ring-[#702c2c]/20 focus:border-[#702c2c] outline-none"
                      value={reportData.eventName}
                      onChange={(e) => setReportData({...reportData, eventName: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Event Date *
                    </label>
                    <input
                      type="date"
                      required
                      className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-lg 
                        focus:ring-2 focus:ring-[#702c2c]/20 focus:border-[#702c2c] outline-none"
                      value={reportData.eventDate}
                      onChange={(e) => setReportData({...reportData, eventDate: e.target.value})}
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Issue Category
                  </label>
                  <select
                    className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-lg 
                      focus:ring-2 focus:ring-[#702c2c]/20 focus:border-[#702c2c] outline-none"
                    value={reportData.category}
                    onChange={(e) => setReportData({...reportData, category: e.target.value})}
                  >
                    <option value="fraud">Fraud / Scam</option>
                    <option value="fake">Fake Event</option>
                    <option value="spam">Spam</option>
                    <option value="inappropriate">Inappropriate Content</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Description *
                  </label>
                  <textarea
                    required
                    rows={3}
                    className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-lg 
                      focus:ring-2 focus:ring-[#702c2c]/20 focus:border-[#702c2c] outline-none"
                    value={reportData.description}
                    onChange={(e) => setReportData({...reportData, description: e.target.value})}
                  />
                </div>
                
                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowReportForm(false)}
                    className="px-6 py-2.5 border border-stone-300 text-stone-700 rounded-lg 
                      font-medium hover:bg-stone-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-[#702c2c] text-white rounded-lg 
                      font-medium hover:bg-[#5a2323] transition-colors"
                  >
                    Submit Report
                  </button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Popups */}
      <EventPopup 
        show={showEventPopup}
        event={selectedEvent}
        bookingId={selectedEvent?.bookingId}
        onClose={() => {
          setShowEventPopup(false);
          setSelectedEvent(null);
        }}
        onCancelSuccess={async () => {
          await refreshDashboardData();
          showToast("Booking cancelled successfully!", "success");
        }}
      />

      <RatingPopup 
        show={showRatingPopup}
        event={selectedPastEvent}
        onClose={() => setShowRatingPopup(false)}
        onSubmit={handleSubmitRating}
      />
    </div>
  );
};

export default UserDashboard;
// import React, { useState, useEffect } from 'react';

// const UserDash = () => {
//   const [userData, setUserData] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchUserData = async () => {
//       try {
//         const response = await fetch('http://localhost:5000/api/auth/me', {
//           credentials: 'include'
//         });
//         if (response.ok) {
//           const data = await response.json();
//           setUserData(data.user);
//         }
//       } catch (error) {
//         console.error('Error fetching user data:', error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchUserData();
//   }, []);

//   if (loading) {
//     return <div>Loading...</div>;
//   }

//   return (
//     <div className="p-8">
//       <h1 className="text-3xl font-bold">User Dashboard</h1>
//       {userData && (
//         <div className="mt-4">
//           <p>Welcome, {userData.name}!</p>
//           <p>Email: {userData.email}</p>
//           <p>Role: {userData.role}</p>
//         </div>
//       )}
//       {/* Your user dashboard content */}
//     </div>
//   );
// };

// export default UserDash;




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
  
  // Popup states
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showEventPopup, setShowEventPopup] = useState(false);
  const [showRatingPopup, setShowRatingPopup] = useState(false);
  const [selectedPastEvent, setSelectedPastEvent] = useState(null);
  
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


  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. Check if user is logged in via session
        const sessionCheck = await fetch('http://localhost:5000/api/auth/check', {
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
        const userRes = await fetch('http://localhost:5000/api/auth/me', {
          credentials: 'include'
        });
        
        if (!userRes.ok) {
          navigate('/login');
          return;
        }
        
        const userData = await userRes.json();
        setUser(userData.user);

        // 3. Fetch USER'S UPCOMING BOOKINGS (not all events)
        // const upcomingRes = await fetch('http://localhost:5000/api/users/upcoming-bookings', {
        //   credentials: 'include'
        // });
        
        // if (upcomingRes.ok) {
        //   const upcomingBookings = await upcomingRes.json();
          
        //   // Transform booking data to event format for display
        //   const upcomingEvents = upcomingBookings.map(booking => ({
        //     _id: booking.event || booking._id,
        //     title: booking.eventInfo?.title || 'Event',
        //     date: booking.eventInfo?.date || 'Date',
        //     time: booking.eventInfo?.time || '',
        //     location: booking.eventInfo?.location || 'Location',
        //     description: booking.eventInfo?.description || 'Description',
        //     image: booking.eventInfo?.image || 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30',
        //     price: booking.eventInfo?.price || 0,
        //     category: booking.eventInfo?.category || 'General',
        //     bookingId: booking._id,
        //     tickets: booking.tickets,
        //     totalAmount: booking.totalAmount,
        //     ticketNumber: booking.ticketNumber,
        //     bookingDate: booking.bookingDate
        //   })).sort((a, b) => new Date(a.date) - new Date(b.date)); // Sort by date
        
        //   setUpcomingEvents(upcomingEvents);
        // }

        // 3. Fetch USER'S UPCOMING BOOKINGS (not all events)
        const upcomingRes = await fetch('http://localhost:5000/api/users/upcoming-bookings', {
          credentials: 'include'
        });

        if (upcomingRes.ok) {
          const upcomingBookings = await upcomingRes.json();
          
          // Transform booking data to event format for display
          const upcomingEvents = upcomingBookings.map(booking => ({
            _id: booking.event || booking._id,
            title: booking.eventInfo?.title || 'Event',
            date: booking.eventInfo?.date || 'Date',
            time: booking.eventInfo?.time || '',
            location: booking.eventInfo?.location || 'Location',
            description: booking.eventInfo?.description || 'Description',
            image: booking.eventInfo?.image || 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30',
            price: booking.eventInfo?.price || 0,
            category: booking.eventInfo?.category || 'General',
            bookingId: booking._id, // ✅ This is important
            status: booking.status || 'confirmed', // ✅ Add status
            tickets: booking.tickets,
            totalAmount: booking.totalAmount,
            ticketNumber: booking.ticketNumber,
            bookingDate: booking.bookingDate
          })).sort((a, b) => new Date(a.date) - new Date(b.date));
          
          setUpcomingEvents(upcomingEvents);
        }

        const refreshDashboardData = async () => {
          try {
            // Refresh upcoming bookings
            const upcomingRes = await fetch('http://localhost:5000/api/users/upcoming-bookings', {
              credentials: 'include'
            });
            
            if (upcomingRes.ok) {
              const upcomingBookings = await upcomingRes.json();
              const upcomingEvents = upcomingBookings.map(booking => ({
                _id: booking.event || booking._id,
                title: booking.eventInfo?.title || 'Event',
                date: booking.eventInfo?.date || 'Date',
                time: booking.eventInfo?.time || '',
                location: booking.eventInfo?.location || 'Location',
                description: booking.eventInfo?.description || 'Description',
                image: booking.eventInfo?.image || 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30',
                price: booking.eventInfo?.price || 0,
                category: booking.eventInfo?.category || 'General',
                bookingId: booking._id,
                status: booking.status || 'confirmed',
                tickets: booking.tickets,
                totalAmount: booking.totalAmount,
                ticketNumber: booking.ticketNumber,
                bookingDate: booking.bookingDate
              })).sort((a, b) => new Date(a.date) - new Date(b.date));
              
              setUpcomingEvents(upcomingEvents);
            }
            
            // Also refresh past bookings if needed
            const bookingsRes = await fetch('http://localhost:5000/api/bookings/my-bookings', {
              credentials: 'include'
            });
            
            if (bookingsRes.ok) {
              const bookings = await bookingsRes.json();
              const today = new Date().toISOString().split('T')[0];
              
              const past = bookings
                .filter(booking => {
                  const eventDate = booking.eventInfo?.date || booking.event?.date;
                  return eventDate && eventDate < today;
                })
                .map(booking => ({
                  _id: booking.event || booking._id,
                  title: booking.eventInfo?.title || 'Event',
                  date: booking.eventInfo?.date || 'Date',
                  location: booking.eventInfo?.location || 'Location',
                  description: booking.eventInfo?.description || 'Description',
                  image: booking.eventInfo?.image || 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30',
                  price: booking.eventInfo?.price || 0,
                  category: booking.eventInfo?.category || 'General',
                  bookingId: booking._id,
                  bookingDate: booking.bookingDate,
                  tickets: booking.tickets
                }))
                .sort((a, b) => new Date(b.date) - new Date(a.date));
              
              setPastBookings(past);
            }
            
          } catch (error) {
            console.error("Refresh error:", error);
          }
        };


        // 4. Fetch user bookings for history
        const bookingsRes = await fetch('http://localhost:5000/api/bookings/my-bookings', {
          credentials: 'include'
        });
        
        if (bookingsRes.ok) {
          const bookings = await bookingsRes.json();
          const today = new Date().toISOString().split('T')[0];
          
          const past = bookings
            .filter(booking => {
              const eventDate = booking.eventInfo?.date || booking.event?.date;
              return eventDate && eventDate < today;
            })
            .map(booking => ({
              _id: booking.event || booking._id,
              title: booking.eventInfo?.title || 'Event',
              date: booking.eventInfo?.date || 'Date',
              location: booking.eventInfo?.location || 'Location',
              description: booking.eventInfo?.description || 'Description',
              image: booking.eventInfo?.image || 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30',
              price: booking.eventInfo?.price || 0,
              category: booking.eventInfo?.category || 'General',
              bookingId: booking._id,
              bookingDate: booking.bookingDate,
              tickets: booking.tickets
            }))
            .sort((a, b) => new Date(b.date) - new Date(a.date));
          
          setPastBookings(past);
        }

        // 5. Fetch favorites
        const favRes = await fetch('http://localhost:5000/api/users/favorites', {
          credentials: 'include'
        });
        
        if (favRes.ok) {
          const favorites = await favRes.json();
          const today = new Date().toISOString().split('T')[0];
          
          const favArray = Array.isArray(favorites) ? favorites : favorites.favorites || [];
          const upcomingFavorites = favArray.filter(event => 
            event && event.date && event.date >= today
          );
          
          setFavoriteEvents(upcomingFavorites);
        }

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
      const response = await fetch(`http://localhost:5000/api/users/favorites/${eventId}`, {
        method: 'POST',
        credentials: 'include'
      });
      
      if (response.ok) {
        // Refresh favorites
        const favRes = await fetch('http://localhost:5000/api/users/favorites', {
          credentials: 'include'
        });
        
        if (favRes.ok) {
          const favorites = await favRes.json();
          const today = new Date().toISOString().split('T')[0];
          const favArray = Array.isArray(favorites) ? favorites : favorites.favorites || [];
          const upcomingFavorites = favArray.filter(event => 
            event && event.date && event.date >= today
          );
          setFavoriteEvents(upcomingFavorites);
        }
        showToast("Removed from favorites", "success");
      }
    } catch (error) {
      showToast("Failed to remove favorite", "error");
    }
  };

  const handleBookEvent = (eventId) => {
    navigate(`/book/${eventId}`);
  };

  // const handleEventClick = (event) => {
  //   setSelectedEvent(event);
  //   setShowEventPopup(true);
  // };

  const handleEventClick = (event) => {
    setSelectedEvent({
      ...event,
      status: 'confirmed', // You should get this from your booking data
      bookingId: event.bookingId // Make sure this is passed
    });
    setShowEventPopup(true);
  };
  const handlePastEventClick = (event) => {
    setSelectedPastEvent(event);
    setShowRatingPopup(true);
  };



  // const handleSubmitRating = async (rating, feedback) => {
  //   try {
  //     const response = await fetch(`http://localhost:5000/api/users/events/${selectedPastEvent._id}/review`, {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json'
  //       },
  //       credentials: 'include',
  //       body: JSON.stringify({
  //         rating,
  //         comment: feedback
  //       })
  //     });
      
  //     if (response.ok) {
  //       showToast("Thank you for your feedback!", "success");
  //       setShowRatingPopup(false);
  //       setSelectedPastEvent(null);
  //     }
  //   } catch (error) {
  //     showToast("Failed to submit rating", "error");
  //   }
  // };

  const handleSubmitRating = async (rating, feedback) => {
  try {
    const response = await fetch(`http://localhost:5000/api/users/events/${selectedPastEvent._id}/review`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify({
        rating,
        comment: feedback
      })
    });
    
    if (response.ok) {
      showToast("Thank you for your feedback!", "success");
      setShowRatingPopup(false);
      setSelectedPastEvent(null);
    } else {
      // Fallback to ratings endpoint
      const altResponse = await fetch('http://localhost:5000/api/ratings', {
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
      
      if (altResponse.ok) {
        showToast("Thank you for your feedback!", "success");
        setShowRatingPopup(false);
        setSelectedPastEvent(null);
      } else {
        showToast("Failed to submit rating", "error");
      }
    }
  } catch (error) {
    showToast("Failed to submit rating", "error");
  }
};

  const handleSubmitReport = async (e) => {
    e.preventDefault();
    try {
      // We need an event ID for reporting
      if (!selectedPastEvent && !selectedEvent) {
        showToast("Please select an event to report", "error");
        return;
      }
      
      const eventId = selectedPastEvent?._id || selectedEvent?._id;
      
      const response = await fetch(`http://localhost:5000/api/users/events/${eventId}/report`, {
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

  const quickActions = [
    { icon: <FaCalendarAlt />, label: "Browse Events", action: () => navigate('/events') },
    { icon: <FaHeart />, label: "My Favorites", action: () => document.getElementById('favorites').scrollIntoView({ behavior: 'smooth' }) },
    { icon: <FaHistory />, label: "History", action: () => document.getElementById('history').scrollIntoView({ behavior: 'smooth' }) },
    { icon: <FaBell />, label: "Notifications", action: () => showToast("No new notifications", "info") },
  ];


  const nextSlide = () => {
    const slideIncrement = 3; // Move 3 events at a time
    setCurrentSlide((prev) => {
      const maxSlide = Math.max(0, filteredUpcomingEvents.length - slideIncrement);
      return prev + slideIncrement > maxSlide ? 0 : prev + slideIncrement;
    });
  };

  const prevSlide = () => {
    const slideIncrement = 3; // Move 3 events at a time
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
        <div className="max-w-7xl mx-auto mb-8 pt-25 max-md:m-10 max-2xl:m-5">
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
      <div className="max-w-7xl mx-auto mb-12 max-md:m-10 max-2xl:m-5">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <FaCalendarAlt className="text-[#702c2c]" />
            Your Upcoming Events
            <span className="text-sm font-normal text-stone-500 ml-2">
              ({filteredUpcomingEvents.length} booked)
            </span>
          </h2>
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
              animate={{ x: `-${currentSlide * 33.333}%` }} // 33.333% per slide (3 events)
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              {/* Group events in sets of 3 */}
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
            
            {/* Dots indicator for groups */}
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

      {/* Favorite Events */}
      {!loading && favoriteEvents.length > 0 && (
        <div id="favorites" className="max-w-7xl mx-auto mb-12 max-md:m-10 max-2xl:m-5">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <FaHeart className="text-red-500" />
              Your Favorite Events
            </h2>
            {favoriteEvents.length > 2 && (
              <button 
                onClick={() => navigate('/favorites')}
                className="text-sm text-[#702c2c] font-medium hover:underline flex items-center gap-1"
              >
                View All <FaArrowRight className="text-xs" />
              </button>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-md:m-10 max-2xl:m-5">
            {favoriteEvents.slice(0, 2).map((event) => (
              <motion.div
                key={event._id}
                whileHover={{ scale: 1.01 }}
                onClick={() => handleBookEvent(event._id)}
                className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-sm 
                  hover:shadow-md transition-all cursor-pointer flex"
              >
                <div className="w-1/3 relative">
                  <img
                    src={event.image}
                    alt={event.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = "https://images.unsplash.com/photo-1492684223066-81342ee5ff30";
                    }}
                  />
                  <div className="absolute inset-0 bg-linear-to-r from-transparent to-white/30"></div>
                </div>
                
                <div className="w-2/3 p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-slate-800 line-clamp-1">{event.title}</h3>
                    <FaHeart className="text-red-500" />
                  </div>
                  <div className="flex items-center text-stone-600 text-sm mb-3 gap-2">
                    <FaCalendarAlt className="text-xs" />
                    <span>{event.date}</span>
                  </div>
                  <p className="text-stone-600 text-sm mb-4 line-clamp-2">{event.description}</p>
                  <div className="flex gap-2">
                    <button className="flex-1 bg-[#702c2c] text-white py-2 rounded-lg font-medium hover:bg-[#5a2323]">
                      Book Now
                    </button>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveFavorite(event._id);
                      }}
                      className="px-3 py-2 border border-stone-300 text-stone-600 rounded-lg hover:bg-stone-50"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
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
                  key={event.bookingId || event._id}
                  className="p-4 hover:bg-stone-50 transition-colors cursor-pointer flex items-center justify-between"
                  onClick={() => handlePastEventClick(event)}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-stone-100 rounded-lg flex items-center justify-center">
                      <FaCalendarAlt className="text-stone-400" />
                    </div>
                    <div>
                      <h4 className="font-medium text-slate-800">{event.title}</h4>
                      <div className="flex items-center text-stone-500 text-sm gap-3 mt-1">
                        <span>{event.date}</span>
                        <span>•</span>
                        <span>{event.location}</span>
                      </div>
                    </div>
                  </div>
                  <button className="text-sm text-[#702c2c] font-medium hover:underline flex items-center gap-1">
                    Rate & Review <FaStar className="text-xs" />
                  </button>
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
      {/* <EventPopup 
        show={showEventPopup}
        event={selectedEvent}
        onClose={() => setShowEventPopup(false)}
        onEmailTicket={handleEmailTicket}
        onDownloadTicket={handleDownloadTicket}
      /> */}

      <EventPopup 
        show={showEventPopup}
        event={selectedEvent}
        bookingId={selectedEvent?.bookingId}
        onClose={() => {
          setShowEventPopup(false);
          setSelectedEvent(null);
        }}
        onCancelSuccess={()=>{
          refreshDashboardData
          showToast("Booking cancelled successfully!", "success");
        }
        }
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
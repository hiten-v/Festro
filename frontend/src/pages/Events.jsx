import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaCalendarAlt, FaMapMarkerAlt, FaLocationArrow, FaHeart, FaRegHeart } from 'react-icons/fa';
import EventFilters from '../component/EventFilters';
import { useNavigate } from 'react-router-dom';
import LoginSignupPopup from '../component/LoginSignUpPop';

// Haversine Formula to calculate distance in KM
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Radius of Earth in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in km
};

// Helper function to check if event is in the future (considering both date and time)
const isEventUpcoming = (eventDate, eventTime) => {
  if (!eventDate) return true;
  
  const today = new Date();
  const eventDateTime = new Date(`${eventDate}T${eventTime || '00:00:00'}`);
  
  return eventDateTime > today;
};

// Helper function to normalize location strings for better matching
const normalizeLocation = (location) => {
  if (!location) return '';
  return location.toLowerCase()
    .replace(/\s+/g, ' ')
    .replace(/[.,]/g, '')
    .trim();
};

const Events = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [pendingAction, setPendingAction] = useState(null); // Track what action was attempted
  const API_URL = import.meta.env.VITE_API_URL;
  // Check if user is logged in via session
  const checkAuth = async () => {
    try {
      const response = await fetch(`${API_URL}/api/auth/check`, {
        credentials: 'include'
      });
      if (response.ok) {
        const data = await response.json();
        setIsLoggedIn(data.isAuthenticated);
        
        // If logged in, fetch favorites
        if (data.isAuthenticated) {
          fetchFavorites();
        }
      }
    } catch (error) {
      console.error("Auth check error:", error);
    }
  };

  useEffect(() => {
    checkAuth();

    const interval = setInterval(checkAuth, 5000); // Check every 5 seconds
    
    return () => clearInterval(interval);
  }, []);

  // Fetch Events from Backend
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch(`${API_URL}/api/events`);
        if (!response.ok) throw new Error('Failed to fetch events');
        const data = await response.json();
        
        // Filter out past events based on date AND time
        const upcomingEvents = data.filter(event => 
          isEventUpcoming(event.date, event.time)
        );
        
        setEvents(upcomingEvents);
      } catch (error) {
        console.error("Error fetching events:", error);
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  // Fetch user favorites
  const fetchFavorites = async () => {
    try {
      const response = await fetch(`${API_URL}/api/users/favorites`, {
        credentials: 'include'
      });
      if (response.ok) {
        const data = await response.json();
        // Data is array of events (or {favorites: []} depending on backend)
        const favArray = Array.isArray(data) ? data : data.favorites || [];
        setFavorites(favArray.map(f => f._id || f));
      }
    } catch (error) {
      console.error("Favorites fetch error:", error);
    }
  };

  const toggleFavorite = async (eventId) => {
    if (!isLoggedIn) {
      setPendingAction({ type: 'favorite', eventId });
      setShowLoginPopup(true);
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/users/favorites/${eventId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      });
      
      if (response.ok) {
        // Refresh favorites list
        await fetchFavorites();
      }
    } catch (error) {
      console.error("Toggle favorite error:", error);
    }
  };

  const [searchTerm, setSearchTerm] = useState("");
  const [locationFilter, setLocationFilter] = useState(() => sessionStorage.getItem("userLocation") || "");
  const [priceFilter, setPriceFilter] = useState("all");
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const [sortBy, setSortBy] = useState("date");

  // Proximity
  const [userLocation, setUserLocation] = useState(null); // { lat, lng }
  const [radius, setRadius] = useState(5000); // Default radius (covers India mostly)

  // Auto-detect on load ONLY if location is not already known AND user hasn't opted out
  useEffect(() => {
    const optedOut = sessionStorage.getItem("locationOptedOut");
    if (!locationFilter && !optedOut) {
      handleLocationClick();
    }
  }, []);

  const handleLocationClick = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    navigator.geolocation.getCurrentPosition(async (position) => {
      const { latitude, longitude } = position.coords;
      setUserLocation({ lat: latitude, lng: longitude });

      try {
        const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
        const data = await response.json();

        // Format: "City, State"
        const city = data.address.city || data.address.town || data.address.village || data.address.county;
        const state = data.address.state;

        let detectedLocation = "";
        if (city && state) {
          detectedLocation = `${city}, ${state}`;
        } else if (state) {
          detectedLocation = state;
        }

        if (detectedLocation) {
          setLocationFilter(detectedLocation);
          sessionStorage.setItem("userLocation", detectedLocation); // Persist
          alert(`Found you in ${detectedLocation}`);
        } else {
          alert("Could not determine precise location");
        }
      } catch (error) {
        console.error("Geocoding error:", error);
      }
    }, (error) => {
      console.error("Location error:", error);
    });
  };

  const resetFilters = () => {
    setSearchTerm("");
    setLocationFilter("");
    sessionStorage.removeItem("userLocation");
    sessionStorage.setItem("locationOptedOut", "true"); // User decided to see all events
    setPriceFilter("all");
    setDateRange({ start: "", end: "" });
    setSortBy("date");
    setRadius(5000);
    setUserLocation(null);
  };

  const filteredEvents = events.filter(event => {
    // Search filter
    const matchesSearch = event.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.category?.toLowerCase().includes(searchTerm.toLowerCase());

    // Location filter with improved matching
    let matchesLocation = true;
    if (locationFilter) {
      const normalizedFilter = normalizeLocation(locationFilter);
      const normalizedEventLoc = normalizeLocation(event.location);
      
      // Check if either contains the other (bidirectional matching)
      matchesLocation = normalizedFilter.includes(normalizedEventLoc) || 
                       normalizedEventLoc.includes(normalizedFilter);
      
      // If still no match, try word-by-word comparison
      if (!matchesLocation) {
        const filterWords = normalizedFilter.split(' ').filter(word => word.length > 3);
        const eventWords = normalizedEventLoc.split(' ').filter(word => word.length > 3);
        
        matchesLocation = filterWords.some(word => normalizedEventLoc.includes(word)) ||
                         eventWords.some(word => normalizedFilter.includes(word));
      }
    }

    // Price filter
    let matchesPrice = true;
    if (priceFilter === 'free') matchesPrice = event.price === 0;
    if (priceFilter === 'paid') matchesPrice = event.price > 0;

    // Date filter (considering both date and time)
    let matchesDate = true;
    if (dateRange.start) {
      const startDateTime = new Date(`${dateRange.start}T00:00:00`);
      const eventDateTime = new Date(`${event.date}T${event.time || '00:00:00'}`);
      matchesDate = matchesDate && eventDateTime >= startDateTime;
    }
    if (dateRange.end) {
      const endDateTime = new Date(`${dateRange.end}T23:59:59`);
      const eventDateTime = new Date(`${event.date}T${event.time || '23:59:59'}`);
      matchesDate = matchesDate && eventDateTime <= endDateTime;
    }

    return matchesSearch && matchesLocation && matchesPrice && matchesDate;
  }).sort((a, b) => {
    // Sort by distance if user location is known and sortBy is 'distance'
    if (userLocation && sortBy === 'distance') {
      const distA = calculateDistance(userLocation.lat, userLocation.lng, a.lat, a.lng);
      const distB = calculateDistance(userLocation.lat, userLocation.lng, b.lat, b.lng);
      return distA - distB;
    }

    // Sort by price
    if (sortBy === 'priceLow') return a.price - b.price;
    if (sortBy === 'priceHigh') return b.price - a.price;
    
    // Default sort by date and time (chronological)
    const dateA = new Date(`${a.date}T${a.time || '00:00:00'}`);
    const dateB = new Date(`${b.date}T${b.time || '00:00:00'}`);
    return dateA - dateB;
  });

  const handleBookEvent = (eventId) => {
    if (isLoggedIn) {
      navigate(`/book/${eventId}`);
    } else {
      setPendingAction({ type: 'book', eventId });
      setShowLoginPopup(true);
    }
  };

  // Handle login success from popup
  const handleLoginSuccess = async () => {
    // Check if user is now logged in
    await checkAuth();
    
    if (isLoggedIn && pendingAction) {
      // Execute pending action
      if (pendingAction.type === 'book') {
        navigate(`/book/${pendingAction.eventId}`);
      } else if (pendingAction.type === 'favorite') {
        // Trigger favorite toggle after successful login
        setTimeout(async () => {
          try {
            const response = await fetch(`${API_URL}/api/users/favorites/${pendingAction.eventId}`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              credentials: 'include'
            });
            
            if (response.ok) {
              await fetchFavorites();
            }
          } catch (error) {
            console.error("Auto-favorite error:", error);
          }
        }, 500);
      }
      setPendingAction(null); // Clear pending action
    }
  };

  return (
    <div className="min-h-screen bg-[#ebe9e1] font-sans text-slate-900">
      <div className="w-full bg-slate-900 top-0 bottom-90 p-11.5"></div>
      {/* HEADER SECTION */}
      <div className="max-w-7xl mx-auto pt-24 px-4 md:px-8 lg:px-12 max-md:mx-3">
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4 tracking-tight">
          Explore <span className="text-[#702c2c]">Events</span>
        </h1>
        <p className="text-stone-600 text-lg max-w-2xl">
          Discover concerts, workshops, and meetups tailored for you.
          {!isLoggedIn && (
            <span className="block text-sm text-[#702c2c] font-medium mt-2">
              ⓘ Login to book tickets and save favorites
            </span>
          )}
        </p>
      </div>

      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8 pt-24 pb-12 px-4 md:px-8 max-md:mx-3">

        {/* SIDEBAR FILTERS (Left) */}
        <div className="w-full lg:w-1/4 shrink-0">
          <EventFilters
            searchTerm={searchTerm} setSearchTerm={setSearchTerm}
            locationFilter={locationFilter} setLocationFilter={setLocationFilter}
            priceFilter={priceFilter} setPriceFilter={setPriceFilter}
            dateRange={dateRange} setDateRange={setDateRange}
            sortBy={sortBy} setSortBy={setSortBy}
            resetFilters={resetFilters}
            handleLocationClick={handleLocationClick}
          />
          {userLocation && (
            <div className="mt-4 p-4 bg-indigo-50 rounded-xl border border-indigo-100 text-xs text-indigo-800">
              <p className="font-bold flex items-center gap-2">
                <FaLocationArrow /> Nearby Mode Active
              </p>
              <p className="mt-1">Showing events near <strong>{locationFilter}</strong></p>
            </div>
          )}
        </div>

        {/* EVENT GRID (Right) */}
        <div className="w-full lg:w-3/4">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <FaCalendarAlt className="text-[#702c2c]" />
              {filteredEvents.length > 0 ? `Showing ${filteredEvents.length} Events` : "No events found"}
            </h2>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="bg-white rounded-xl border border-stone-200 overflow-hidden animate-pulse">
                  <div className="h-44 bg-stone-100" />
                  <div className="p-4">
                    <div className="h-5 bg-stone-100 rounded-full mb-2" />
                    <div className="h-4 bg-stone-100 rounded-full mb-3 w-3/4" />
                    <div className="h-12 bg-stone-100 rounded-lg" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEvents.map((event) => {
                // Calculate distance if user location is known
                let distance = null;
                if (userLocation) {
                  distance = calculateDistance(userLocation.lat, userLocation.lng, event.lat, event.lng).toFixed(0);
                }

                const isFav = favorites.includes(event._id);

                return (
                  <motion.div
                    key={event._id}
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-md transition-shadow duration-200 ease-in hover:shadow-lg hover:shadow-slate-900"
                  >
                    {/* Image */}
                    <div className="relative h-44 overflow-hidden bg-stone-100">
                      <img
                        src={event.image}
                        alt={event.title}
                        loading="lazy"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80&w=1000";
                        }}
                      />
                      <span className="absolute top-2 left-2 bg-black/70 text-white text-[10px] px-2 py-0.5 rounded uppercase tracking-wide">
                        {event.category}
                      </span>
                      {/* Heart Icon */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(event._id);
                        }}
                        className="absolute top-2 right-2 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-colors"
                        title={isLoggedIn ? (isFav ? "Remove from favorites" : "Add to favorites") : "Login to save favorites"}
                      >
                        {isFav ? (
                          <FaHeart className="text-red-500" />
                        ) : (
                          <FaRegHeart className={isLoggedIn ? "text-gray-500 hover:text-red-500" : "text-gray-300"} />
                        )}
                      </button>
                    </div>

                    {/* Content */}
                    <div className="p-4">
                      <h3 className="text-base font-semibold text-slate-800 mb-1 line-clamp-1">{event.title}</h3>

                      <p className="text-stone-500 text-xs mb-3 flex items-center gap-1">
                        <FaMapMarkerAlt className="text-[10px]" /> {event.location}
                        {distance && <span className="ml-auto text-stone-400">({distance} km)</span>}
                      </p>

                      <p className="text-stone-500 text-sm mb-4 line-clamp-2">{event.description}</p>

                      <div className="flex items-center justify-between border-t border-stone-100 pt-3">
                        <div>
                          <p className="text-[10px] text-stone-400 uppercase">Date & Time</p>
                          <p className="text-xs font-medium text-slate-700">
                            {event.date} {event.time && `• ${event.time}`}
                          </p>
                        </div>
                        <p className="text-sm font-bold text-slate-800">
                          {event.price === 0 ? 'Free' : `₹${event.price}`}
                        </p>
                      </div>

                      <button
                        onClick={() => handleBookEvent(event._id)}
                        className={`w-full mt-4 py-2.5 text-sm font-medium rounded-lg transition-colors cursor-pointer ${
                          isLoggedIn 
                            ? 'bg-slate-900 text-white hover:bg-slate-800' 
                            : 'bg-stone-200 text-stone-600 hover:bg-stone-300'
                        }`}
                        title={isLoggedIn ? "Book this event" : "Login to book tickets"}
                      >
                        {isLoggedIn ? 'Buy Ticket' : 'Login to Book'}
                      </button>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          )}

          {!loading && filteredEvents.length === 0 && (
            <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-stone-200">
              <h3 className="text-xl font-bold text-slate-800 mb-2">No events found</h3>
              <p className="text-stone-500">Try adjusting your filters.</p>
            </div>
          )}
        </div>
      </div>

      {/* Login/Signup Popup */}
      <LoginSignupPopup 
        isOpen={showLoginPopup}
        onClose={() => {
          setShowLoginPopup(false);
          setPendingAction(null); // Clear any pending action on close
        }}
        onLoginSuccess={handleLoginSuccess}
      />
    </div>
  );
};

export default Events;
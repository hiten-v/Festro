import React, { useState, useEffect } from 'react';
import Toast from '../component/Toast';
const Experience = () => {
  const [experiences, setExperiences] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);

  const [formData, setFormData] = useState({
    eventName: '',
    eventDate: '',
    eventTime: '',
    description: '',
    image: null
  });

    // Check authentication status
    const checkAuth = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/auth/check', {
          credentials: 'include' // Important: sends cookies
        });
        
        const data = await response.json();
        
        if (data.isAuthenticated) {
          setIsLoggedIn(true);
          // Fetch user data
          const userResponse = await fetch('http://localhost:5000/api/auth/me', {
            credentials: 'include'
          });
          
          if (userResponse.ok) {
            const userData = await userResponse.json();
            setUserData(userData.user);
          }
        } else {
          setIsLoggedIn(false);
          setUserData(null);
        }
      } catch (error) {
        console.error('Auth check error:', error);
        setIsLoggedIn(false);
      } finally {
        setLoading(false);
      }
    };
  
    // Check auth on mount and when popup closes
    useEffect(() => {
      checkAuth();
  
      const interval = setInterval(checkAuth, 3000); // Check every 3 seconds
      
      return () => clearInterval(interval);
    }, []);


  useEffect(() => {
    fetchExperiences();
    fetchEvents();
  }, []);

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

  const fetchExperiences = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/experiences');
      const data = await res.json();
      setExperiences(data);
    } catch (err) {
      console.error("Fetch experiences error:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchEvents = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/events');
      const data = await res.json();
      setEvents(data);
    } catch (err) {
      console.error("Fetch events error:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isLoggedIn) {
      showToast("Login required!","error");
      return;
    }

    if (submitting) return;
    
    // Check if user has a name
    if (!userData) {
      showToast("Logged in user data incomplete !","error");
      return;
    }

    setSubmitting(true);

    try {
      const data = new FormData();
      data.append('userName', userData.name); // Fixed: using userData.name instead of undefined userName
      data.append('eventName', formData.eventName);
      data.append('eventDate', formData.eventDate);
      data.append('eventTime', formData.eventTime);
      data.append('description', formData.description);
      if (formData.image) {
        data.append('image', formData.image);
      }

      const res = await fetch('http://localhost:5000/api/experiences', {
        method: 'POST',
        credentials: 'include', // Added to send cookies for authentication
        body: data
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || 'Failed to submit');
      }
      showToast("Experience shared successfully!","success");
      setFormData({
        eventName: '',
        eventDate: '',
        eventTime: '',
        description: '',
        image: null
      });
      fetchExperiences();
    } catch (err) {
      console.error("Submit error:", err);
      showToast(err.message || 'Failed to share experience. Please try again.',"error");
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    try {
      const options = { year: 'numeric', month: 'short', day: 'numeric' };
      return new Date(dateStr).toLocaleDateString('en-US', options);
    } catch (err) {
      return 'Invalid date';
    }
  };

  const timeAgo = (date) => {
    if (!date) return 'Recently';
    try {
      const now = new Date();
      const diff = now - new Date(date);
      const mins = Math.floor(diff / 60000);
      if (mins < 60) return `${mins}m ago`;
      const hrs = Math.floor(mins / 60);
      if (hrs < 24) return `${hrs}h ago`;
      const days = Math.floor(hrs / 24);
      return `${days}d ago`;
    } catch (err) {
      return 'Recently';
    }
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({ ...formData, image: e.target.files[0] });
    }
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.charAt(0).toUpperCase();
  };

  return (
    <div className="min-h-screen bg-[#ebe9e1] ">
      <Toast toast={toast} setToast={setToast} />
      <div className="w-full bg-slate-900 top-0 bottom-90 p-11.5"></div>
      <div className="max-w-6xl mx-auto pt-24 pb-12 px-4 md:px-8 max-md:mx-3">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900">Festro <span className="text-[#702c2c]">Blog</span></h1>
          <p className="text-stone-600 text-lg pt-4">Share your event memories with the community</p>
        </div>

        {/* Two Column Layout */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left: Form */}
          <div className="w-full lg:w-1/3">
            <div className="bg-white rounded-lg border border-gray-200 p-4 sticky top-28">
              <h3 className="font-semibold text-gray-800 mb-4">Share Your Experience</h3>

              {!isLoggedIn ? (
                <div className="text-center py-6">
                  <p className="text-gray-500 text-sm mb-3">Please login to share your experience</p>
                  {/* <button 
                    onClick={() => window.dispatchEvent(new Event('open-auth-popup'))}
                    className="px-4 py-2 bg-[#702c2c] text-white rounded text-sm hover:bg-[#5a2323]"
                  >
                    Login / Sign Up
                  </button> */}
                </div>
              ) : (

                <form onSubmit={handleSubmit} className="space-y-3"> 
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Your Name</label>
                    <input 
                      type="text"
                      className="w-full px-2 py-2 bg-stone-50 border border-stone-200 rounded-lg focus:ring-2 focus:ring-[#702c2c]/20 focus:border-[#702c2c] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Event Attended *</label>
                    <select 
                      required 
                      className="w-full px-2 py-2 bg-stone-50 border border-stone-200 rounded-lg focus:ring-2 focus:ring-[#702c2c]/20 focus:border-[#702c2c] outline-none"
                      
                      value={formData.eventName}
                      onChange={(e) => setFormData({ ...formData, eventName: e.target.value })}
                    >
                      <option value="">Select an event</option>
                      {events.map((event) => (
                        <option key={event._id} value={event.title}>
                          {event.title}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Date *</label>
                      <input 
                        required 
                        type="date" 
                        className="w-full px-2 py-2 bg-stone-50 border border-stone-200 rounded-lg focus:ring-2 focus:ring-[#702c2c]/20 focus:border-[#702c2c] outline-none"
                  
                        value={formData.eventDate} 
                        onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })} 
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Time *</label>
                      <input 
                        required 
                        type="time" 
                        className="w-full px-2 py-2 bg-stone-50 border border-stone-200 rounded-lg focus:ring-2 focus:ring-[#702c2c]/20 focus:border-[#702c2c] outline-none"
                        value={formData.eventTime} 
                        onChange={(e) => setFormData({ ...formData, eventTime: e.target.value })} 
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Your Experience *</label>
                    <textarea 
                      required 
                      rows="3" 
                      className="w-full px-2 py-2 bg-stone-50 border border-stone-200 rounded-lg focus:ring-2 focus:ring-[#702c2c]/20 focus:border-[#702c2c] outline-none"
                      placeholder="Share what you loved..."
                      value={formData.description} 
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })} 
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Photo (optional)</label>
                    <div className="flex items-center gap-2">
                      <input 
                        type="file" 
                        id="expImg" 
                        accept="image/*" 
                        className="hidden"
                        onChange={handleImageChange} 
                      />
                      <label 
                        htmlFor="expImg" 
                        className="px-3 py-2 bg-gray-200 text-gray-700 rounded text-sm cursor-pointer hover:bg-gray-300"
                      >
                        Choose Photo
                      </label>
                      <span className="text-xs text-gray-500 truncate flex-1">
                        {formData.image ? formData.image.name : 'No photo chosen'}
                      </span>
                    </div>
                  </div>
                  <button 
                    type="submit" 
                    disabled={submitting}
                    className={`w-full py-2 rounded font-medium text-sm ${submitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#702c2c] hover:bg-[#5a2323]'} text-white`}
                  >
                    {submitting ? 'Posting...' : 'Post Experience'}
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Right: Posts */}
          <div className="w-full lg:w-2/3">
            {loading ? (
              <p className="text-center text-gray-500 py-10">Loading experiences...</p>
            ) : experiences.length === 0 ? (
              <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
                <p className="text-gray-500">No experiences shared yet.</p>
                <p className="text-gray-400 text-sm mt-1">Be the first to share!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {experiences.map((exp) => (
                  <div key={exp._id} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                    {/* Post Header */}
                    <div className="p-4 border-b border-gray-100">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#702c2c] rounded-full flex items-center justify-center text-white font-bold">
                          {getInitials(exp.userName)}
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-gray-800 text-sm">
                            {exp.userName || 'Anonymous User'}
                          </p>
                          <p className="text-xs text-gray-500">
                            attended <span className="font-medium text-gray-700">{exp.eventName}</span>
                          </p>
                        </div>
                        <span className="text-xs text-gray-400">{timeAgo(exp.createdAt)}</span>
                      </div>
                    </div>

                    {/* Event Info */}
                    <div className="px-4 py-2 bg-gray-50 text-xs text-gray-600 flex flex-wrap gap-4">
                      <span>📅 {formatDate(exp.eventDate)}</span>
                      <span>🕐 {exp.eventTime || 'N/A'}</span>
                    </div>

                    {/* Image */}
                    {exp.image && (
                      <div className="w-full">
                        <img 
                          src={exp.image.startsWith('http') ? exp.image : `http://localhost:5000${exp.image}`} 
                          alt="Experience" 
                          className="w-full max-h-80 object-cover" 
                          onError={(e) => {
                            e.target.style.display = 'none';
                          }}
                        />
                      </div>
                    )}

                    {/* Description */}
                    <div className="p-4">
                      <p className="text-gray-800 text-sm">{exp.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Experience;
// import React, { useState, useEffect } from 'react';
// import Toast from '../component/Toast';
// const Experience = () => {
//   const [experiences, setExperiences] = useState([]);
//   const [events, setEvents] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [submitting, setSubmitting] = useState(false);
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const [userData, setUserData] = useState(null);

//   const [formData, setFormData] = useState({
//     eventName: '',
//     eventDate: '',
//     eventTime: '',
//     description: '',
//     image: null
//   });

//     // Check authentication status
//     const checkAuth = async () => {
//       try {
//         const response = await fetch('http://localhost:5000/api/auth/check', {
//           credentials: 'include' // Important: sends cookies
//         });
        
//         const data = await response.json();
        
//         if (data.isAuthenticated) {
//           setIsLoggedIn(true);
//           // Fetch user data
//           const userResponse = await fetch('http://localhost:5000/api/auth/me', {
//             credentials: 'include'
//           });
          
//           if (userResponse.ok) {
//             const userData = await userResponse.json();
//             setUserData(userData.user);
//           }
//         } else {
//           setIsLoggedIn(false);
//           setUserData(null);
//         }
//       } catch (error) {
//         console.error('Auth check error:', error);
//         setIsLoggedIn(false);
//       } finally {
//         setLoading(false);
//       }
//     };
  
//     // Check auth on mount and when popup closes
//     useEffect(() => {
//       checkAuth();
  
//       const interval = setInterval(checkAuth, 3000); // Check every 3 seconds
      
//       return () => clearInterval(interval);
//     }, []);


//   useEffect(() => {
//     fetchExperiences();
//     fetchEvents();
//   }, []);

//   const [toast, setToast] = useState({
//     show: false,
//     message: "",
//     type: "success",
//   });

//   const showToast = (message, type = "success") => {
//     setToast({ show: true, message, type });
//     setTimeout(() => {
//       setToast((prev) => ({ ...prev, show: false }));
//     }, 3000);
//   };

//   const fetchExperiences = async () => {
//     try {
//       const res = await fetch('http://localhost:5000/api/experiences');
//       const data = await res.json();
//       setExperiences(data);
//     } catch (err) {
//       console.error("Fetch experiences error:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchEvents = async () => {
//     try {
//       const res = await fetch('http://localhost:5000/api/events');
//       const data = await res.json();
//       setEvents(data);
//     } catch (err) {
//       console.error("Fetch events error:", err);
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!isLoggedIn) {
//       showToast("Login required!","error");
//       return;
//     }

//     if (submitting) return;
    
//     // Check if user has a name
//     if (!userData) {
//       showToast("Logged in user data incomplete !","error");
//       return;
//     }

//     setSubmitting(true);

//     try {
//       const data = new FormData();
//       data.append('userName', userData.name); // Fixed: using userData.name instead of undefined userName
//       data.append('eventName', formData.eventName);
//       data.append('eventDate', formData.eventDate);
//       data.append('eventTime', formData.eventTime);
//       data.append('description', formData.description);
//       if (formData.image) {
//         data.append('image', formData.image);
//       }

//       const res = await fetch('http://localhost:5000/api/experiences', {
//         method: 'POST',
//         credentials: 'include', // Added to send cookies for authentication
//         body: data
//       });

//       if (!res.ok) {
//         const errData = await res.json();
//         throw new Error(errData.message || 'Failed to submit');
//       }
//       showToast("Experience shared successfully!","success");
//       setFormData({
//         eventName: '',
//         eventDate: '',
//         eventTime: '',
//         description: '',
//         image: null
//       });
//       fetchExperiences();
//     } catch (err) {
//       console.error("Submit error:", err);
//       showToast(err.message || 'Failed to share experience. Please try again.',"error");
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   const formatDate = (dateStr) => {
//     if (!dateStr) return 'N/A';
//     try {
//       const options = { year: 'numeric', month: 'short', day: 'numeric' };
//       return new Date(dateStr).toLocaleDateString('en-US', options);
//     } catch (err) {
//       return 'Invalid date';
//     }
//   };

//   const timeAgo = (date) => {
//     if (!date) return 'Recently';
//     try {
//       const now = new Date();
//       const diff = now - new Date(date);
//       const mins = Math.floor(diff / 60000);
//       if (mins < 60) return `${mins}m ago`;
//       const hrs = Math.floor(mins / 60);
//       if (hrs < 24) return `${hrs}h ago`;
//       const days = Math.floor(hrs / 24);
//       return `${days}d ago`;
//     } catch (err) {
//       return 'Recently';
//     }
//   };

//   const handleImageChange = (e) => {
//     if (e.target.files && e.target.files[0]) {
//       setFormData({ ...formData, image: e.target.files[0] });
//     }
//   };

//   const getInitials = (name) => {
//     if (!name) return 'U';
//     return name.charAt(0).toUpperCase();
//   };

//   return (
//     <div className="min-h-screen bg-[#ebe9e1] ">
//       <Toast toast={toast} setToast={setToast} />
//       <div className="w-full bg-slate-900 top-0 bottom-90 p-11.5"></div>
//       <div className="max-w-6xl mx-auto pt-24 pb-12 px-4 md:px-8 max-md:mx-3">
//         {/* Header */}
//         <div className="mb-6">
//           <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900">Festro <span className="text-[#702c2c]">Blog</span></h1>
//           <p className="text-stone-600 text-lg pt-4">Share your event memories with the community</p>
//         </div>

//         {/* Two Column Layout */}
//         <div className="flex flex-col lg:flex-row gap-6">
//           {/* Left: Form */}
//           <div className="w-full lg:w-1/3">
//             <div className="bg-white rounded-lg border border-gray-200 p-4 sticky top-28">
//               <h3 className="font-semibold text-gray-800 mb-4">Share Your Experience</h3>

//               {!isLoggedIn ? (
//                 <div className="text-center py-6">
//                   <p className="text-gray-500 text-sm mb-3">Please login to share your experience</p>
//                   {/* <button 
//                     onClick={() => window.dispatchEvent(new Event('open-auth-popup'))}
//                     className="px-4 py-2 bg-[#702c2c] text-white rounded text-sm hover:bg-[#5a2323]"
//                   >
//                     Login / Sign Up
//                   </button> */}
//                 </div>
//               ) : (

//                 <form onSubmit={handleSubmit} className="space-y-3"> 
//                   <div>
//                     <label className="block text-xs text-gray-600 mb-1">Your Name</label>
//                     <input 
//                       type="text"
//                       className="w-full px-2 py-2 bg-stone-50 border border-stone-200 rounded-lg focus:ring-2 focus:ring-[#702c2c]/20 focus:border-[#702c2c] outline-none"
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-xs text-gray-600 mb-1">Event Attended *</label>
//                     <select 
//                       required 
//                       className="w-full px-2 py-2 bg-stone-50 border border-stone-200 rounded-lg focus:ring-2 focus:ring-[#702c2c]/20 focus:border-[#702c2c] outline-none"
                      
//                       value={formData.eventName}
//                       onChange={(e) => setFormData({ ...formData, eventName: e.target.value })}
//                     >
//                       <option value="">Select an event</option>
//                       {events.map((event) => (
//                         <option key={event._id} value={event.title}>
//                           {event.title}
//                         </option>
//                       ))}
//                     </select>
//                   </div>
//                   <div className="grid grid-cols-2 gap-2">
//                     <div>
//                       <label className="block text-xs text-gray-600 mb-1">Date *</label>
//                       <input 
//                         required 
//                         type="date" 
//                         className="w-full px-2 py-2 bg-stone-50 border border-stone-200 rounded-lg focus:ring-2 focus:ring-[#702c2c]/20 focus:border-[#702c2c] outline-none"
                  
//                         value={formData.eventDate} 
//                         onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })} 
//                       />
//                     </div>
//                     <div>
//                       <label className="block text-xs text-gray-600 mb-1">Time *</label>
//                       <input 
//                         required 
//                         type="time" 
//                         className="w-full px-2 py-2 bg-stone-50 border border-stone-200 rounded-lg focus:ring-2 focus:ring-[#702c2c]/20 focus:border-[#702c2c] outline-none"
//                         value={formData.eventTime} 
//                         onChange={(e) => setFormData({ ...formData, eventTime: e.target.value })} 
//                       />
//                     </div>
//                   </div>
//                   <div>
//                     <label className="block text-xs text-gray-600 mb-1">Your Experience *</label>
//                     <textarea 
//                       required 
//                       rows="3" 
//                       className="w-full px-2 py-2 bg-stone-50 border border-stone-200 rounded-lg focus:ring-2 focus:ring-[#702c2c]/20 focus:border-[#702c2c] outline-none"
//                       placeholder="Share what you loved..."
//                       value={formData.description} 
//                       onChange={(e) => setFormData({ ...formData, description: e.target.value })} 
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-xs text-gray-600 mb-1">Photo (optional)</label>
//                     <div className="flex items-center gap-2">
//                       <input 
//                         type="file" 
//                         id="expImg" 
//                         accept="image/*" 
//                         className="hidden"
//                         onChange={handleImageChange} 
//                       />
//                       <label 
//                         htmlFor="expImg" 
//                         className="px-3 py-2 bg-gray-200 text-gray-700 rounded text-sm cursor-pointer hover:bg-gray-300"
//                       >
//                         Choose Photo
//                       </label>
//                       <span className="text-xs text-gray-500 truncate flex-1">
//                         {formData.image ? formData.image.name : 'No photo chosen'}
//                       </span>
//                     </div>
//                   </div>
//                   <button 
//                     type="submit" 
//                     disabled={submitting}
//                     className={`w-full py-2 rounded font-medium text-sm ${submitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#702c2c] hover:bg-[#5a2323]'} text-white`}
//                   >
//                     {submitting ? 'Posting...' : 'Post Experience'}
//                   </button>
//                 </form>
//               )}
//             </div>
//           </div>

//           {/* Right: Posts */}
//           <div className="w-full lg:w-2/3">
//             {loading ? (
//               <p className="text-center text-gray-500 py-10">Loading experiences...</p>
//             ) : experiences.length === 0 ? (
//               <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
//                 <p className="text-gray-500">No experiences shared yet.</p>
//                 <p className="text-gray-400 text-sm mt-1">Be the first to share!</p>
//               </div>
//             ) : (
//               <div className="space-y-4">
//                 {experiences.map((exp) => (
//                   <div key={exp._id} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
//                     {/* Post Header */}
//                     <div className="p-4 border-b border-gray-100">
//                       <div className="flex items-center gap-3">
//                         <div className="w-10 h-10 bg-[#702c2c] rounded-full flex items-center justify-center text-white font-bold">
//                           {getInitials(exp.userName)}
//                         </div>
//                         <div className="flex-1">
//                           <p className="font-semibold text-gray-800 text-sm">
//                             {exp.userName || 'Anonymous User'}
//                           </p>
//                           <p className="text-xs text-gray-500">
//                             attended <span className="font-medium text-gray-700">{exp.eventName}</span>
//                           </p>
//                         </div>
//                         <span className="text-xs text-gray-400">{timeAgo(exp.createdAt)}</span>
//                       </div>
//                     </div>

//                     {/* Event Info */}
//                     <div className="px-4 py-2 bg-gray-50 text-xs text-gray-600 flex flex-wrap gap-4">
//                       <span>📅 {formatDate(exp.eventDate)}</span>
//                       <span>🕐 {exp.eventTime || 'N/A'}</span>
//                     </div>

//                     {/* Image */}
//                     {exp.image && (
//                       <div className="w-full">
//                         <img 
//                           src={exp.image.startsWith('http') ? exp.image : `http://localhost:5000${exp.image}`} 
//                           alt="Experience" 
//                           className="w-full max-h-80 object-cover" 
//                           onError={(e) => {
//                             e.target.style.display = 'none';
//                           }}
//                         />
//                       </div>
//                     )}

//                     {/* Description */}
//                     <div className="p-4">
//                       <p className="text-gray-800 text-sm">{exp.description}</p>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Experience;


import React, { useState, useEffect } from 'react';
import { FaImage, FaCalendarAlt, FaClock } from 'react-icons/fa';
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
    description: '',
    image: null
  });

  // Check authentication status
  const checkAuth = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/check', {
        credentials: 'include'
      });
      
      const data = await response.json();
      
      if (data.isAuthenticated) {
        setIsLoggedIn(true);
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

  useEffect(() => {
    checkAuth();
    const interval = setInterval(checkAuth, 1000);
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
      showToast("Login required!", "error");
      return;
    }

    if (submitting) return;
    
    if (!userData) {
      showToast("Logged in user data incomplete!", "error");
      return;
    }

    setSubmitting(true);

    try {
      const data = new FormData();
      data.append('userName', userData.name);
      data.append('eventName', formData.eventName);
      data.append('description', formData.description);
      // Date/time will be set automatically on the server (current timestamp)
      if (formData.image) {
        data.append('image', formData.image);
      }

      const res = await fetch('http://localhost:5000/api/experiences', {
        method: 'POST',
        credentials: 'include',
        body: data
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || 'Failed to submit');
      }
      
      showToast("Experience shared successfully!", "success");
      setFormData({
        eventName: '',
        description: '',
        image: null
      });
      fetchExperiences();
    } catch (err) {
      console.error("Submit error:", err);
      showToast(err.message || 'Failed to share experience. Please try again.', "error");
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

  const formatTime = (dateStr) => {
    if (!dateStr) return 'N/A';
    try {
      const options = { hour: '2-digit', minute: '2-digit' };
      return new Date(dateStr).toLocaleTimeString('en-US', options);
    } catch (err) {
      return 'Invalid time';
    }
  };

  const timeAgo = (date) => {
    if (!date) return 'Just now';
    try {
      const now = new Date();
      const diff = now - new Date(date);
      const mins = Math.floor(diff / 60000);
      if (mins < 1) return 'Just now';
      if (mins < 60) return `${mins}m ago`;
      const hrs = Math.floor(mins / 60);
      if (hrs < 24) return `${hrs}h ago`;
      const days = Math.floor(hrs / 24);
      if (days < 7) return `${days}d ago`;
      const weeks = Math.floor(days / 7);
      if (weeks < 4) return `${weeks}w ago`;
      const months = Math.floor(days / 30);
      if (months < 12) return `${months}mo ago`;
      const years = Math.floor(days / 365);
      return `${years}y ago`;
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
    <div className="min-h-screen bg-[#ebe9e1]">
      <Toast toast={toast} setToast={setToast} />
      <div className="w-full bg-slate-900 top-0 bottom-90 p-11.5"></div>
      
      <div className="max-w-6xl mx-auto pt-24 pb-12 px-4 md:px-8 max-md:mx-3">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-2">
            Festro <span className="text-[#702c2c]">Blog</span>
          </h1>
          <p className="text-stone-600 text-lg">
            Share your event memories with the community
          </p>
        </div>

        {/* Two Column Layout */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left: Form */}
          <div className="w-full lg:w-2/5">
            <div className="bg-white rounded-2xl border border-stone-200 p-6 sticky top-28 shadow-sm hover:shadow-md transition-shadow duration-200">
              <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                Share Your Experience
              </h3>

              {!isLoggedIn ? (
                <div className="text-center py-8 rounded-xl bg-stone-50 border border-stone-200">
                  <div className="w-16 h-16 bg-[#702c2c]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  </div>
                  <p className="text-gray-600 mb-4">Please login to share your experience</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Your Name
                    </label>
                    <div className="relative">
                      <input 
                        type="text"
                        value={userData?.name || ''}
                        readOnly
                        className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl 
                          text-slate-700 font-medium cursor-default"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Event Attended *
                    </label>
                    <div className="relative">
                      <select 
                        required 
                        className="w-full px-4 py-3 bg-white border border-stone-200 rounded-xl 
                          focus:ring-2 focus:ring-[#702c2c]/20 focus:border-[#702c2c] outline-none
                          appearance-none cursor-pointer"
                        value={formData.eventName}
                        onChange={(e) => setFormData({ ...formData, eventName: e.target.value })}
                      >
                        <option value="" className="text-stone-400">Select an event</option>
                        {events.map((event) => (
                          <option key={event._id} value={event.title} className="text-slate-700">
                            {event.title}
                          </option>
                        ))}
                      </select>
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                        <svg className="w-5 h-5 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                        </svg>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Your Experience *
                    </label>
                    <textarea 
                      required 
                      rows="4" 
                      className="w-full px-4 py-3 bg-white border border-stone-200 rounded-xl 
                        focus:ring-2 focus:ring-[#702c2c]/20 focus:border-[#702c2c] outline-none
                        resize-none"
                      placeholder="Share what you loved about the event..."
                      value={formData.description} 
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })} 
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-1">
                      <FaImage className="text-xs" /> Photo (optional)
                    </label>
                    <div className="flex items-center gap-3">
                      <input 
                        type="file" 
                        id="expImg" 
                        accept="image/*" 
                        className="hidden"
                        onChange={handleImageChange} 
                      />
                      <label 
                        htmlFor="expImg" 
                        className="px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl 
                          text-slate-700 text-sm font-medium cursor-pointer hover:bg-stone-100 
                          transition-colors flex items-center gap-2"
                      >
                        <FaImage className="text-stone-400" />
                        Choose Photo
                      </label>
                      <span className="text-sm text-stone-500 truncate flex-1">
                        {formData.image ? formData.image.name : 'No photo chosen'}
                      </span>
                      {formData.image && (
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, image: null })}
                          className="text-xs text-red-600 hover:text-red-800"
                        >
                          Clear
                        </button>
                      )}
                    </div>
                  </div>

                  <button 
                    type="submit" 
                    disabled={submitting}
                    className={`w-full py-3.5 rounded-xl font-medium text-sm transition-all duration-200
                      ${submitting 
                        ? 'bg-stone-400 cursor-not-allowed' 
                        : 'bg-[#702c2c] hover:bg-[#5a2323] hover:shadow-lg'} 
                      text-white flex items-center justify-center gap-2`}
                  >
                    {submitting ? 'Posting...' : 'Share Experience'}
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Right: Posts */}
          <div className="w-full lg:w-3/5">
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((_, idx) => (
                  <div key={idx} className="bg-white rounded-2xl border border-stone-200 p-6 animate-pulse">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-stone-200 rounded-full"></div>
                      <div className="flex-1">
                        <div className="h-4 bg-stone-200 rounded-full w-1/4 mb-2"></div>
                        <div className="h-3 bg-stone-200 rounded-full w-1/2"></div>
                      </div>
                    </div>
                    <div className="h-32 bg-stone-200 rounded-xl mb-3"></div>
                    <div className="space-y-2">
                      <div className="h-3 bg-stone-200 rounded-full"></div>
                      <div className="h-3 bg-stone-200 rounded-full w-5/6"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : experiences.length === 0 ? (
              <div className="bg-white rounded-2xl border-2 border-dashed border-stone-300 p-12 text-center">
                <h3 className="text-xl font-bold text-slate-800 mb-2">No experiences yet</h3>
                <p className="text-stone-500 mb-6">Be the first to share your event experience!</p>
              </div>
            ) : (
              <div className="space-y-6">
                {experiences.map((exp) => (
                  <div key={exp._id} className="bg-white rounded-2xl border border-stone-200 overflow-hidden 
                    hover:shadow-md transition-shadow duration-200">
                    
                    {/* Post Header */}
                    <div className="p-6 border-b border-stone-100">
                      <div className="flex items-start gap-4">
                        <div className="w-14 h-14 bg-linear-to-br from-[#702c2c] to-[#5a2323] 
                          rounded-full flex items-center justify-center text-white font-bold text-xl 
                          shadow-md">
                          {getInitials(exp.userName)}
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-bold text-slate-800 text-lg">
                                {exp.userName || 'Anonymous User'}
                              </h4>
                              <p className="text-sm text-stone-600 mt-1">
                                Event: <span className="font-semibold text-[#702c2c]">{exp.eventName}</span>
                              </p>
                            </div>
                            <span className="text-xs text-stone-500 bg-stone-100 px-3 py-1 rounded-full">
                              {timeAgo(exp.createdAt)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Posting Date/Time */}
                    <div className="px-6 py-4 bg-linear-to-r from-stone-50 to-white flex items-center gap-6">
                      <div className="flex items-center gap-2">
                        <FaCalendarAlt className="text-stone-400 text-sm" />
                        <span className="text-sm text-slate-700 font-medium">
                          {formatDate(exp.createdAt)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FaClock className="text-stone-400 text-sm" />
                        <span className="text-sm text-slate-700 font-medium">
                          {formatTime(exp.createdAt)}
                        </span>
                      </div>
                    </div>

                    {/* Image */}
                    {exp.image && (
                      <div className="w-full">
                        <img 
                          src={exp.image.startsWith('http') ? exp.image : `http://localhost:5000${exp.image}`} 
                          alt="Experience" 
                          className="w-full max-h-96 object-cover" 
                          onError={(e) => {
                            e.target.style.display = 'none';
                          }}
                        />
                      </div>
                    )}

                    {/* Description */}
                    <div className="p-6">
                      <p className="text-slate-700 leading-relaxed">{exp.description}</p>
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
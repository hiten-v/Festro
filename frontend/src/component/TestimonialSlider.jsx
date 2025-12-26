// import { useState } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { ChevronLeft, ChevronRight, Star } from "lucide-react";
// export default function TestimonialSlider() {
//   const testimonials = [
//     {
//       name: "Aarav Sharma",
//       role: "Corporate Client",
//       rating: 5,
//       img: "https://randomuser.me/api/portraits/men/32.jpg",
//       text: "Amazing experience! They handled everything perfectly. The team was super professional.",
//     },
//     {
//       name: "Isha Mehta",
//       role: "Bride",
//       rating: 5,
//       img: "https://randomuser.me/api/portraits/women/45.jpg",
//       text: "Our wedding was a huge success thanks to their flawless planning and elegant decor.",
//     },
//     {
//       name: "Rohan Patel",
//       role: "Startup Founder",
//       rating: 4,
//       img: "https://randomuser.me/api/portraits/men/21.jpg",
//       text: "Professional and attentive service from start to finish. Highly recommended!",
//     },
//     {
//       name: "Sneha Nair",
//       role: "Music Festival Organizer",
//       rating: 5,
//       img: "https://randomuser.me/api/portraits/women/12.jpg",
//       text: "They exceeded our expectations. The event flow was smooth and perfectly timed.",
//     },
//     {
//       name: "Vikram Singh",
//       role: "Event Sponsor",
//       rating: 4,
//       img: "https://randomuser.me/api/portraits/men/55.jpg",
//       text: "Very smooth execution and great communication throughout the event.",
//     },
//     {
//       name: "Priya Desai",
//       role: "Fashion Show Host",
//       rating: 5,
//       img: "https://randomuser.me/api/portraits/women/68.jpg",
//       text: "Stunning stage setup and lighting! Truly made the event memorable.",
//     },
//     {
//       name: "Karan Sen",
//       role: "Film Festival Director",
//       rating: 5,
//       img: "https://randomuser.me/api/portraits/men/69.jpg",
//       text: "Their attention to detail and creativity brought our vision to life flawlessly.",
//     },
//     {
//       name: "Anjali Rao",
//       role: "Charity Event Coordinator",
//       rating: 4,
//       img: "https://randomuser.me/api/portraits/women/69.jpg",
//       text: "The team was compassionate and efficient, making our charity event a great success.",
//     },
//     {
//       name: "Devansh Gupta",
//       role: "Tech Conference Speaker",
//       rating: 5,
//       img: "https://randomuser.me/api/portraits/men/75.jpg",
//       text: "Impressive organization and top-notch facilities. Looking forward to the next one!",   
//     }
//   ];

//   const ITEMS_PER_PAGE = 3;
//   const [page, setPage] = useState(0);
//   const totalPages = Math.ceil(testimonials.length / ITEMS_PER_PAGE);

//   const nextPage = () => page < totalPages - 1 && setPage(page + 1);
//   const prevPage = () => page > 0 && setPage(page - 1);

//   const current = testimonials.slice(
//     page * ITEMS_PER_PAGE,
//     page * ITEMS_PER_PAGE + ITEMS_PER_PAGE
//   );

//   return (
//     <section className="py-20 px-6 bg-gray-200">
//       <h2 className="text-4xl font-bold text-center mb-12">What Clients Say</h2>

//       <motion.div
//               initial={{ opacity: 0, y: 80 }}
//               whileInView={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.7 , ease: "easeOut" }}
//             >
//       <div className="relative max-w-6xl mx-auto">

//         {/* LEFT ARROW */}
//         {page > 0 && (
//           <button
//             className="absolute left-0 top-1/2 -translate-y-1/2 bg-white shadow-lg p-3 m-3 rounded-full hover:bg-gray-100 z-20"
//             onClick={prevPage}
//           >
//             <ChevronLeft size={28} />
//           </button>
//         )}

//         {/* RIGHT ARROW */}
//         {page < totalPages - 1 && (
//           <button
//             className="absolute right-0 top-1/2 -translate-y-1/2 bg-white shadow-lg p-3 m-3 rounded-full hover:bg-gray-100 z-20"
//             onClick={nextPage}
//           >
//             <ChevronRight size={28} />
//           </button>
//         )}

//         <div className="p-10 m-10 bg-slate-900 shadow-xl rounded-xl max-md:m-0">
//           <AnimatePresence mode="wait">
//             <motion.div
//               key={page}
//               initial={{ opacity: 0, x: 80 }}
//               animate={{ opacity: 1, x: 0 }}
//               exit={{ opacity: 0, x: -80 }}
//               transition={{ duration: 0.5 }}
//               className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12"
//             >
//               {current.map((item, index) => (
//                 <div
//                   key={index}
//                   className="p-8 bg-[#654242ac] shadow-lg rounded-xl border border-gray-100"
//                 >
//                   {/* Avatar */}
//                   <img
//                     src={item.img}
//                     className="w-20 h-20 rounded-full mx-auto object-cover shadow-md"
//                   />

//                   {/* Name + Role */}
//                   <h3 className="text-xl font-semibold text-center mt-4 text-gray-200">
//                     {item.name}
//                   </h3>
//                   <p className="text-center text-gray-400 text-sm">
//                     {item.role}
//                   </p>

//                   {/* Stars */}
//                   <div className="flex justify-center gap-1 mt-3">
//                     {Array.from({ length: item.rating }).map((_, i) => (
//                       <Star key={i} size={20} className="text-slate-300 fill-slate-300" />
//                     ))}
//                   </div>

//                   {/* Testimonial Text */}
//                   <p className="text-center mt-5 italic text-gray-200">
//                     "{item.text}"
//                   </p>
//                 </div>
//               ))}
//             </motion.div>
//           </AnimatePresence>
//         </div>
//       </div>
//       </motion.div>
//     </section>

//   );
// }

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Star, User, Calendar, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";
const TestimonialSlider = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const ITEMS_PER_PAGE = 3;
  const [page, setPage] = useState(0);
  const totalPages = Math.ceil(testimonials.length / ITEMS_PER_PAGE);

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_URL}/api/testimonials/all-reviews`);
        const data = await response.json();
        
        if (data.success) {
          if (data.reviews.length === 0) {
            setTestimonials([]);
            return;
          }

          // Transform based on your Review model
          const formattedReviews = data.reviews.map(review => ({
            id: review._id,
            name: review.user?.name || 'Anonymous User',
            role: 'Event Attendee',  
            rating: review.rating,
            img: `https://ui-avatars.com/api/?name=${review.user?.name || 'User'}`,
            text: review.comment,
            event: review.event,
            user: review.user,
            booking: review.booking,
            createdAt: review.createdAt
          }));
          
          setTestimonials(formattedReviews);
        } else {
          setError(data.message || 'Failed to fetch reviews');
        }
      } catch (err) {
        console.error('Error fetching reviews:', err);
        setError('Error loading testimonials');
      } finally {
        setLoading(false);
      }
    };
    
    fetchReviews();
  }, []);


  const nextPage = () => page < totalPages - 1 && setPage(page + 1);
  const prevPage = () => page > 0 && setPage(page - 1);

  const current = testimonials.slice(
    page * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE + ITEMS_PER_PAGE
  );

  // Format date function
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const navigate = useNavigate();
  if (loading) {
    return (
      <section className="py-20 px-6 bg-gray-200">
        <h2 className="text-4xl font-bold text-center mb-12">What Clients Say</h2>
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-8 bg-white rounded-xl animate-pulse">
                <div className="w-20 h-20 rounded-full bg-gray-300 mx-auto"></div>
                <div className="h-6 bg-gray-300 rounded mt-4 w-2/4 mx-auto"></div>
                <div className="flex justify-center mt-3 gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <div key={star} className="w-5 h-5 bg-gray-300 rounded-lg"></div>
                  ))}
                </div>
                <div className="h-10 bg-gray-300 rounded mt-5"></div>
                <div className="h-4 bg-gray-300 rounded mt-4 w-full"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!loading && testimonials.length === 0) {

    return (
      <section className="py-20 px-6 bg-slate-200">
        <h2 className="text-4xl font-bold text-center mb-12">What Clients Say</h2>
        <div className="max-w-4xl mx-auto text-center p-12 bg-slate-900 rounded-xl shadow-lg flex flex-col items-center justify-center">
          <h3 className="text-2xl font-semibold text-gray-200 mb-4">
            No Reviews Yet
          </h3>
          <p className="text-gray-400 mb-8">
            Be the first to share your experience! Leave a review after attending an event.
          </p>
          <button 
            type="submit"
            className="flex items-center justify-center gap-2 group bg-black text-white px-4 md:px-7 py-2.5 rounded-xl hover:bg-gray-600 transition-all"
            onClick={()=>navigate("/events")}
          >
            <span>Explore</span>
            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" 
              fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 px-6 bg-gray-200">
      <h2 className="text-4xl font-bold text-center mb-12">What Clients Say</h2>

      {error && (
        <div className="max-w-2xl mx-auto bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-8">
          <p className="text-yellow-800">{error}</p>
        </div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 80 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        <div className="relative max-w-6xl mx-auto">
          {/* Navigation arrows */}
          {page > 0 && (
            <button className="absolute left-0 top-1/2 -translate-y-1/2 bg-white shadow-lg p-3 m-3 rounded-full hover:bg-gray-100 z-20" onClick={prevPage}>
              <ChevronLeft size={28} />
            </button>
          )}
          
          {page < totalPages - 1 && (
            <button className="absolute right-0 top-1/2 -translate-y-1/2 bg-white shadow-lg p-3 m-3 rounded-full hover:bg-gray-100 z-20" onClick={nextPage}>
              <ChevronRight size={28} />
            </button>
          )}

          <div className="p-10 m-10 bg-slate-900 shadow-xl rounded-xl max-md:m-0">
            <AnimatePresence mode="wait">
              <motion.div
                key={page}
                initial={{ opacity: 0, x: 80 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -80 }}
                transition={{ duration: 0.5 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12"
              >
                {current.map((item) => (
                  <div key={item.id} className="p-8 bg-[#654242ac] shadow-lg rounded-xl border border-gray-100 relative">
                    
                    {/* Review Images if any */}
                    {item.images && item.images.length > 0 && (
                      <div className="mb-4">
                        <img 
                          src={item.images[0]} 
                          alt="Review" 
                          className="w-full h-48 object-cover rounded-lg "
                        />
                      </div>
                    )}
                    
                    {/* Avatar */}
                    <div className="flex items-center justify-center mb-4">
                      {item.img ? (
                        <img src={item.img} alt={item.name} className="w-16 h-16 rounded-full object-cover shadow-md" />
                      ) : (
                        <div className="w-16 h-16 rounded-full bg-linear-to-br from-blue-100 to-purple-100 flex items-center justify-center shadow-md">
                          <User size={24} className="text-gray-600" />
                        </div>
                      )}
                    </div>

                    {/* Name */}
                    <h3 className="text-xl font-semibold text-white text-center">{item.name}</h3>
                    
                    {/* Stars */}
                    <div className="flex justify-center gap-1 my-3">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          size={18}
                          className={`${i < item.rating ? 'text-slate-200 fill-slate-200' : 'text-gray-300'}`}
                        />
                      ))}
                    </div>

                    {/* Testimonial Text */}
                    <p className="text-center italic text-gray-200 mb-4 line-clamp-3">
                      {item.text}
                    </p>

                    {/* Event Details */}
                    {item.event && (
                      <div className="border-t pt-4 mt-4 text-sm text-gray-300">
                        <div className="flex items-center gap-2 mb-1">
                          <Calendar size={14} />
                          <span className="font-medium">{item.event.title}</span>
                        </div>
                        {item.event.date && (
                          <p className="text-xs text-gray-400 ml-6">
                            {formatDate(item.event.date)}
                          </p>
                        )}
                        {item.event.location && (
                          <div className="flex items-center gap-2 mt-1 ml-6">
                            <MapPin size={12} />
                            <span className="text-xs">{item.event.location}</span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Review Date */}
                    <div className="absolute top-4 right-4">
                      <span className="text-xs text-gray-400">
                        {formatDate(item.createdAt)}
                      </span>
                    </div>
                  </div>
                ))}
              </motion.div>
            </AnimatePresence>

          </div>
        </div>
      </motion.div>
    </section>
  );
};


export default TestimonialSlider;
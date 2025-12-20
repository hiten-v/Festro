// import React from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import { FaCalendarAlt, FaMapMarkerAlt, FaEnvelope, FaTimes } from 'react-icons/fa';

// const EventPopup = ({ show, event, onClose, onEmailTicket, onDownloadTicket }) => {
//   if (!show || !event) return null;

//   return (
//     <AnimatePresence>
//       <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
//         <motion.div
//           initial={{ opacity: 0, scale: 0.9 }}
//           animate={{ opacity: 1, scale: 1 }}
//           exit={{ opacity: 0, scale: 0.9 }}
//           className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto"
//         >
//           <div className="relative">
//             <img
//               src={event.image}
//               alt={event.title}
//               className="w-full h-48 object-cover"
//             />
//             <button
//               onClick={onClose}
//               className="absolute top-4 right-4 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center hover:bg-white"
//             >
//               <FaTimes />
//             </button>
//           </div>
          
//           <div className="p-6">
//             <h3 className="text-xl font-bold text-slate-900 mb-2">{event.title}</h3>
//             <div className="space-y-3 mb-6">
//               <div className="flex items-center gap-3 text-stone-600">
//                 <FaCalendarAlt className="text-[#702c2c]" />
//                 <span>{event.date} • {event.time}</span>
//               </div>
//               <div className="flex items-center gap-3 text-stone-600">
//                 <FaMapMarkerAlt className="text-[#702c2c]" />
//                 <span>{event.location}</span>
//               </div>
//               <div className="flex items-center gap-3">
//                 <span className="px-3 py-1 bg-stone-100 text-stone-700 rounded-full text-xs">
//                   {event.category}
//                 </span>
//                 <span className="font-bold text-[#702c2c]">
//                   {event.price === 0 ? 'Free' : `₹${event.price}`}
//                 </span>
//               </div>
//             </div>
            
//             <p className="text-stone-600 mb-8">{event.description}</p>
            
//             <div className="space-y-3">
//               <button
//                 onClick={onEmailTicket}
//                 className="w-full py-3 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800 flex items-center justify-center gap-2"
//               >
//                 <FaEnvelope /> Email Ticket Details
//               </button>
//             </div>
//           </div>
//         </motion.div>
//       </div>
//     </AnimatePresence>
//   );
// };

// export default EventPopup;





import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaCalendarAlt, 
  FaMapMarkerAlt, 
  FaEnvelope, 
  FaTimes, 
  FaTrash,
  FaCheck,
  FaExclamationTriangle,
  FaTicketAlt,
  FaClock,
  FaRupeeSign
} from 'react-icons/fa';
import Toast from '../component/Toast';

const EventPopup = ({ show, event, bookingId, onClose, onCancelSuccess }) => {
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [cancelText, setCancelText] = useState('');
  const [cancelling, setCancelling] = useState(false);
  const [sendingEmail, setSendingEmail] = useState(false);
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success",
  });

  if (!show || !event) return null;

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast((prev) => ({ ...prev, show: false }));
    }, 3000);
  };

  const handleEmailTicket = async () => {
    if (!bookingId) {
      showToast('Booking ID not found', 'error');
      return;
    }

    setSendingEmail(true);
    try {
      const response = await fetch(`http://localhost:5000/api/bookings/${bookingId}/send-ticket`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      });

      const data = await response.json();

      if (response.ok) {
        showToast('Ticket details re-sent to your email!', 'success');
      } else {
        showToast(data.message || 'Failed to send email', 'error');
      }
    } catch (error) {
      console.error('Email ticket error:', error);
      showToast('Failed to send email. Please try again.', 'error');
    } finally {
      setSendingEmail(false);
    }
  };

  const handleCancelBooking = async () => {
    if (cancelText.toLowerCase() !== 'cancel') {
      showToast('Please type "cancel" to confirm cancellation', 'error');
      return;
    }

    if (!bookingId) {
      showToast('Booking ID not found', 'error');
      return;
    }

    setCancelling(true);
    try {
      const response = await fetch(`http://localhost:5000/api/bookings/${bookingId}/cancel`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      });

      const data = await response.json();

      if (response.ok) {
        showToast('Booking cancelled successfully!', 'success');
        setShowCancelConfirm(false);
        setCancelText('');
        
        // Notify parent component about cancellation
        if (onCancelSuccess) {
          setTimeout(() => {
            onCancelSuccess();
          }, 500);
        }
        
        // Close popup after a delay
        setTimeout(() => {
          onClose();
        }, 1000);
      } else {
        showToast(data.message || 'Failed to cancel booking', 'error');
      }
    } catch (error) {
      console.error('Cancel booking error:', error);
      showToast('Failed to cancel booking. Please try again.', 'error');
    } finally {
      setCancelling(false);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'Date not set';
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-IN', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      return dateStr;
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'confirmed':
        return { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-200' };
      case 'pending':
        return { bg: 'bg-yellow-100', text: 'text-yellow-800', border: 'border-yellow-200' };
      case 'cancelled':
        return { bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-200' };
      default:
        return { bg: 'bg-gray-100', text: 'text-gray-800', border: 'border-gray-200' };
    }
  };

  const statusInfo = getStatusColor(event.status);

  return (
    <>
      
      {/* Cancel Confirmation Modal */}
      <AnimatePresence>
        {showCancelConfirm && (
          <div className="fixed inset-0 bg-black/20 z-[60] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                  <FaExclamationTriangle className="text-2xl text-red-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900">Cancel Booking</h3>
                  <p className="text-sm text-stone-500">This action cannot be undone</p>
                </div>
              </div>
              
              <div className="mb-6">
                <p className="text-stone-600 mb-4">
                  Are you sure you want to cancel your booking for <strong className="text-slate-900">{event.title}</strong>?
                </p>
                
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4">
                  <div className="flex items-start gap-2">
                    <FaExclamationTriangle className="text-red-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-red-800 mb-2">Important Notes:</p>
                      <ul className="text-xs text-red-700 space-y-1 ml-1">
                        <li className="flex items-start gap-1">
                          <span className="mt-1">•</span>
                          <span>This action is permanent and cannot be undone</span>
                        </li>
                        <li className="flex items-start gap-1">
                          <span className="mt-1">•</span>
                          <span>Your tickets will be released and made available to others</span>
                        </li>
                        {event.price > 0 ? (
                          <li className="flex items-start gap-1">
                            <span className="mt-1">•</span>
                            <span>Refund (if applicable) will be processed within 5-7 business days</span>
                          </li>
                        ) : (
                          <li className="flex items-start gap-1">
                            <span className="mt-1">•</span>
                            <span>No refund will be processed for free events</span>
                          </li>
                        )}
                      </ul>
                    </div>
                  </div>
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-stone-700 mb-2">
                    Type <span className="font-bold text-red-600">"cancel"</span> to confirm:
                  </label>
                  <input
                    type="text"
                    value={cancelText}
                    onChange={(e) => setCancelText(e.target.value)}
                    placeholder="Type 'cancel' here"
                    className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none transition-colors"
                    autoFocus
                  />
                  <p className="text-xs text-stone-500 mt-2">
                    This helps prevent accidental cancellations
                  </p>
                </div>
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowCancelConfirm(false);
                    setCancelText('');
                  }}
                  disabled={cancelling}
                  className="flex-1 py-3 border border-stone-300 text-stone-700 rounded-lg font-medium hover:bg-stone-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Go Back
                </button>
                <button
                  onClick={handleCancelBooking}
                  disabled={cancelling || cancelText.toLowerCase() !== 'cancel'}
                  className={`flex-1 py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition-all ${
                    cancelling || cancelText.toLowerCase() !== 'cancel'
                      ? 'bg-gray-300 cursor-not-allowed'
                      : 'bg-red-600 hover:bg-red-700 shadow-lg shadow-red-600/20'
                  } text-white`}
                >
                  {cancelling ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Cancelling...
                    </>
                  ) : (
                    <>
                      <FaTrash /> Confirm Cancel
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Main Event Popup */}
      <AnimatePresence>
        {show && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl"
            >
              {/* Image Header */}
              <div className="relative">
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-full h-56 object-cover"
                  onError={(e) => {
                    e.target.src = "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80&w=1000";
                  }}
                />
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center hover:bg-white hover:scale-110 transition-all shadow-lg"
                >
                  <FaTimes className="text-lg" />
                </button>
                
                {/* Status Badge on Image */}
                <div className={`absolute bottom-4 left-4 px-3 py-1.5 rounded-full text-xs font-bold ${statusInfo.bg} ${statusInfo.text} ${statusInfo.border} border backdrop-blur-sm bg-opacity-90`}>
                  {event.status?.toUpperCase() || 'BOOKED'}
                </div>
              </div>
              
              {/* Content */}
              <div className="p-6">
                {/* Event Title */}
                <h2 className="text-2xl font-bold text-slate-900 mb-3">{event.title}</h2>
                
                {/* Event Details */}
                <div className="space-y-4 mb-6">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#702c2c]/10 flex items-center justify-center text-[#702c2c] flex-shrink-0">
                      <FaCalendarAlt />
                    </div>
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wider text-stone-500">Date & Time</p>
                      <p className="font-medium text-slate-800">{formatDate(event.date)}</p>
                      <p className="text-sm text-stone-600 flex items-center gap-1 mt-1">
                        <FaClock className="text-sm" /> {event.time}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#702c2c]/10 flex items-center justify-center text-[#702c2c] flex-shrink-0">
                      <FaMapMarkerAlt />
                    </div>
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wider text-stone-500">Location</p>
                      <p className="font-medium text-slate-800">{event.location}</p>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1.5 bg-stone-100 text-stone-700 rounded-full text-sm font-medium">
                      {event.category}
                    </span>
                    <span className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full text-sm font-medium flex items-center gap-1">
                      <FaTicketAlt /> Ticket Booked
                    </span>
                    <span className="px-3 py-1.5 bg-green-50 text-green-700 rounded-full text-sm font-medium flex items-center gap-1">
                      <FaRupeeSign /> {event.price === 0 ? 'Free Event' : `₹${event.price} per ticket`}
                    </span>
                  </div>
                </div>
                
                {/* Description */}
                <div className="mb-8">
                  <h4 className="text-sm font-semibold uppercase tracking-wider text-stone-500 mb-2">About This Event</h4>
                  <p className="text-stone-700 leading-relaxed">{event.description}</p>
                </div>
                
                {/* Action Buttons */}
                <div className="space-y-3">
                  <button
                    onClick={handleEmailTicket}
                    disabled={sendingEmail || event.status === 'cancelled'}
                    className={`w-full py-3.5 rounded-xl font-medium flex items-center justify-center gap-3 transition-all ${
                      sendingEmail || event.status === 'cancelled'
                        ? 'bg-gray-300 cursor-not-allowed'
                        : 'bg-[#702c2c] hover:bg-[#5a2323] shadow-lg'
                    } text-white`}
                  >
                    {sendingEmail ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        Sending...
                      </>
                    ) : (
                      <>
                        <FaEnvelope className="text-lg" /> 
                        {event.status === 'cancelled' ? 'Ticket Unavailable (Cancelled)' : 'Email Ticket Details'}
                      </>
                    )}
                  </button>
                  
                  {event.status !== 'cancelled' && (
                    <button
                      onClick={() => setShowCancelConfirm(true)}
                      className="w-full py-3.5 border-2 border-red-300 text-red-600 rounded-xl font-medium hover:bg-red-50 flex items-center justify-center gap-3 transition-colors"
                    >
                      <FaTrash /> Cancel Booking
                    </button>
                  )}
                </div>
                
                {/* Footer Note */}
                <div className="mt-6 pt-4 border-t border-stone-100">
                  <p className="text-xs text-stone-500 text-center">
                    Need help? Contact support at{" "}
                    <a href="mailto:support@festro.com" className="text-[#702c2c] hover:underline">
                      support@festro.com
                    </a>
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default EventPopup;
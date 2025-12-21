import { useState } from "react";

const Newsletter = () => {
  const [loading, setLoading] = useState(false);
  
  const [newsLetter, setNewsLetter] = useState({
    email: '',
  });
  
  const [nerrors, setNerrors] = useState({
    email: false,
  });
  
  const resetNewsLetter = () => {
    setNewsLetter({
      email: '',
    });
    resetNerrors();
  };

  const resetNerrors = () => {
    setNerrors({
      email: false,
    });
  };

  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleChange = (e) => {
    const {name, value} = e.target;

    setNewsLetter((prev)=>({
      ...prev,
      [name]: value,
    }));

    setNerrors((prev) => ({
      ...prev,
      [name]: value.trim() === "",
    }));
  };

  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success", // success | error
  });

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast((prev) => ({ ...prev, show: false }));
    }, 3000);
  };

  const API_URL = import.meta.env.VITE_API_URL;
  const handleSubscribe = async (e) => {
    e.preventDefault();

    let newErrors = {
      email: newsLetter.email.trim() === "" || !isValidEmail(newsLetter.email),
    };

    setNerrors(newErrors);

    // stop submit if any error exists
    if (Object.values(newErrors).some(Boolean)) return;

    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/api/newsletter/subscribe`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: newsLetter.email }), // FIXED: Use newsLetter.email
        credentials: 'include'
      });

      const data = await res.json();

      if (res.ok) {
        showToast(
          "Subscribed to Festro Newsletter!",
          "success"
        );
        resetNewsLetter();
      } else {
        showToast(data.message || "Something went wrong", "error");
      }
    } catch (err) {
      console.error('Error:', err);
      showToast("Connection error. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="w-full flex justify-center items-center py-20">
      {toast.show && (
        <div
          className={`fixed top-2 left-1/2 -translate-x-1/2 z-50
          px-6 py-3 rounded-lg shadow-lg flex items-center gap-4
          ${toast.type === "success" ? "bg-green-900" : "bg-red-900 "}
          text-white transition-all duration-300 ease-out`}
        >
          <span>{toast.message}</span>
          <button
            onClick={() => setToast((p) => ({ ...p, show: false }))}
            className="font-bold"
          >
            ✕
          </button>
        </div>
      )}
      
      <div className="flex flex-col justify-center items-center rounded-2xl m-5 p-10 w-1/2 max-md:w-full bg-gray-900 text-white">
        <div className="flex flex-col justify-center items-center text-center">
          <h1 className="text-4xl md:text-[40px]">Stay Updated</h1>
          <p className="text-sm md:text-base text-gray-500/90 mt-2 max-w-xl">
            Join our newsletter and be the first to discover trending events near you.
          </p>
        </div>
        
        <form onSubmit={handleSubscribe} className="flex flex-col md:flex-row items-center justify-center gap-4 mt-6">
          <div className="flex flex-col">
            <input 
              type="text" 
              name="email"
              value={newsLetter.email}
              onChange={handleChange}
              className={`bg-white/10 px-4 py-2.5 border border-white/20 rounded focus:outline-none focus:ring-2 
                ${nerrors.email ? "ring-red-800 shadow-red-400" : "focus:ring-white/50"} 
                max-w-66 w-full`}
              placeholder="Enter your email" 
            />
            {nerrors.email && (
              <p className="text-red-400 text-sm mt-1">
                {newsLetter.email.trim() === ""
                  ? "Email is required"
                  : "Invalid email format"}
              </p>
            )}
          </div>
          
          <button 
            type="submit"
            disabled={loading}
            className="flex items-center justify-center gap-2 group bg-black px-4 md:px-7 py-2.5 rounded-xl hover:bg-gray-600 transition-all"
          >
            {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Subscribing...</span>
                </>
              ) : (
                <>
                  <span>Subscribe</span>
                  <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" 
                    fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                      d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </>
              )}
            </button>
        </form>
        
        <p className="text-gray-500 mt-6 text-xs text-center">
          By subscribing, you agree to our Privacy Policy and consent to receive updates.
        </p>
      </div>
    </section>
  );
};

export default Newsletter;
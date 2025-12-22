import React, { useState, useEffect } from "react";
import { assets } from "../assets/assets.js";
import { Link, useNavigate } from "react-router-dom";
import LoginSignupPopup from "./LoginSignUpPop.jsx"; 

export default function Navbar() {
  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Events', path: '/events' },
    { name: 'Experience', path: '/experience' },
    { name: 'About', path: '/about' },
  ];

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [userData, setUserData] = useState(null);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const navigate = useNavigate();


  const API_URL = import.meta.env.VITE_API_URL;

  // Check authentication status
  const checkAuth = async () => {
    try {
      const response = await fetch(`${API_URL}/api/auth/check`, {
        credentials: 'include' // Important: sends cookies
      });
      
      const data = await response.json();
      
      if (data.isAuthenticated) {
        setIsLoggedIn(true);
        // Fetch user data
        const userResponse = await fetch(`${API_URL}/api/auth/me`, {
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

    const interval = setInterval(checkAuth, 2000); // Check every 3 seconds
    
    return () => clearInterval(interval);
  }, []);


  // Check login status on component mount
  // useEffect(() => {
  //   checkLoginStatus();
  //   window.addEventListener("storage", checkLoginStatus);
  //   return () => window.removeEventListener("storage", checkLoginStatus);
  // }, []);




  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // const checkLoginStatus = () => {
  //   const loggedIn = localStorage.getItem("isLoggedIn");
  //   const user = localStorage.getItem("user");
    
  //   if (loggedIn === 'true' && user) {
  //     setIsLoggedIn(true);
  //     setUserData(JSON.parse(user));
  //   } else {
  //     setIsLoggedIn(false);
  //     setUserData(null);
  //   }
  // };

  const handleDashboardClick = () => {
    if (!isLoggedIn) {
      setShowLoginPopup(true);
      return;
    }

    // const role = localStorage.getItem("role");
    // if (role === "organiser") {
    //   navigate("/organiser/dashboard");
    // } else {
    //   navigate("/user/dashboard");
    // }

    if (userData.role === "organiser") {
      navigate("/organiser/dashboard");
    } else {
      navigate("/user/dashboard");
    }
  };

  // const handleLoginSuccess = () => {
  //   checkLoginStatus();
  // };

  // const handleLogout = () => {
  //   localStorage.clear();
  //   setIsLoggedIn(false);
  //   setUserData(null);
  //   navigate("/");
  // };

  const handleLoginSuccess = async () => {
    await checkAuth(); // Re-check auth after login
  };

  const handleLogout = async () => {
    try {
      const response = await fetch(`${API_URL}/api/auth/logout`, {
        method: 'POST',
        credentials: 'include'
      });
      
      if (response.ok) {
        setIsLoggedIn(false);
        setUserData(null);
        navigate("/");
      }
    } catch (error) {
      console.error('Logout error:', error);
    }
  };


  const showUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  if (loading) {
    return null; // Or show a loading spinner
  }

  return (
    <>
      <nav className={`fixed top-0 left-0 w-full flex items-center justify-between 
                    px-4 md:px-16 lg:px-24 xl:px-32 transition-all duration-500 z-50 
                    ${isScrolled ? "bg-white/50 shadow-md text-gray-700 backdrop-blur-lg py-3 md:py-4" : "py-4 md:py-6"}`}>

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <img src={assets.logo} alt="Festro Logo" className={`h-12 w-20 object-contain ${!isScrolled && "invert"}`} />
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center font-semibold gap-4 lg:gap-8">
          {navLinks.map((link, i) => (
            <Link key={i} to={link.path} className={`group flex flex-col gap-0.5 
                                ${isScrolled ? "text-slate-800" : "text-white"}`}>
              {link.name}
              <div className={`${isScrolled ? "bg-slate-800" : "bg-white"} h-0.5 w-0 
                        group-hover:w-full transition-all duration-300`} />
            </Link>
          ))}
          
          <button onClick={handleDashboardClick}
            className={`border px-4 py-1 text-sm font-semibold rounded-full 
                cursor-pointer ${isScrolled ? 'text-slate-800' : 'text-white'} transition duration-200 ease-in hover:bg-slate-900 hover:text-white`}
          >
            Dashboard
          </button>
        </div>

        {/* Desktop Right - Updated */}
        <div className="hidden md:flex justify-center items-center gap-4">
          {isLoggedIn ? (
            <div className="flex flex-col justify-center items-center gap-4">
              <div className="flex items-center gap-2">
                <button onClick={showUserMenu} className="h-8 w-8 bg-slate-900 text-white ring-2 ring-white rounded-full flex items-center justify-center">
                  {userData?.name?.charAt(0)?.toUpperCase() || 'U'}
                </button>
              </div>
              {isUserMenuOpen && (
                <div className={`absolute flex flex-col gap-1 mt-40 p-2 m-2 text-center bg-slate-900/70 shadow-lg rounded-lg `}>
                  <span className="text-white">
                    Hi, {userData?.name?.split(' ')[0] || 'User'}
                  </span>
                  <button 
                    onClick={handleLogout}
                    className={`px-3 py-1 m-2 text-center rounded-full transition-all 
                        duration-500 ${isScrolled ? "text-white bg-red-500" : "bg-red-500 text-white"}`}
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button 
              onClick={() => setShowLoginPopup(true)}
              className={`border px-4 py-1 font-semibold rounded-full 
                cursor-pointer ${isScrolled ? 'text-black' : 'text-white'} transition duration-200 ease-in hover:bg-slate-900 hover:text-white`}
            >
              Login
            </button>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="flex items-center gap-3 md:hidden">
          <svg onClick={() => setIsMenuOpen(!isMenuOpen)} 
            className={`h-6 w-6 cursor-pointer ${isScrolled ? "" : "invert"}`} 
            fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <line x1="4" y1="6" x2="20" y2="6" />
            <line x1="4" y1="12" x2="20" y2="12" />
            <line x1="4" y1="18" x2="20" y2="18" />
          </svg>
        </div>

        {/* Mobile Menu - Updated */}
        <div className={`fixed top-0 left-0 w-full h-screen bg-slate-600/96 
            text-base flex flex-col md:hidden items-center justify-center gap-6 
            font-medium text-white transition-all duration-500 ${isMenuOpen ? "translate-x-0" : "-translate-x-full"}`}>
          <button className="absolute top-6 right-4" onClick={() => setIsMenuOpen(false)}>
            <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>

          <Link to="/" className="absolute top-6">
            <img src={assets.logo} alt="Festro Logo" className={`h-16 w-26 invert`} />
          </Link>

          {navLinks.map((link, i) => (
            <Link key={i} to={link.path} className={`group`} onClick={() => setIsMenuOpen(false)}>
              {link.name}
              <div className={`bg-white h-0.5 w-0 
                        group-hover:w-full transition-all duration-300`} />
            </Link>
          ))}

          <button onClick={() => { handleDashboardClick(); setIsMenuOpen(false); }}
            className="border px-4 py-1 text-sm font-light rounded-full cursor-pointer transition-all hover:bg-slate-900 hover:text-white"
          >
            Dashboard
          </button>

          {isLoggedIn ? (
            <div className="flex flex-col items-center justify-center gap-4">
              <div className="flex items-center justify-center gap-2">
                <button onClick={showUserMenu} className="h-8 w-8 bg-slate-900 text-white ring-2 ring-white rounded-full flex items-center justify-center">
                  {userData?.name?.charAt(0)?.toUpperCase() || 'U'}
                </button>
              </div>
              {isUserMenuOpen && (
                <div className={`absolute flex flex-col gap-1 mt-40 p-2 m-2 text-center bg-slate-900/70 shadow-lg rounded-lg `}>
                  <span className="text-white">
                    Hi, {userData?.name?.split(' ')[0] || 'User'}
                  </span>
                  <button 
                    onClick={() => { handleLogout(); setIsMenuOpen(false); }}
                    className={`px-3 py-1 m-2 text-center rounded-full transition-all 
                        duration-500 ${isScrolled ? "text-white bg-red-500" : "bg-red-500 text-white"}`}
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button 
              onClick={() => { setShowLoginPopup(true); setIsMenuOpen(false); }}
              className={`px-3 py-1.5 rounded-full transition-all bg-slate-500
                duration-300 hover:bg-slate-900 hover:text-white`}
            >
              Login
            </button>
          )}
        </div>
      </nav>

      {/* Login/Signup Popup */}
      <LoginSignupPopup 
        isOpen={showLoginPopup}
        onClose={() => setShowLoginPopup(false)}
        onLoginSuccess={handleLoginSuccess}
      />
    </>
  );
}
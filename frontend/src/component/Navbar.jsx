// import React from "react";
// import { assets } from "../assets/assets.js";
// import { Link,useNavigate } from "react-router-dom";

// export default function Navbar () {
//     const navLinks = [
//         { name: 'Home', path: '/' },
//         { name: 'Events', path: '/events' },
//         { name: 'Experience', path: '/experience' },
//         { name: 'About', path: '/about' },
//     ];

//     const [isScrolled, setIsScrolled] = React.useState(false);
//     const [isMenuOpen, setIsMenuOpen] = React.useState(false);

//     React.useEffect(() => {
//         const handleScroll = () => {
//             setIsScrolled(window.scrollY > 10);
//         };
//         window.addEventListener("scroll", handleScroll);
//         return () => window.removeEventListener("scroll", handleScroll);
//     }, []);


//     const navigate = useNavigate();

//     const handleDashboardClick = () => {
//         const loggedIn = localStorage.getItem("isLoggedIn");
//         const role = localStorage.getItem("role");

//         if (!loggedIn) {
//             navigate("/login");
//             return;
//         }

//         if (role === "organiser") {
//             navigate("/organiser-dashboard");
//         } else {
//             navigate("/user-dashboard");
//         }
//     };


//     return (
//         <nav className={`fixed top-0 left-0 w-full flex items-center justify-between 
//                     px-4 md:px-16 lg:px-24 xl:px-32 transition-all duration-500 z-50 
//                     ${isScrolled ? "bg-white/20 shadow-md text-gray-700 backdrop-blur-lg py-3 md:py-4" : "py-4 md:py-6"}`}>

//             {/* Logo */}
//             <Link to="/" className="flex items-center gap-2">
//                 <img src={assets.logo} alt="Festro Logo" className={`h-12 w-20 object-contain ${!isScrolled && "invert"}`} />
//             </Link>

//             {/* Desktop Nav */}
//             <div className="hidden md:flex items-center gap-4 lg:gap-8">
//                 {navLinks.map((link, i) => (
//                     <a key={i} href={link.path} className={`group flex flex-col gap-0.5 
//                                     ${isScrolled ? "text-gray-700" : "text-white"}`}>
//                         {link.name}
//                         <div className={`${isScrolled ? "bg-gray-700" : "bg-white"} h-0.5 w-0 
//                         group-hover:w-full transition-all duration-300`} />
//                     </a>
//                 ))}
                
//                 <button onClick={handleDashboardClick}
//                 className={`border px-4 py-1 text-sm font-light rounded-full 
//                     cursor-pointer ${isScrolled ? 'text-black' : 'text-white'} transition-all`}
//                 >
//                 Dashboard
//                 </button>
//             </div>

//             {/* Desktop Right */}
//             <div className="hidden md:flex items-center gap-4">
//                 {/* <svg className={`h-6 w-6 text-white transition-all duration-500 
//                 ${isScrolled ? "invert" : ""}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
//                     <circle cx="11" cy="11" r="8" />
//                     <line x1="21" y1="21" x2="16.65" y2="16.65" />
//                 </svg> */}
//                 <button className={`px-8 py-2.5 rounded-full ml-4 transition-all 
//                     duration-500 ${isScrolled ? "text-white bg-black" : "bg-white text-black"}`}>
//                     Login
//                 </button>
//             </div>

//             {/* Mobile Menu Button */}
//             <div className="flex items-center gap-3 md:hidden">
//                 <svg onClick={() => setIsMenuOpen(!isMenuOpen)} 
//                     className={`h-6 w-6 cursor-pointer ${isScrolled ? "" : "invert"}`} 
//                     fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
//                     <line x1="4" y1="6" x2="20" y2="6" />
//                     <line x1="4" y1="12" x2="20" y2="12" />
//                     <line x1="4" y1="18" x2="20" y2="18" />
//                 </svg>
//             </div>

//             {/* Mobile Menu */}
//             <div className={`fixed top-0 left-0 w-full h-screen bg-slate-400/96 
//                 text-base flex flex-col md:hidden items-center justify-center gap-6 
//                 font-medium text-white transition-all duration-500 ${isMenuOpen ? "translate-x-0" : "-translate-x-full"}`}>
//                 <button className="absolute top-6 right-4" onClick={() => setIsMenuOpen(false)}>
//                     <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
//                         <line x1="18" y1="6" x2="6" y2="18" />
//                         <line x1="6" y1="6" x2="18" y2="18" />
//                     </svg>
//                 </button>

//                 <Link to="/" className="absolute top-6">
//                     <img src={assets.logo} alt="Festro Logo" className={`h-16 w-26 invert `} />
//                 </Link>
//                 {navLinks.map((link, i) => (
//                     <a key={i} href={link.path} className={`group`} onClick={() => setIsMenuOpen(false)}>
//                         {link.name}
//                         <div className={`bg-white h-0.5 w-0 
//                         group-hover:w-full transition-all duration-300`} />
//                     </a>
//                 ))}

//                 <button onClick={() => { handleDashboardClick(); setIsMenuOpen(false); }}
//                 className="border px-4 py-1 text-sm font-light rounded-full cursor-pointer transition-all"
//                 >
//                 Dashboard
//                 </button>

//                 <button className="bg-black text-white px-8 py-2.5 rounded-full transition-all duration-500">
//                     Login
//                 </button>
//             </div>
//         </nav>
//     );
// }


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

  const navigate = useNavigate();

  // Check login status on component mount
  useEffect(() => {
    checkLoginStatus();
    window.addEventListener("storage", checkLoginStatus);
    return () => window.removeEventListener("storage", checkLoginStatus);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const checkLoginStatus = () => {
    const loggedIn = localStorage.getItem("isLoggedIn");
    const user = localStorage.getItem("user");
    
    if (loggedIn === 'true' && user) {
      setIsLoggedIn(true);
      setUserData(JSON.parse(user));
    } else {
      setIsLoggedIn(false);
      setUserData(null);
    }
  };

  const handleDashboardClick = () => {
    if (!isLoggedIn) {
      setShowLoginPopup(true);
      return;
    }

    const role = localStorage.getItem("role");
    if (role === "organiser") {
      navigate("/organiser/dashboard");
    } else {
      navigate("/user/dashboard");
    }
  };

  const handleLoginSuccess = () => {
    checkLoginStatus();
  };

  const handleLogout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    setUserData(null);
    navigate("/");
  };

  return (
    <>
      <nav className={`fixed top-0 left-0 w-full flex items-center justify-between 
                    px-4 md:px-16 lg:px-24 xl:px-32 transition-all duration-500 z-50 
                    ${isScrolled ? "bg-white/30 shadow-md text-gray-700 backdrop-blur-lg py-3 md:py-4" : "py-4 md:py-6"}`}>

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <img src={assets.logo} alt="Festro Logo" className={`h-12 w-20 object-contain ${!isScrolled && "invert"}`} />
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-4 lg:gap-8">
          {navLinks.map((link, i) => (
            <Link key={i} to={link.path} className={`group flex flex-col gap-0.5 
                                ${isScrolled ? "text-slate-800" : "text-white"}`}>
              {link.name}
              <div className={`${isScrolled ? "bg-slate-800" : "bg-white"} h-0.5 w-0 
                        group-hover:w-full transition-all duration-300`} />
            </Link>
          ))}
          
          <button onClick={handleDashboardClick}
            className={`border px-4 py-1 text-sm font-light rounded-full 
                cursor-pointer ${isScrolled ? 'text-black' : 'text-white'} transition duration-200 ease-in hover:bg-slate-900 hover:text-white`}
          >
            Dashboard
          </button>
        </div>

        {/* Desktop Right - Updated */}
        <div className="hidden md:flex items-center gap-4">
          {isLoggedIn ? (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 bg-black text-white rounded-full flex items-center justify-center">
                  {userData?.name?.charAt(0)?.toUpperCase() || 'U'}
                </div>
                <span className={`${isScrolled ? 'text-black' : 'text-white'}`}>
                  Hi, {userData?.name?.split(' ')[0] || 'User'}
                </span>
              </div>
              <button 
                onClick={handleLogout}
                className={`px-6 py-2 rounded-full ml-4 transition-all 
                    duration-500 ${isScrolled ? "text-white bg-red-500" : "bg-red-500 text-white"}`}
              >
                Logout
              </button>
            </div>
          ) : (
            <button 
              onClick={() => setShowLoginPopup(true)}
              className={`px-5 py-2 rounded-full ml-4 transition-all hover:bg-slate-500
                duration-300 ${isScrolled ? "text-white bg-slate-900" : "bg-white text-slate-800 "}`}
            >
              Login
            </button>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="flex items-center gap-3 md:hidden">
          {isLoggedIn && (
            <div className="h-8 w-8 bg-black text-white rounded-full flex items-center justify-center">
              {userData?.name?.charAt(0)?.toUpperCase() || 'U'}
            </div>
          )}
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
            <img src={assets.logo} alt="Festro Logo" className={`h-16 w-26 invert `} />
          </Link>

          {navLinks.map((link, i) => (
            <Link key={i} to={link.path} className={`group`} onClick={() => setIsMenuOpen(false)}>
              {link.name}
              <div className={`bg-white h-0.5 w-0 
                        group-hover:w-full transition-all duration-300`} />
            </Link>
          ))}

          <button onClick={() => { handleDashboardClick(); setIsMenuOpen(false); }}
            className="border px-4 py-1 text-sm font-light rounded-full cursor-pointer transition-all"
          >
            Dashboard
          </button>

          {isLoggedIn ? (
            <>
              <div className="flex flex-col items-center gap-2">
                <div className="h-12 w-12 bg-white text-black rounded-full flex items-center justify-center text-lg font-bold">
                  {userData?.name?.charAt(0)?.toUpperCase() || 'U'}
                </div>
                <span className="text-lg">{userData?.name || 'User'}</span>
                <span className="text-sm opacity-80">({userData?.role})</span>
              </div>
              <button 
                onClick={() => { handleLogout(); setIsMenuOpen(false); }}
                className="bg-red-600 text-white hover:bg-red-300 px-8 py-2.5 rounded-full transition-all duration-500"
              >
                Logout
              </button>
            </>
          ) : (
            <button 
              onClick={() => { setShowLoginPopup(true); setIsMenuOpen(false); }}
              className="bg-black text-white px-8 py-2.5 hover:bg-gray-500 rounded-full transition-all duration-500"
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
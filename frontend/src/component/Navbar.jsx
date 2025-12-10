import React from "react";
import { assets } from "../assets/assets.js";
import { Link,useNavigate } from "react-router-dom";

export default function Navbar () {
    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'Events', path: '/events' },
        { name: 'Experience', path: '/experience' },
        { name: 'About', path: '/about' },
    ];

    const [isScrolled, setIsScrolled] = React.useState(false);
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);

    React.useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);



    const navigate = useNavigate();

    const handleDashboardClick = () => {
        const loggedIn = localStorage.getItem("isLoggedIn");
        const role = localStorage.getItem("role");

        if (!loggedIn) {
            navigate("/login");
            return;
        }

        if (role === "organiser") {
            navigate("/organiser-dashboard");
        } else {
            navigate("/user-dashboard");
        }
    };


    return (
        <nav className={`fixed top-0 left-0 w-full flex items-center justify-between 
                    px-4 md:px-16 lg:px-24 xl:px-32 transition-all duration-500 z-50 
                    ${isScrolled ? "bg-white/20 shadow-md text-gray-700 backdrop-blur-lg py-3 md:py-4" : "py-4 md:py-6"}`}>

            {/* Logo */}
            <Link to="/" className="flex items-center gap-2">
                <img src={assets.logo} alt="Festro Logo" className={`h-12 w-20 object-contain ${!isScrolled && "invert"}`} />
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-4 lg:gap-8">
                {navLinks.map((link, i) => (
                    <a key={i} href={link.path} className={`group flex flex-col gap-0.5 
                                    ${isScrolled ? "text-gray-700" : "text-white"}`}>
                        {link.name}
                        <div className={`${isScrolled ? "bg-gray-700" : "bg-white"} h-0.5 w-0 
                        group-hover:w-full transition-all duration-300`} />
                    </a>
                ))}
                
                <button onClick={handleDashboardClick}
                className={`border px-4 py-1 text-sm font-light rounded-full 
                    cursor-pointer ${isScrolled ? 'text-black' : 'text-white'} transition-all`}
                >
                Dashboard
                </button>
            </div>

            {/* Desktop Right */}
            <div className="hidden md:flex items-center gap-4">
                {/* <svg className={`h-6 w-6 text-white transition-all duration-500 
                ${isScrolled ? "invert" : ""}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg> */}
                <button className={`px-8 py-2.5 rounded-full ml-4 transition-all 
                    duration-500 ${isScrolled ? "text-white bg-black" : "bg-white text-black"}`}>
                    Login
                </button>
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

            {/* Mobile Menu */}
            <div className={`fixed top-0 left-0 w-full h-screen bg-slate-500/96 
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
                    <a key={i} href={link.path} className={`group`} onClick={() => setIsMenuOpen(false)}>
                        {link.name}
                        <div className={`bg-white h-0.5 w-0 
                        group-hover:w-full transition-all duration-300`} />
                    </a>
                ))}

                <button onClick={() => { handleDashboardClick(); setIsMenuOpen(false); }}
                className="border px-4 py-1 text-sm font-light rounded-full cursor-pointer transition-all"
                >
                Dashboard
                </button>

                <button className="bg-black text-white px-8 py-2.5 rounded-full transition-all duration-500">
                    Login
                </button>
            </div>
        </nav>
    );
}


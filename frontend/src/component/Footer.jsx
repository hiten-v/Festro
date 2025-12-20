import { useNavigate } from "react-router-dom";
const Footer = ()=> {
  const navigate = useNavigate();
  return (
    <footer className="flex flex-col md:flex-row gap-3 items-center justify-around w-full py-4 text-sm bg-slate-800 text-white/70">
    <p>
        © {new Date().getFullYear()} Festro. All rights reserved.
    </p>

        <div className="flex items-center gap-4">
            <button onClick={() => navigate("/about")} className="hover:text-white transition-all">
                Contact Us
            </button>
            <div className="h-8 w-px bg-white/20"></div>
            <button onClick={() => navigate("/events")} className="hover:text-white transition-all">
                Events
            </button>
            <div className="h-8 w-px bg-white/20"></div>
            <button onClick={() => navigate("/experience#contact")} className="hover:text-white transition-all">
                Experience
            </button>
        </div>
    </footer>
  )
};

export default Footer;

const Footer = ()=> {
  return (
    <footer className="flex flex-col md:flex-row gap-3 items-center justify-around w-full py-4 text-sm bg-slate-800 text-white/70">
    <p>
        © {new Date().getFullYear()} Festro. All rights reserved.
    </p>

        <div className="flex items-center gap-4">
            <a href="/about" className="hover:text-white transition-all">
                Contact Us
            </a>
            <div className="h-8 w-px bg-white/20"></div>
            <a href="/events" className="hover:text-white transition-all">
                Events
            </a>
            <div className="h-8 w-px bg-white/20"></div>
            <a href="/experience" className="hover:text-white transition-all">
                Experience
            </a>
        </div>
    </footer>
  )
};

export default Footer;
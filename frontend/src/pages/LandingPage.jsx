import { motion } from "framer-motion";
import HeroSlider from "../component/HeroSlider";
import SuccessfulEvents from "../component/SucessfullEvents";
import TestimonialSlider from "../component/TestimonialSlider";

export default function LandingPage() {
  return (

    <div className="overflow-x-hidden font-sans bg-white text-gray-900">
      
      <HeroSlider />


      {/*form  */}
      <section className="w-full flex justify-center items-center bg-white py-10">
          <form className='bg-white text-gray-500 rounded-lg px-6 py-4  flex flex-col md:flex-row max-md:items-start gap-4 max-md:mx-auto'>

            <div>
                <div className='flex items-center gap-2'>
                    <svg className="w-4 h-4 text-gray-800" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" >
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 10h16M8 14h8m-4-7V4M7 7V4m10 3V4M5 20h14a1 1 0 0 0 1-1V7a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1Z" />
                    </svg>
                    <label htmlFor="destinationInput">Destination</label>
                </div>
                <input list='destinations' id="destinationInput" type="text" className=" rounded border border-gray-200 px-3 py-1.5 mt-1.5 text-sm outline-none" placeholder="Type here" required />
            </div>

            <div>
                <div className='flex items-center gap-2'>
                    <svg className="w-4 h-4 text-gray-800" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" >
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 10h16M8 14h8m-4-7V4M7 7V4m10 3V4M5 20h14a1 1 0 0 0 1-1V7a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1Z" />
                    </svg>
                    <label htmlFor="checkIn">Check in</label>
                </div>
                <input id="checkIn" type="date" className=" rounded border border-gray-200 px-3 py-1.5 mt-1.5 text-sm outline-none" />
            </div>

            <div>
                <div className='flex items-center gap-2'>
                    <svg className="w-4 h-4 text-gray-800" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" >
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 10h16M8 14h8m-4-7V4M7 7V4m10 3V4M5 20h14a1 1 0 0 0 1-1V7a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1Z" />
                    </svg>
                    <label htmlFor="checkOut">Check out</label>
                </div>
                <input id="checkOut" type="date" className=" rounded border border-gray-200 px-3 py-1.5 mt-1.5 text-sm outline-none" />
            </div>

            <div className='flex md:flex-col max-md:gap-2 max-md:items-center'>
                <label htmlFor="guests">Guests</label>
                <input min={1} max={4} id="guests" type="number" className=" rounded border border-gray-200 px-3 py-1.5 mt-1.5 text-sm outline-none  max-w-16" placeholder="0" />
            </div>

            <button className='flex items-center justify-center gap-1 rounded-md bg-black py-3 px-4 text-white my-auto cursor-pointer max-md:w-full max-md:py-1' >
                <svg className="w-4 h-4 text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" >
                    <path stroke="currentColor" strokeLinecap="round" strokeWidth="2" d="m21 21-3.5-3.5M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z" />
                </svg>
                <span>Search</span>
            </button>
          </form>
        </section>

      
      {/* SUCCESSFUL EVENTS */}
      <SuccessfulEvents />


      {/* SERVICES SECTION */}
      <section className="py-20 bg-slate-100 px-6">
        <h2 className="text-4xl font-bold text-center mb-12 text-slate-900">Our Services</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            "Venue Booking",
            "Vendor Management",
            "Live Event Tracking",
            "Guest Invitations",
            "Budget Planner",
            "Post Event Reports",
          ].map((service, i) => (
            <motion.div
              key={i}
              whileInView={{ opacity: 1, scale: 1 }}
              initial={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.5 + i * 0.1 }}
              className="p-8 bg-[#702c2c] flex flex-col justify-center items-center 
              rounded-xl shadow hover:shadow-md hover:shadow-[#a26363] transition ease-in duration-100"
            >
              <h3 className="text-xl font-semibold text-amber-50">{service}</h3>
              <p className="text-gray-300 mt-2">Professional event support.</p>
            </motion.div>
          ))}
        </div>
      </section>


      {/* STATS SECTION */}
      <section className="py-20 bg-linear-to-r from-slate-900 to-slate-500 text-slate-300 text-center">
        <h2 className="text-4xl font-bold mb-12">Our Impact</h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-10">

          {[
            ["800+", "Events Done"],
            ["95%", "Happy Clients"],
            ["1M+", "Guests Served"],
            ["200+", "Premium Vendors"],
          ].map(([num, title], index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              <h3 className="text-4xl font-extrabold">{num}</h3>
              <p className="mt-2">{title}</p>
            </motion.div>
          ))}
        </div>
      </section>


      {/* TESTIMONIALS */}
      {/* <section className="py-20 px-6">
        <h2 className="text-4xl font-bold text-center mb-12">What Clients Say</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {
            [
              "Amazing experience! They handled everything perfectly.",
              "Our event was a huge success thanks to their team.",
              "Professional and attentive service from start to finish.",
            ].map((id) => (
            <motion.div
              key={id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="p-8 bg-blue-50 shadow-lg rounded-xl"
            >
              <div className="w-20 h-20 rounded-full bg-amber-100 mx-auto animate-pulse"></div>
              <p className="text-center  mt-6 italic">"{id}"</p>
            </motion.div>
          ))}
        </div>
      </section> */}

      <TestimonialSlider />


      {/* CTA SECTION */}
      <section className="py-24 text-[#715A5A] bg-slate-100 text-center">
        <h2 className="text-4xl font-bold">Ready to plan your event?</h2>
        <p className="mt-4 text-lg opacity-90">
          Join us today and make your event truly unforgettable.
        </p>

        <motion.button
          whileHover={{ scale: 1.1 }}
          className="mt-8 px-10 py-4 text-[#c0a3a3] bg-slate-900 rounded-full font-bold shadow-lg"
        >
          Get Started
        </motion.button>
      </section>


      <section className="w-full flex justify-center items-center py-20">
        <div className="flex flex-col justify-center items-center rounded-2xl m-5 p-10 w-1/2 max-md:w-full bg-gray-900 text-white">
            <div className="flex flex-col justify-center items-center text-center">
                <h1 className="text-4xl md:text-[40px]">Stay Updated</h1>
                <p className="text-sm md:text-base text-gray-500/90 mt-2 max-w-xl">Join our newsletter and be the first to discover trending events near you.</p>
            </div>
            <div className="flex flex-col md:flex-row items-center justify-center gap-4 mt-6">
                <input type="text" className="bg-white/10 px-4 py-2.5 border border-white/20 rounded outline-none max-w-66 w-full" placeholder="Enter your email" />
                <button className="flex items-center justify-center gap-2 group bg-black px-4 md:px-7 py-2.5 rounded active:scale-95 transition-all">Subscribe
                    <svg className="w-4 h-4 text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 12H5m14 0-4 4m4-4-4-4" /></svg>
                </button>
            </div>
            <p className="text-gray-500 mt-6 text-xs text-center">By subscribing, you agree to our Privacy Policy and consent to receive updates.</p>
        </div>
      </section>

      {/* FOOTER */}
      {/* <footer className="py-10 text-center bg-gray-400 text-white text-sm"> */}
      <footer className="flex flex-col md:flex-row gap-3 items-center justify-around w-full py-4 text-sm bg-slate-800 text-white/70">
        <p>
            © {new Date().getFullYear()} Festro. All rights reserved.
        </p>

            <div className="flex items-center gap-4">
                <a href="#" className="hover:text-white transition-all">
                    Contact Us
                </a>
                <div className="h-8 w-px bg-white/20"></div>
                <a href="#" className="hover:text-white transition-all">
                    Privacy Policy
                </a>
                <div className="h-8 w-px bg-white/20"></div>
                <a href="#" className="hover:text-white transition-all">
                    Trademark Policy
                </a>
            </div>
        </footer>

    </div>
  );
}

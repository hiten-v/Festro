import { motion } from "framer-motion";
import HeroSlider from "../component/HeroSlider";
import SuccessfulEvents from "../component/SucessfullEvents";
import TestimonialSlider from "../component/TestimonialSlider";
import { useNavigate } from "react-router-dom";
import Newsletter from "../component/Newsletter"; 
const services = [
  {
    title: "Venue Booking",
    desc: "Find and book the perfect venue based on capacity, budget, and location.",
  },
  {
    title: "Vendor Management",
    desc: "Manage caterers, decorators, photographers, and other vendors in one place.",
  },
  {
    title: "Live Event Tracking",
    desc: "Track event progress, timelines, and live updates during the event.",
  },
  {
    title: "Guest Invitations",
    desc: "Send digital invitations, manage RSVPs, and guest lists effortlessly.",
  },
  {
    title: "Budget Planner",
    desc: "Plan, track, and optimize your event budget in real time.",
  },
  {
    title: "Post Event Reports",
    desc: "Generate analytics and reports to measure event success.",
  },
];




export default function LandingPage() {
  const navigate = useNavigate();
  return (

    <div className="overflow-x-hidden font-sans bg-white text-gray-900">
      
      <HeroSlider />

      
      {/* SUCCESSFUL EVENTS */}
      <SuccessfulEvents />


      {/* SERVICES SECTION */}
      <section className="py-20 bg-slate-100 px-6">
        <h2 className="text-4xl font-bold text-center mb-12 text-slate-900">
          Our Services
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, i) => (
            <motion.div
              key={i}
              whileInView={{ opacity: 1, scale: 1 }}
              initial={{ opacity: 0, scale: 0.85 }}
              transition={{ duration: 0.5 + i * 0.1 }}
              whileHover={{ scale: 1.05 }}
              className="relative group p-8 bg-[#702c2c]
                        rounded-xl shadow-lg cursor-pointer
                        overflow-hidden"
            >
              {/* Title */}
              <h3 className="text-xl font-semibold text-amber-50 text-center">
                {service.title}
              </h3>

              {/* Short text */}
              <p className="text-gray-300 mt-2 text-center">
                Professional event support.
              </p>

              {/* Hover overlay */}
              <div
                className="absolute inset-0 bg-[#8b3a3a]/98
                          flex items-center justify-center text-center
                          px-6 opacity-0 group-hover:opacity-100 focus:opacity-100
                          transition-opacity duration-300"
              >
                <p className="text-amber-50 text-sm leading-relaxed">
                  {service.desc}
                </p>
              </div>
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
              className="hover:scale-120 transition ease-in duration-300"
            >
              <h3 className="text-4xl font-extrabold">{num}</h3>
              <p className="mt-2">{title}</p>
            </motion.div>
          ))}
        </div>
      </section>


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
           onClick={() => navigate("/events")}
        >
          Get Started
        </motion.button>
      </section>



      <Newsletter />



    </div>
  );
}

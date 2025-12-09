import { motion } from "framer-motion";
import HeroSlider from "../component/HeroSlider";

export default function LandingPage() {
  return (



    <div className="overflow-x-hidden font-sans bg-white text-gray-900">
      
      <HeroSlider />

      {/* HERO SECTION */}
      <section className="h-screen flex flex-col justify-center items-center text-center px-6 bg-linear-to-br from-gray-500 to-yellow-600 text-white relative">
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-5xl md:text-6xl font-extrabold"
        >
          Make Your Event Unforgettable
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9 }}
          className="mt-4 text-xl max-w-2xl"
        >
          We help you plan, manage, and execute the perfect event—every single time.
        </motion.p>

        <motion.button
          whileHover={{ scale: 1.1 }}
          className="mt-8 px-8 py-4 bg-white text-indigo-700 rounded-full font-medium shadow-xl"
        >
          Get Started
        </motion.button>

        {/* floating gradient blob */}
        <div className="absolute top-20 right-20 w-40 h-40 bg-pink-400 opacity-20 blur-3xl rounded-full animate-pulse"></div>
      </section>

      
      {/* SUCCESSFUL EVENTS */}
      <section className="py-20 px-6">
        <h2 className="text-4xl font-bold text-center mb-12">Successful Events</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">

          {/* LEFT CARD */}
          <motion.div
            initial={{ opacity: 0, x: -80 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="rounded-xl shadow-lg p-6 bg-white hover:scale-105 transition"
          >
            <img src="https://picsum.photos/400/250?random=1" className="rounded-lg" />
            <h3 className="text-xl font-semibold mt-4">Corporate Summit</h3>
            <p className="mt-2 text-gray-600">Over 10,000 attendees.</p>
          </motion.div>

          {/* MIDDLE CARD */}
          <motion.div
            initial={{ opacity: 0, y: 80 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9 }}
            className="rounded-xl shadow-lg p-6 bg-white hover:scale-105 transition"
          >
            <img src="https://picsum.photos/400/250?random=2" className="rounded-lg" />
            <h3 className="text-xl font-semibold mt-4">Wedding Gala</h3>
            <p className="mt-2 text-gray-600">Designed with elegance.</p>
          </motion.div>

          {/* RIGHT CARD */}
          <motion.div
            initial={{ opacity: 0, x: 80 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="rounded-xl shadow-lg p-6 bg-white hover:scale-105 transition"
          >
            <img src="https://picsum.photos/400/250?random=3" className="rounded-lg" />
            <h3 className="text-xl font-semibold mt-4">Music Festival</h3>
            <p className="mt-2 text-gray-600">30+ artists performed.</p>
          </motion.div>
        </div>
      </section>


      {/* SERVICES SECTION */}
      <section className="py-20 bg-gray-100 px-6">
        <h2 className="text-4xl font-bold text-center mb-12">Our Services</h2>

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
              className="p-8 bg-white rounded-xl shadow hover:shadow-xl transition"
            >
              <h3 className="text-xl font-semibold">{service}</h3>
              <p className="text-gray-600 mt-2">Professional event support.</p>
            </motion.div>
          ))}
        </div>
      </section>


      {/* STATS SECTION */}
      <section className="py-20 bg-linear-to-r from-emerald-800 to-slate-500 text-white text-center">
        <h2 className="text-4xl font-bold mb-12">Our Impact</h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-10">

          {[
            ["1200+", "Events Done"],
            ["95%", "Happy Clients"],
            ["10M+", "Guests Served"],
            ["500+", "Premium Vendors"],
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
      <section className="py-20 px-6">
        <h2 className="text-4xl font-bold text-center mb-12">What Clients Say</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {[1, 2, 3].map((id) => (
            <motion.div
              key={id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="p-8 bg-white shadow-lg rounded-xl"
            >
              <div className="w-20 h-20 rounded-full bg-gray-300 mx-auto animate-pulse"></div>
              <p className="text-gray-700 mt-6 italic">
                “Amazing experience! They handled everything perfectly.”
              </p>
              <p className="text-center mt-4 font-semibold">User {id}</p>
            </motion.div>
          ))}
        </div>
      </section>


      {/* CTA SECTION */}
      <section className="py-24 bg-indigo-700 text-white text-center">
        <h2 className="text-4xl font-bold">Ready to plan your event?</h2>
        <p className="mt-4 text-lg opacity-90">
          Join us today and make your event truly unforgettable.
        </p>

        <motion.button
          whileHover={{ scale: 1.1 }}
          className="mt-8 px-10 py-4 bg-white text-indigo-700 rounded-full font-bold shadow-lg"
        >
          Get Started
        </motion.button>
      </section>


      {/* FOOTER */}
      <footer className="py-10 text-center bg-gray-900 text-white text-sm">
        © {new Date().getFullYear()} Eventify. All rights reserved.
      </footer>

    </div>
  );
}

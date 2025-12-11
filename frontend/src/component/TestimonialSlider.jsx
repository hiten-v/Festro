import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";

export default function TestimonialSlider() {
  const testimonials = [
    {
      name: "Aarav Sharma",
      role: "Corporate Client",
      rating: 5,
      img: "https://randomuser.me/api/portraits/men/32.jpg",
      text: "Amazing experience! They handled everything perfectly. The team was super professional.",
    },
    {
      name: "Isha Mehta",
      role: "Bride",
      rating: 5,
      img: "https://randomuser.me/api/portraits/women/45.jpg",
      text: "Our wedding was a huge success thanks to their flawless planning and elegant decor.",
    },
    {
      name: "Rohan Patel",
      role: "Startup Founder",
      rating: 4,
      img: "https://randomuser.me/api/portraits/men/21.jpg",
      text: "Professional and attentive service from start to finish. Highly recommended!",
    },
    {
      name: "Sneha Nair",
      role: "Music Festival Organizer",
      rating: 5,
      img: "https://randomuser.me/api/portraits/women/12.jpg",
      text: "They exceeded our expectations. The event flow was smooth and perfectly timed.",
    },
    {
      name: "Vikram Singh",
      role: "Event Sponsor",
      rating: 4,
      img: "https://randomuser.me/api/portraits/men/55.jpg",
      text: "Very smooth execution and great communication throughout the event.",
    },
    {
      name: "Priya Desai",
      role: "Fashion Show Host",
      rating: 5,
      img: "https://randomuser.me/api/portraits/women/68.jpg",
      text: "Stunning stage setup and lighting! Truly made the event memorable.",
    },
    {
      name: "Karan Sen",
      role: "Film Festival Director",
      rating: 5,
      img: "https://randomuser.me/api/portraits/men/69.jpg",
      text: "Their attention to detail and creativity brought our vision to life flawlessly.",
    },
    {
      name: "Anjali Rao",
      role: "Charity Event Coordinator",
      rating: 4,
      img: "https://randomuser.me/api/portraits/women/69.jpg",
      text: "The team was compassionate and efficient, making our charity event a great success.",
    },
    {
      name: "Devansh Gupta",
      role: "Tech Conference Speaker",
      rating: 5,
      img: "https://randomuser.me/api/portraits/men/75.jpg",
      text: "Impressive organization and top-notch facilities. Looking forward to the next one!",   
    }
  ];

  const ITEMS_PER_PAGE = 3;
  const [page, setPage] = useState(0);
  const totalPages = Math.ceil(testimonials.length / ITEMS_PER_PAGE);

  const nextPage = () => page < totalPages - 1 && setPage(page + 1);
  const prevPage = () => page > 0 && setPage(page - 1);

  const current = testimonials.slice(
    page * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE + ITEMS_PER_PAGE
  );

  return (
    <section className="py-20 px-6">
      <h2 className="text-4xl font-bold text-center mb-12">What Clients Say</h2>

      <div className="relative max-w-6xl mx-auto">

        {/* LEFT ARROW */}
        {page > 0 && (
          <button
            className="absolute left-0 top-1/2 -translate-y-1/2 bg-white shadow-lg p-3 m-3 rounded-full hover:bg-gray-100 z-20"
            onClick={prevPage}
          >
            <ChevronLeft size={28} />
          </button>
        )}

        {/* RIGHT ARROW */}
        {page < totalPages - 1 && (
          <button
            className="absolute right-0 top-1/2 -translate-y-1/2 bg-white shadow-lg p-3 m-3 rounded-full hover:bg-gray-100 z-20"
            onClick={nextPage}
          >
            <ChevronRight size={28} />
          </button>
        )}

        <div className="p-10 m-10 bg-slate-100 shadow-xl rounded-xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={page}
              initial={{ opacity: 0, x: 80 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -80 }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12"
            >
              {current.map((item, index) => (
                <div
                  key={index}
                  className="p-8 bg-white shadow-lg rounded-xl border border-gray-100"
                >
                  {/* Avatar */}
                  <img
                    src={item.img}
                    className="w-20 h-20 rounded-full mx-auto object-cover shadow-md"
                  />

                  {/* Name + Role */}
                  <h3 className="text-xl font-semibold text-center mt-4">
                    {item.name}
                  </h3>
                  <p className="text-center text-gray-500 text-sm">
                    {item.role}
                  </p>

                  {/* Stars */}
                  <div className="flex justify-center gap-1 mt-3">
                    {Array.from({ length: item.rating }).map((_, i) => (
                      <Star key={i} size={20} className="text-yellow-500 fill-yellow-500" />
                    ))}
                  </div>

                  {/* Testimonial Text */}
                  <p className="text-center mt-5 italic text-gray-700">
                    "{item.text}"
                  </p>
                </div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

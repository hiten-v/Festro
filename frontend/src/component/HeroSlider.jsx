import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ImagePreloader from "../component/ImagePreloader"; 

export default function HeroSlider() {
  const slides = [
    { src: "../landingimg/pic1.jpg", text: "Party Like There's No Tomorrow" },
    { src: "../landingimg/pic2.jpg", text: "Celebrate in Style" },
    { src: "../landingimg/pic3.jpg", text: "Your Event, Our Expertise" },
    { src: "../landingimg/pic4.jpg", text: "Making Moments Magical" },
    { src: "../landingimg/pic5.jpg", text: "Where Events Come Alive" },
    { src: "../landingimg/pic6.jpg", text: "Creating Unforgettable Experiences" },
  ];

  const [index, setIndex] = useState(0);

  // Auto-slide only (image loading handled by ImagePreloader)
  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <ImagePreloader images={slides.map((s) => s.src)}>
      <div className="relative w-full h-screen overflow-hidden">
        <AnimatePresence>
          <motion.div
            key={index}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
            className="absolute inset-0"
          >
            <img
              src={slides[index].src}
              className="w-full h-full object-cover"
            />

            {/* Overlay Text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white bg-black/30">
              <motion.h2
                initial={{ y: 40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="text-5xl max-md:text-4xl text-center m-3 font-bold drop-shadow-xl"
              >
                {slides[index].text}
              </motion.h2>

              <a href="/events" className="bg-slate-800/50 text-white px-8 py-2.5 m-7 rounded-full transition-all duration-200 hover:bg-slate-600">
                Get Started
              </a>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Dots */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-3">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              className={`w-3 h-3 rounded-full ${
                index === i ? "bg-white" : "bg-white/40"
              } transition-all`}
            ></button>
          ))}
        </div>
      </div>
    </ImagePreloader>
  );
}

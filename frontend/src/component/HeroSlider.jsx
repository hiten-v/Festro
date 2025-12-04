import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function HeroSlider() {
  const slides = [
    {
      type: "video",
      src: "/videos/event1.mp4",
    },
    {
      type: "image",
      src: "https://picsum.photos/2000/1200?random=20",
    },
    {
      type: "image",
      src: "https://picsum.photos/2000/1200?random=21",
    },
  ];

  const [index, setIndex] = useState(0);

  // Auto change every 10 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full h-screen overflow-hidden">
      <AnimatePresence>
        <motion.div
          key={index}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2 }}
          className="absolute inset-0"
        >
          {slides[index].type === "video" ? (
            <video
              src={slides[index].src}
              autoPlay
              muted
              loop
              className="w-full h-full object-cover"
            />
          ) : (
            <img
              src={slides[index].src}
              className="w-full h-full object-cover"
            />
          )}

          {/* Overlay text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white bg-black/30">
            <motion.h1
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="text-5xl md:text-7xl font-bold drop-shadow-xl"
            >
              Your Perfect Event Happens Here
            </motion.h1>

            <motion.p
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 1 }}
              className="mt-4 text-xl md:text-2xl opacity-90"
            >
              Seamless · Premium · Memorable
            </motion.p>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Dot indicators */}
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
  );
}

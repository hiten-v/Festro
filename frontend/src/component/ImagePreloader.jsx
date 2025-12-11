import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function ImagePreloader({ images = [], children }) {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!images || images.length === 0) {
      setLoaded(true);
      return;
    }

    let loadedCount = 0;

    images.forEach((src) => {
      const img = new Image();
      img.src = src;
      img.onload = () => {
        loadedCount++;
        if (loadedCount === images.length) setLoaded(true);
      };
    });
  }, [images]);

  if (!loaded) {
    return (
      <div className="w-full h-screen flex flex-col items-center justify-center bg-slate-600 text-white">
        <motion.div
          className="flex gap-2 text-4xl font-bold"
          initial="start"
          animate="end"
          variants={{
            start: {},
            end: { transition: { staggerChildren: 0.3, repeat: Infinity } },
          }}
        >
          <motion.span
            variants={{
              start: { opacity: 0.3 },
              end: { opacity: 1 },
            }}
            transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
          >
            •
          </motion.span>
          <motion.span
            variants={{
              start: { opacity: 0.3 },
              end: { opacity: 1 },
            }}
            transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
          >
            •
          </motion.span>
          <motion.span
            variants={{
              start: { opacity: 0.3 },
              end: { opacity: 1 },
            }}
            transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
          >
            •
          </motion.span>
        </motion.div>

        <p className="text-lg mt-3">Loading</p>
      </div>
    );
  }

  return children;
}

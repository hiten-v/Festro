import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Toast = ({ toast, setToast }) => {
  return (
    <AnimatePresence>
      {toast.show && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className={`fixed top-4 left-1/2 -translate-x-1/2 z-50
            px-6 py-3 rounded-lg shadow-lg flex items-center gap-4
            ${toast.type === "success" ? "bg-green-900" : "bg-red-900"}
            text-white min-w-[300px] max-w-md`}
        >
          <span className="flex-1 text-sm">{toast.message}</span>
          <button
            onClick={() => setToast((p) => ({ ...p, show: false }))}
            className="font-bold hover:opacity-80"
          >
            ✕
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Toast;
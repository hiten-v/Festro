import React, { useState } from 'react';
import { assets } from '../assets/assets';
import ForgotPass from './ForgotPass';
import { motion, AnimatePresence } from "framer-motion";

const LoginSignupPopup = ({ isOpen, onClose, onLoginSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    role: 'user' // 'user' or 'organiser'
  });

  const [errors, setErrors] = useState({
    name: false,
    email: false,
    password: false,
  });

  const resetForm = () => {
    setFormData({
      email: '',
      password: '',
      name: '',
      role: 'user',
    });
    resetErrors();
  };

  const resetErrors = () => {
    setErrors({
      name: false,
      email: false,
      password: false,
    });
  };
  
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success", // success | error
  });


  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast((prev) => ({ ...prev, show: false }));
    }, 3000);
  };

  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleChange = (e) => {
    const {name, value} = e.target;

    setFormData((prev)=>({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: value.trim() === "",
    }));
  };


  const API_URL = import.meta.env.VITE_API_URL;
  const handleSubmit = async (e) => {

    e.preventDefault();
  
    let newErrors = {
      email: formData.email.trim() === "" || !isValidEmail(formData.email),
      password: formData.password.trim() === "",
    };

    if (!isLogin) 
    {
      newErrors.name = formData.name.trim() === "";
    }

    setErrors(newErrors);

    // stop submit if any error exists
    if (Object.values(newErrors).some(Boolean)) return;

    const endpoint = isLogin ? 'login' : 'signup';
    
    try {
      const response = await fetch(`${API_URL}/api/auth/${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
        credentials: 'include' // IMPORTANT: Send cookies
      });

      const data = await response.json();
      
  //     if (response.ok) {
  //       // Store user info in localStorage
  //       localStorage.setItem('token', data.token);
  //       localStorage.setItem('user', JSON.stringify(data.user));
  //       localStorage.setItem('role', data.user.role);
  //       localStorage.setItem('isLoggedIn', 'true');
        
  //       onLoginSuccess();
  //       onClose();
  //       showToast(
  //         isLogin ? "Login successful!" : "Account created successfully!",
  //         "success"
  //       );
  //       // alert(isLogin ? 'Login successful!' : 'Account created successfully!');
  //     } else {
  //       showToast(data.message || "Something went wrong", "error");
  //       // alert(data.message || 'Something went wrong');
  //     }
  //   } catch (error) {
  //     console.error('Error:', error);
  //     // alert('Connection error. Please try again.');
  //     showToast("Connection error. Please try again.", "error");
  //   }
  // };
          if (response.ok) {
          // No need to store in localStorage anymore
          // Session cookie is automatically set by server
          
          onLoginSuccess();
          onClose();
          showToast(
            isLogin ? "Login successful!" : "Account created successfully!",
            "success"
          );
          resetForm();
        } else {
          showToast(data.message || "Something went wrong", "error");
        }
      } catch (error) {
        console.error('Error:', error);
        showToast("Connection error. Please try again.", "error");
      }
    };


  const [showForgot, setShowForgot] = useState(false);

  if (!isOpen) return null;

  return (
    <AnimatePresence mode="wait">
      <div className="fixed inset-0 z-50 transition ease-in duration-1000 flex items-center justify-center bg-white/10 backdrop-blur-sm">
        {toast.show && (
        <div
          className={`fixed top-2 left-1/2 -translate-x-1/2 z-50
          px-6 py-3 rounded-lg shadow-lg flex items-center gap-4
          ${toast.type === "success" ? "bg-green-900" : "bg-red-900 "}
          text-white transition-all duration-300 ease-out`}
        >
          <span>{toast.message}</span>
          <button
            onClick={() => setToast((p) => ({ ...p, show: false }))}
            className="font-bold"
          >
            ✕
          </button>
        </div>
      )}
      <motion.div
        initial={{ opacity: 0, y: -80 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -80 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="fixed inset-0 z-50 flex items-center justify-center"
      >
      <motion.div
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.95 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-md p-8 rounded-2xl"
      >
      {!showForgot && (
        <div className="relative bg-slate-800 rounded-2xl p-8 w-full max-w-md">
          {/* Close Button */}
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-300 hover:text-gray-500"
          >
            ✕
          </button>

          {/* Logo */}
          <div className="flex justify-center mb-6 invert">
            <img src={assets.logo} alt="Logo" className="h-12" />
          </div>

          {/* Toggle between Login/Signup */}
          <div className="flex mb-8 border-b border-black">
            <button
              className={`flex-1 py-3 font-medium ${isLogin ? 'text-gray-400 border-b-2 border-gray-400' : 'text-black'}`}
              onClick={() => {
                setIsLogin(true);
                resetForm();
              }}
            >
              Login
            </button>
            <button
              className={`flex-1 py-3 font-medium ${!isLogin ? 'text-gray-400 border-b-2 border-gray-400' : 'text-black'}`}
              onClick={() => {
                setIsLogin(false);
                resetForm();
              }}
            >
              Sign Up
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full bg-white/10 text-white/30 px-4 py-2.5 border border-white/20 rounded-lg focus:outline-none focus:ring-2 ${errors.name ? "ring-red-800 shadow-red-400" : "focus:ring-white/50" }  placeholder:text-white/30`}
                  placeholder="Enter your name"
                />
                {errors.name && (
                  <p className="text-red-400 text-sm">Name is required</p>
                )}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">
                Email
              </label>
              <input
                type="text"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full bg-white/10 text-white/30 px-4 py-2.5 border border-white/20 rounded-lg focus:outline-none focus:ring-2 ${errors.email ? "ring-red-800 shadow-red-400" : "focus:ring-white/50" }  placeholder:text-white/30`}
                placeholder="Enter your email"
              />
              {errors.email && (
                <p className="text-red-400 text-sm">
                  {formData.email.trim() === ""
                    ? "Email is required"
                    : "Invalid email format"}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full bg-white/10 text-white/30 px-4 py-2.5 border border-white/20 rounded-lg focus:outline-none focus:ring-2 ${errors.password ? "ring-red-800 shadow-red-400" : "focus:ring-white/50" }  placeholder:text-white/30`}
                placeholder="Enter your password"
              />
              {errors.password && (
                <p className="text-red-400 text-sm">Password is required</p>
              )}
            </div>

            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">
                  I want to:
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center text-gray-400">
                    <input
                      type="radio"
                      name="role"
                      value="user"
                      checked={formData.role === 'user'}
                      onChange={handleChange}
                      className="mr-2"
                    />
                    Attend Events
                  </label>
                  <label className="flex items-center text-gray-400">
                    <input
                      type="radio"
                      name="role"
                      value="organiser"
                      checked={formData.role === 'organiser'}
                      onChange={handleChange}
                      className="mr-2"
                    />
                    Organise Events
                  </label>
                </div>
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-black text-slate-200 py-3 rounded-lg font-medium hover:bg-gray-500"
            >
              {isLogin ? 'Login' : 'Create Account'}
            </button>

          </form>

          {/* Forgot Password */}
          
          {isLogin && (
            <div className="mt-4 text-center">
              <button
                className="text-sm text-gray-400 hover:text-black"
                onClick={() => setShowForgot(true)}
              >
                Forgot password?
              </button>
            </div>
          )}
        </div>
      )}
      </motion.div>
      </motion.div>
      {showForgot && (
        <motion.div
          initial={{ opacity: 0, y: -80 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -80 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="fixed inset-0 z-50 flex items-center justify-center"
        >
          <motion.div
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.95 }}
            transition={{ duration: 0.5 }}
            className="relative w-full max-w-md p-8 rounded-2xl"
          >

            <ForgotPass 
              isOpen={showForgot}
              onClose={() => {
                setShowForgot(false);
                onClose(); // closes entire auth flow
              }}
              onBack={() => setShowForgot(false)}
            />
          </motion.div>
        </motion.div>
      )}
    </div>
    </AnimatePresence>
  );
};


export default LoginSignupPopup;
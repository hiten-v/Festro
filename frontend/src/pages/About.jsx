import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Toast from '../component/Toast';
import { 
  FaGlobe, 
  FaTicketAlt, 
  FaShieldAlt, 
  FaChartLine, 
  FaCalendarCheck, 
  FaUserFriends,
  FaGithub, 
  FaLinkedin, 
  FaTwitter,
  FaInstagram,
} from 'react-icons/fa';

const About = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const features = [
    {
      icon: <FaGlobe className="text-2xl text-[#702c2c]" />,
      title: "Nationwide Events",
      description: "Discover events across India, from local meetups to national festivals."
    },
    {
      icon: <FaTicketAlt className="text-2xl text-[#702c2c]" />,
      title: "Easy Ticket Booking",
      description: "Simple, secure booking process with instant confirmation."
    },
    {
      icon: <FaShieldAlt className="text-2xl text-[#702c2c]" />,
      title: "Secure Payments",
      description: "Trusted payment gateways with SSL encryption for all transactions."
    },
    {
      icon: <FaCalendarCheck className="text-2xl text-[#702c2c]" />,
      title: "Event Management",
      description: "Complete tools for organizers to create and manage their events."
    },
    {
      icon: <FaUserFriends className="text-2xl text-[#702c2c]" />,
      title: "Community Building",
      description: "Connect with like-minded people and build communities around interests."
    }
  ];

  const [toast, setToast] = useState({
      show: false,
      message: "",
      type: "success",
    });
  
    const showToast = (message, type = "success") => {
      setToast({ show: true, message, type });
      setTimeout(() => {
        setToast((prev) => ({ ...prev, show: false }));
      }, 3000);
    };

  const developers = [
    {
      name: "Hiten Vaid",
      role: "Full Stack Developer",
      // avatar: "https://media.licdn.com/dms/image/v2/D5635AQFhomkTUte_kA/profile-framedphoto-shrink_400_400/profile-framedphoto-shrink_400_400/0/1714657742353?e=1766750400&v=beta&t=8AV7Mkb3TUV-Y7u0O9f7hRIvquN009PonFTk5bKeUEk",
      bio: "Passionate about creating seamless user experiences with modern web technologies.",
      social: {
        github: "https://github.com/hiten-v",
        linkedin: "https://linkedin.com/in/hiten-v",
        instagram: "https://instagram.com/hitenvaid"
      }
    },
    {
      name: "Shreyansh Tripathi",
      role: "Full Stack Developer",
      // avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?auto=format&fit=crop&q=80&w=100",
      bio: "Design enthusiast focused on creating intuitive and beautiful interfaces.",
      social: {
        github: "https://github.com/priya",
        linkedin: "https://linkedin.com/in/priya",
        instagram: "https://instagram.com/priya"
      }
    },
    {
      name: "Himanshu",
      role: "Full Stack Developer",
      // avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=100",
      bio: "Expert in scalable backend systems and database architecture.",
      social: {
        github: "https://github.com/rahul",
        linkedin: "https://linkedin.com/in/rahul",
        twitter: "https://twitter.com/rahul"
      }
    }
  ];

  const stats = [
    { value: "500+", label: "Events Hosted" },
    { value: "10,000+", label: "Happy Attendees" },
    { value: "50+", label: "Cities Covered" },
    { value: "99%", label: "Satisfaction Rate" }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await fetch(`${process.env.VITE_API_URL}/api/auth/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        showToast(data.message || 'Message sent successfully!', 'success');
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        showToast(data.message || 'Failed to send message. Please try again.', 'error');
      }
    } catch (error) {
      console.error('Contact form submission error:', error);
      showToast('Network error. Please check your connection and try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-[#ebe9e1] text-slate-900 ">
      <Toast toast={toast} setToast={setToast} />
      <div className="w-full bg-slate-900 top-0 bottom-90 p-11.5"></div>
      <div className="max-w-7xl mx-auto pt-15 pb-16 px-4 md:px-8">
        
        {/* Hero Section */}
        <motion.div 
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          // animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16 transition ease-in max-md:m-10"
        >
          <h1 className="text-4xl md:text-5xl font-extrabold mb-6">
            About <span className="text-[#702c2c]">Festro</span>
          </h1>
          <p className="text-xl text-stone-600 max-w-3xl mx-auto mb-8">
            Connecting people with unforgettable experiences. We're on a mission to make event discovery 
            and management simple, secure, and enjoyable for everyone.
          </p>
          <div className="flex flex-wrap justify-center gap-6 mt-8">
            {stats.map((stat, index) => (
              <div key={index} className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm text-center min-w-[140px]">
                <div className="text-3xl font-bold text-[#702c2c] mb-2">{stat.value}</div>
                <div className="text-sm text-stone-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Why Choose Us */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why Choose Festro?</h2>
            <p className="text-stone-600 max-w-2xl mx-auto">
              We're revolutionizing the way people discover, book, and experience events.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-md:m-10">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm hover:scale-105 transition ease-in duration-200 hover:shadow-md"
              >
                <div className="w-12 h-12 rounded-lg bg-[#702c2c]/10 flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-stone-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Our Story */}
        <section className="mb-20 bg-white rounded-2xl p-8 md:p-12 border border-stone-200 shadow-sm max-md:m-10">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="lg:w-1/2">
              <img 
                src="/logo.png" 
                alt="Festro" 
                className="w-full h-auto"
              />
            </div>
            <div className="lg:w-1/2">
              <h2 className="text-3xl font-bold mb-6 text-[#702c2c]">Our Story</h2>
              <div className="space-y-4 text-stone-600">
                <p>
                  Founded in 2025, Festro began with a simple idea: make event discovery as easy as 
                  scrolling through your social feed. We noticed how difficult it was to find quality 
                  events in one place, and how organizers struggled with complicated booking systems.
                </p>
                <p>
                  Today, we're proud to serve thousands of users across India, helping them discover 
                  concerts, workshops, meetups, and festivals. Our platform bridges the gap between 
                  event organizers and attendees, creating meaningful connections through shared experiences.
                </p>
                <p>
                  We believe in the power of community and the magic of live experiences. Every feature 
                  we build is designed with this philosophy in mind.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Meet Our Team */}
        <section className="mb-20 max-md:m-10">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Meet Our Team</h2>
            <p className="text-stone-600 max-w-2xl mx-auto">
              The passionate individuals behind Festro's success.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {developers.map((dev, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="bg-white rounded-xl border border-stone-200 p-6 text-center shadow-sm hover:shadow-md transition-shadow"
              >
                {/* <img 
                  src={dev.avatar} 
                  alt={dev.name}
                  className="w-24 h-24 rounded-full mx-auto mb-4 object-cover border-4 border-[#702c2c]/10"
                /> */}
                <h3 className="text-xl font-bold mb-1">{dev.name}</h3>
                <p className="text-[#702c2c] font-medium mb-3">{dev.role}</p>
                <p className="text-stone-600 text-sm mb-6">{dev.bio}</p>
                
                <div className="flex justify-center gap-4">
                  {dev.social.github && (
                    <a href={dev.social.github} target="_blank" rel="noopener noreferrer" 
                      className="w-10 h-10 rounded-full bg-stone-100 flex items-center justify-center hover:bg-[#702c2c] hover:text-white transition-colors">
                      <FaGithub />
                    </a>
                  )}
                  {dev.social.linkedin && (
                    <a href={dev.social.linkedin} target="_blank" rel="noopener noreferrer"
                      className="w-10 h-10 rounded-full bg-stone-100 flex items-center justify-center hover:bg-[#702c2c] hover:text-white transition-colors">
                      <FaLinkedin />
                    </a>
                  )}
                  {dev.social.twitter && (
                    <a href={dev.social.twitter} target="_blank" rel="noopener noreferrer"
                      className="w-10 h-10 rounded-full bg-stone-100 flex items-center justify-center hover:bg-[#702c2c] hover:text-white transition-colors">
                      <FaTwitter />
                    </a>
                  )}
                  {dev.social.instagram && (
                    <a href={dev.social.instagram} target="_blank" rel="noopener noreferrer"
                      className="w-10 h-10 rounded-full bg-stone-100 flex items-center justify-center hover:bg-[#702c2c] hover:text-white transition-colors">
                      <FaInstagram />
                    </a>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </section>


        {/* Contact Form */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-2xl p-8 border border-stone-200 shadow-sm flex-col justify-center items-center max-md:m-10"
        >
          <h2 className="text-3xl font-bold mb-2">Get In Touch</h2>
          <p className="text-stone-600 mb-8">Have questions? We'd love to hear from you.</p>
          
          
          <form onSubmit={handleSubmit} className="space-y-6" id="contact">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Your Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-lg focus:ring-2 focus:ring-[#702c2c]/20 focus:border-[#702c2c] outline-none"
                  placeholder="John Doe"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-lg focus:ring-2 focus:ring-[#702c2c]/20 focus:border-[#702c2c] outline-none"
                  placeholder="john@example.com"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Subject *
              </label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-lg focus:ring-2 focus:ring-[#702c2c]/20 focus:border-[#702c2c] outline-none"
                placeholder="How can we help?"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Message *
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows="5"
                className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-lg focus:ring-2 focus:ring-[#702c2c]/20 focus:border-[#702c2c] outline-none"
                placeholder="Tell us about your inquiry..."
              />
            </div>
            
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-3.5 rounded-lg font-medium flex items-center justify-center gap-2 transition-all ${isSubmitting ? 'bg-stone-400 cursor-not-allowed' : 'bg-[#702c2c] hover:bg-[#5a2323] shadow-lg shadow-[#702c2c]/20'} text-white`}
            >
              {isSubmitting ? 
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Sending...
                </>
                : (
                  <>
                    Send Message
                  </>
                )}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default About;
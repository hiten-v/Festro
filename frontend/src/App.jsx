import React from "react";
import Navbar from "./component/Navbar";
import Footer from "./component/Footer";
import LandingPage from "./pages/LandingPage";
import About from "./pages/About";
import Events from "./pages/Events";
import Experience from "./pages/Experience";
import OrgDash from "./pages/OrganiserDashboard";
import UserDash from "./pages/UserDashboard";
import { Route,Routes, useLocation } from "react-router-dom";
import ProtectedRoute from "./component/ProtectedRoute";
import BookingPage from './pages/BookingPage';
function App() {
  // const isOwnerPath=useLocation().pathname.includes("owner");
    return (
      <>
        {/* {!isOwnerPath && <Navbar/>} */}
        <Navbar/>
        {/* <div className="min-h-[70vh]"> */}
          <Routes>
            <Route path="/" element={<LandingPage/>} />
            <Route path="/about" element={<About/>} />
            <Route path="/events" element={<Events/>} />
            <Route path="/experience" element={<Experience/>} />
            <Route path="/book/:eventId" element={<BookingPage />} />
            {/* Protected Routes */}
            <Route path="/user/dashboard" element={
              <ProtectedRoute requiredRole="user">
                <UserDash/>
              </ProtectedRoute>
            } />
            
            <Route path="/organiser/dashboard" element={
              <ProtectedRoute requiredRole="organiser">
                  <OrgDash/>
              </ProtectedRoute>
            } />

          </Routes>
        <Footer/>
        {/* </div> */}
      </>
    )
}

export default App;
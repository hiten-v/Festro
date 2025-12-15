import React from "react";
import Navbar from "./component/Navbar";
import LandingPage from "./pages/LandingPage";
import About from "./pages/About";
import Events from "./pages/Events";
import Experience from "./pages/Experience";
import OrgDash from "./pages/OrgDash";
import UserDash from "./pages/UserDash";
import { Route,Routes, useLocation } from "react-router-dom";
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
            <Route path="/organiser/dashboard" element={<OrgDash/>} />
            <Route path="/user/dashboard" element={<UserDash/>} />
            
          </Routes>
        {/* </div> */}
      </>
    )
}

export default App;

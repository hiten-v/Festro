import React from "react";
import Navbar from "./component/Navbar";
import LandingPage from "./pages/LandingPage";
import { Route,Routes, useLocation } from "react-router-dom";
function App() {
  const isOwnerPath=useLocation().pathname.includes("owner");
    return (
      <>
        {!isOwnerPath && <Navbar/>}
        <div className="min-h-[70vh]">
          <Routes>
            <Route path="/" element={<LandingPage/>} />
          </Routes>
        </div>
        <LandingPage/>
      </>
    )
}

export default App;

import React from "react";
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';

import Home from "./pages/home";
import Fund from "./pages/fund";
import Proposal from "./pages/proposal";
import AdminPortal from "./pages/adminportal";
import ViewProposals from "./pages/viewproposal";
import DetailProposal from "./pages/detailproposal";

import Navbar from "./components/Navbar"; // Import the Navbar component



function App() {
  return (
    <BrowserRouter>
      <ConditionalNavbar />
      <div className="app-container">
        <div className="content-wrapper">
          <Routes>
            {/* Define routes here */}
            <Route path="/" element={<Home />} /> {/* Home page route */}
            <Route path="/launch" element={<Fund />} /> {/* Launch page route */}
            <Route path="/fund" element={<Fund />} /> {/* Fund page route */}
            <Route path="/createproposal" element={<Proposal />} />
            <Route path="/viewdetailproposal" element={<DetailProposal/>}/>
            <Route path="/admin" element={<AdminPortal />} />
            <Route path="/proposal" element={<ViewProposals />} />
            {/* Add other routes as necessary */}
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

// Define a new component to conditionally render the Navbar
const ConditionalNavbar = () => {
  const location = useLocation();

  // Define the routes where the Navbar should appear
  const navbarRoutes = ['/launch', '/fund', '/createproposal','/proposal', '/viewdetailproposal'];

  // Render the Navbar only on the specified routes
  return navbarRoutes.includes(location.pathname) ? <Navbar /> : null;
}

export default App;

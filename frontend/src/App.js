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
            <Route path="/viewdetailproposal/:id" element={<DetailProposal />} />
            <Route path="/admin" element={<AdminPortal />} />
            <Route path="/proposal" element={<ViewProposals />} />
            {/* Add other routes as necessary */}
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

const ConditionalNavbar = () => {
  const location = useLocation();

  // Define the routes where the Navbar should appear
  const navbarRoutes = ['/launch', '/fund', '/createproposal', '/proposal'];

  // Include a condition to check for dynamic paths starting with '/viewdetailproposal/'
  const showNavbar = navbarRoutes.includes(location.pathname) || location.pathname.startsWith('/viewdetailproposal/');

  // Render the Navbar only if the condition is met
  return showNavbar ? <Navbar /> : null;
}

export default App;

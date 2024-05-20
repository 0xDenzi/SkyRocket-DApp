import React from "react";
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Home from "./pages/home";
import Fund from "./pages/fund";
import Gov from "./pages/gov";
import './App.css'; // Import CSS file for styling
import Bajwa from "./pages/Bajwa";
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
            <Route path="/governance" element={<Gov />} /> {/* Governance page route */}
            <Route path="/bajwa" element={<Bajwa />} />
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
  const navbarRoutes = ['/launch', '/fund', '/governance'];

  // Render the Navbar only on the specified routes
  return navbarRoutes.includes(location.pathname) ? <Navbar /> : null;
}

export default App;

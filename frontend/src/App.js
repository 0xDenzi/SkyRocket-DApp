import React from "react";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from "./pages/home";
import Fund from "./pages/fund";
import Gov from "./pages/gov";
import './App.css'; // Import CSS file for styling
import Bajwa from "./pages/Bajwa";

function App() {
  return (
    <BrowserRouter>
      <div className="app-container">
        <div className="content-wrapper">
          <Routes>
            {/* Define routes here */}
            <Route path="/" element={<Home />} /> {/* Home page route */}
            <Route path="/launch" element={<Fund />} /> {/* Funding page route */}
            <Route path="/fund" element={<Fund />} />
            <Route path="/governance" element={<Gov />} />
            <Route path="/bajwa" element={<Bajwa />} />
            {/* Add other routes as necessary */}
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;

import React from "react";
import Header from "./components/Header/Header";
import About from "./components/About/About";
import Work from "./components/Work/Work";
import Footer from "./components/Footer/footer";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from "./pages/home";
import Fund from "./pages/fund";
import Gov from "./pages/gov";
import './App.css'; // Import CSS file for styling

function App() {
  return (
    <BrowserRouter>
      <div className="app-container">
        <Header />
        <About />
        <Work />
        <div className="content-wrapper">
          {/* Routes component wrapped inside a div */}
          <div className="routes-wrapper">
            <Routes>
              <Route path="/launch" element={<Fund />} />
              <Route path="/fund" element={<Fund />} />
              <Route path="/governance" element={<Gov />} />
              {/* Define other routes as needed */}
            </Routes>
          </div>
        </div>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;

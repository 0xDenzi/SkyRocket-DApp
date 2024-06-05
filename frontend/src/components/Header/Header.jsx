import React from 'react';
import { Navbar as BootstrapNavbar, Nav, Container } from 'react-bootstrap';
import { FaBuilding, FaBullhorn, FaBuffer } from 'react-icons/fa';
import { BsFillRocketTakeoffFill } from "react-icons/bs";
import Button from 'react-bootstrap/Button';
import { Link } from 'react-router-dom';
import { Link as ScrollLink } from 'react-scroll';  // Import ScrollLink for smooth scrolling
import './Header.css';
import About from '../About/About';  // Import About component

const Header = () => {
  return (
    <div>
      <header>
        <section className="hero" id="hero">
          <BootstrapNavbar bg="dark" variant="dark" expand="md" collapseOnSelect>
            <BootstrapNavbar.Brand as={Link} to="/" className="SR">Sky<span>Rocket</span><BsFillRocketTakeoffFill/></BootstrapNavbar.Brand>
            <Container>
              <BootstrapNavbar.Toggle aria-controls="basic-navbar-nav" />
              <BootstrapNavbar.Collapse className="NC" id="basic-navbar-nav">
                <Nav className='navbar-nav'>
                  <Nav.Link as="a" href="/"><FaBuilding />Home</Nav.Link>
                  <Nav.Link as={ScrollLink} to="about-section" spy={true} smooth={true} duration={500} offset={-70}><FaBullhorn />About</Nav.Link>
                  <Nav.Link href="https://skyrocket-1.gitbook.io/docs"><FaBuffer />Docs</Nav.Link>
                  <Link to="/fund">
                    <Button className="Appbtn">Launch App <BsFillRocketTakeoffFill/></Button>
                  </Link>
                </Nav>
              </BootstrapNavbar.Collapse>
            </Container>
          </BootstrapNavbar>

          <div className="container">
            <h1>Empowering Innovations with Community-Driven Funding</h1>
            <p>Join the decentralized movement to fund and elevate groundbreaking projects.</p>
            <Link to="/fund">
              <button>Start Funding</button>
            </Link>
            <Link to="/proposal">
              <button>Submit Project</button>
            </Link>
          </div>
        </section>
      </header>
      
    </div>
  );
};

export default Header;

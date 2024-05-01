// Header.jsx
import React from 'react';
import { Navbar, Nav, Container, NavbarCollapse } from 'react-bootstrap';
import { FaBuilding, FaBullhorn, FaBuffer } from 'react-icons/fa';
import Button from 'react-bootstrap/Button';
import './Header.css';

const Header = () => {
  return (
    <header>
      <section className="hero">
        <Navbar bg="dark" variant="dark" expand="md" collapseOnSelect>
        <Navbar.Brand href="/" className="SR">Sky<span>Rocket</span></Navbar.Brand>
          <Container>
            
            <Navbar.Toggle aria-controls="basic-navnar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className='navbar-nav'>
                <Nav.Link href="/Home"><FaBuilding />Home</Nav.Link>
                <Nav.Link href='/Ride'><FaBullhorn />About</Nav.Link>
                <Nav.Link href="/Services"><FaBuffer />Work</Nav.Link>
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>

        <div className="container">
          <h1>Empowering Innovations with Community-Driven Funding</h1>
          <p>Join the decentralized movement to fund and elevate groundbreaking projects..</p>
          <button>Start Funding</button>
          <button>Submit Project</button>          
        </div>
      </section>
    </header>
  );
};

export default Header;

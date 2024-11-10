import React, { useState } from "react";
import styled from "styled-components";
import logo from "../assets/logo4.jpg";
import { GiHamburgerMenu } from "react-icons/gi";
import { VscChromeClose } from "react-icons/vsc";
import { AiOutlineMenu } from "react-icons/ai"; // Icon for the sidebar toggle
import { Link } from "react-router-dom"; // Import Link from react-router-dom
import Sidebar from "./Sidebar"; // Import the Sidebar component

export default function Navbar() {
  const [navbarState, setNavbarState] = useState(false);
  const [sidebarState, setSidebarState] = useState(false); // Sidebar toggle state

  const toggleSidebar = () => setSidebarState(!sidebarState); // Function to toggle sidebar

  return (
    <>
      <Nav>
        <div className="brand">
          <div className="container">
            <img src={logo} alt="" />
            TraveM8
          </div>
          <div className="toggle">
            {navbarState ? (
              <VscChromeClose onClick={() => setNavbarState(false)} />
            ) : (
              <GiHamburgerMenu onClick={() => setNavbarState(true)} />
            )}
          </div>
        </div>

        <ul>
          <li>
            <Link to="#home">Home</Link>
          </li>
          <li>
            <Link to="#services">About</Link>
          </li>
          <li>
            <Link to="#recommend">Places</Link>
          </li>
          <li>
            <Link to="#testimonials">Testimonials</Link>
          </li>
          <li>
            <Link to="/login">Login</Link> {/* Link to Login page */}
          </li>
          <li>
            <Link to="/signup">Sign Up</Link> {/* Link to Sign Up page */}
          </li>
        </ul>
      </Nav>

      {/* Sidebar Toggle Button */}
      <SidebarToggle onClick={toggleSidebar}>
        <AiOutlineMenu size={24} />
      </SidebarToggle>

      {/* Sidebar */}
      <Sidebar state={sidebarState} toggleSidebar={toggleSidebar} />

      <ResponsiveNav state={navbarState}>
        <ul>
          <li>
            <Link to="#home" onClick={() => setNavbarState(false)}>
              Home
            </Link>
          </li>
          <li>
            <Link to="#services" onClick={() => setNavbarState(false)}>
              About
            </Link>
          </li>
          <li>
            <Link to="#recommend" onClick={() => setNavbarState(false)}>
              Places
            </Link>
          </li>
          <li>
            <Link to="#testimonials" onClick={() => setNavbarState(false)}>
              Testimonials
            </Link>
          </li>
          <li>
            <Link to="/pages/signIn/login" onClick={() => setNavbarState(false)}> {/* Link to Login page */}
              Login
            </Link>
          </li>
          <li>
            <Link to="/pages/SignUp/SignupGeneral" onClick={() => setNavbarState(false)}> {/* Link to Login page */}
              Login
            </Link>
          </li>
        </ul>
      </ResponsiveNav>
    </>
  );
}



const Nav = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  .brand {
    .container {
      cursor: pointer;
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 0.4rem;
      font-size: 1.2rem;
      font-weight: 900;
      text-transform: uppercase;
      img {
        width: 90px; /* Adjust the width */
        height: auto; /* This keeps the aspect ratio */
      }
    }
    .toggle {
      display: none;
    }
  }
  ul {
    display: flex;
    gap: 1rem;
    list-style-type: none;
    li {
      a {
        text-decoration: none;
        color: #0077b6;
        font-size: 1.2rem;
        transition: 0.1s ease-in-out;
        &:hover {
          color: #023e8a;
        }
      }
      &:first-of-type {
        a {
          color: #023e8a;
          font-weight: 900;
        }
      }
    }
  }
  button {
    padding: 0.5rem 1rem;
    cursor: pointer;
    border-radius: 1rem;
    border: none;
    color: white;
    background-color: #48cae4;
    font-size: 1.1rem;
    letter-spacing: 0.1rem;
    text-transform: uppercase;
    transition: 0.3s ease-in-out;
    &:hover {
      background-color: #023e8a;
    }
  }
  @media screen and (min-width: 280px) and (max-width: 1080px) {
    .brand {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
      .toggle {
        display: block;
      }
    }
    ul {
      display: none;
    }
    button {
      display: none;
    }
  }
`;

const SidebarToggle = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: #0077b6; /* Color for the icon */
  font-size: 1.5rem; /* Adjust the size as needed */
  margin-left: 1rem; /* Adjust the margin as needed */
  transition: color 0.3s ease;

  &:hover {
    color: #023e8a; /* Color change on hover */
  }
`;

const ResponsiveNav = styled.div`
  display: flex;
  position: absolute;
  z-index: 1;
  top: ${({ state }) => (state ? "50px" : "-400px")};
  background-color: white;
  height: 30vh;
  width: 100%;
  align-items: center;
  transition: 0.3s ease-in-out;
  ul {
    list-style-type: none;
    width: 100%;
    li {
      width: 100%;
      margin: 1rem 0;
      margin-left: 2rem;
      a {
        text-decoration: none;
        color: #0077b6;
        font-size: 1.2rem;
        transition: 0.1s ease-in-out;
        &:hover {
          color: #023e8a;
        }
      }
      &:first-of-type {
        a {
          color: #023e8a;
          font-weight: 900;
        }
      }
    }
  }
`;

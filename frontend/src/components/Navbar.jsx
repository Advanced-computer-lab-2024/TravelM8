import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import LoginPage from "../pages/signIn/signin";
import SignupDialog from "../pages/SignUp/signup";
import NotificationBadge from "@/components/notificationBadge.jsx";
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { Separator } from "@/components/ui/separator.tsx";

export default function Navbar(count) {
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  const [isSignupOpen, setIsSignupOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); 
  const [anchorEl, setAnchorEl] = useState(null);
  const [userName, setUserName] = useState(null);
  const token = localStorage.getItem('token');
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    // Clear authentication token or session data
    localStorage.removeItem("token"); // Example: Removing a token
    setIsLoggedIn(false); // Update login status
    navigate("/"); // Optionally redirect to home or login page
  };

  useEffect(() => {
    if (token) {
      const decodedToken = decodeToken(token);
      if (decodedToken && decodedToken.userId) {
        setUserName(decodedToken.username);
      }
    }
  }, []);
  const decodeToken = (token) => {
    try {
      const payload = token.split('.')[1]; // JWT is in 'header.payload.signature' format
      const decodedPayload = JSON.parse(atob(payload)); // atob decodes from base64
      return decodedPayload;
    } catch (e) {
      console.error('Failed to decode token:', e);
      return null;
    }
  };

  const openSignup = () => {
    setIsSignupOpen(true);
    setIsLoginOpen(false);
  };

  const openLogin = () => {
    setIsLoginOpen(true);
    setIsSignupOpen(false);
  };

  useEffect(() => {
    
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
    }

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-3 transition-all duration-300 ${
        isScrolled ? "bg-gray-600/50 backdrop-blur-md" : "bg-transparent"
      }`}
      style={{ height: "56px" }}
    >
      <div className="text-2xl font-semibold text-white">TRAVELM8</div>

      {/* Center the middle section */}
      <div className="hidden md:flex items-center justify-start ml-20 space-x-8">
        <button className="text-white hover:text-white/80">Home</button>
        <button className="text-white hover:text-white/80">Activities</button>
        <button className="text-white hover:text-white/80">Itineraries</button>
        <button className="text-white hover:text-white/80">Historical Places</button>
        <button className="text-white hover:text-white/80">Shop</button>
      </div>

      <div className="flex items-center space-x-4">
        {isLoggedIn ? (
          // Render when logged in
          <>
          <NotificationBadge/>
          <button
            onClick={handleClick}
            className="text-white hover:text-white/80 border border-transparent rounded-full px-4 py-1"
          >
            <span>Welcome, {userName}</span>
            {/* <ArrowDropDownIcon /> */}
          </button>
          <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
              'aria-labelledby': 'basic-button',
            }}
            sx={{
              width: '500px', // Adjust the width as needed
            }}
          >
            <MenuItem onClick={handleClose}>My profile</MenuItem>
            <MenuItem onClick={handleClose}>My bookings</MenuItem>
            <MenuItem onClick={handleClose}>Wallet</MenuItem>
            <MenuItem onClick={handleClose}>Settings</MenuItem>
            <Separator/>
            <MenuItem onClick={handleLogout}>Sign out</MenuItem>
          </Menu>

            {/* <button
              className="bg-white text-black hover:bg-white/90 rounded-full px-6 py-2"
              onClick={handleLogout}
            >
              Logout
            </button> */}
          </>
        ) : (
          // Render when logged out
          <>
            <LoginPage isOpen={isLoginOpen} onOpenChange={setIsLoginOpen} onSignupClick={openSignup}>
              <Button
                variant="outline"
                className="bg-transparent text-white hover:bg-white/10 hover:text-white rounded-full px-8 py-2"
              >
                Login
              </Button>
            </LoginPage>
            <SignupDialog isOpen={isSignupOpen} onOpenChange={setIsSignupOpen} onLoginClick={openLogin}>
              <Button
                variant="outline"
                className="bg-white font-medium text-black hover:bg-white/90 rounded-full px-8 py-2"
              >
                Register
              </Button>
            </SignupDialog>
          </>
        )}
      </div>
    </nav>
  );
};



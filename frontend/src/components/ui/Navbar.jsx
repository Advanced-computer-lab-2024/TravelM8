// src/components/ui/Navbar.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav>
      <ul>
        <li><Link to="/profile">Profile</Link></li>
        <li><Link to="/itinerary">Itinerary</Link></li>
        <li><Link to="/notifications">Notifications</Link></li>
        {/* Add other links as necessary */}
      </ul>
    </nav>
  );
};

export default Navbar; // Use default export

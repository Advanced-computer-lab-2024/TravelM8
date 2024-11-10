import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
            <nav
            className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-3 transition-all duration-300 ${
                isScrolled ? "bg-black/50 backdrop-blur-md" : "bg-transparent"
            }`}
            style={{ height: "56px" }}  // Adjusts height slightly
            >
            <div className="text-2xl font-bold text-white">TRAVELM8</div>
            <div className="hidden md:flex items-center space-x-6">
                <button className="text-white hover:text-white/80">About</button>
                <button className="text-white hover:text-white/80">Services</button>
                <button className="text-white hover:text-white/80">Tour</button>
                <button className="text-white hover:text-white/80">Contact</button>
            </div>
            
            <div className="flex items-center space-x-4">
                {/* Login Button */}
                <Button
                        variant="outline"
                        className="bg-transparent text-white hover:bg-white/10 hover:text-white rounded-full px-8 py-2"
                        >
                        <Link to="/login">Login</Link>
                        </Button>

                        {/* Signup Button */}
                        <Button
                        variant="outline"
                        className="bg-white font-medium text-black hover:bg-white/90 rounded-full px-8 py-2"
                        >
                        <Link to="/signup">Signup</Link>
                        </Button>


            </div>
            
            </nav>

  );
};



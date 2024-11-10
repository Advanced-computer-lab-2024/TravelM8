import React from 'react';
import {Facebook, Instagram, Youtube } from "lucide-react"; // Adjust this import if necessary

export default function Footer() {
  return (
    <footer className="bg-[#1B1B1B] text-gray-300 py-12 px-4">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About Section */}
          <div>
            <h2 className="text-white text-xl font-semibold mb-4">About</h2>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Jobs</a></li>
              <li><a href="#" className="hover:text-white transition-colors">In Press</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Gallery</a></li>
            </ul>
          </div>

          {/* Support Section */}
          <div>
            <h2 className="text-white text-xl font-semibold mb-4">Support</h2>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-white transition-colors">Contact us</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Online Chat</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Whatsapp</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Telegram</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Ticketing</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Call Center</a></li>
            </ul>
          </div>

          {/* FAQ Section */}
          <div>
            <h2 className="text-white text-xl font-semibold mb-4">FAQ</h2>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-white transition-colors">Account</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Booking</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Payments</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Returns</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Terms & Condition</a></li>
            </ul>
          </div>

          {/* Newsletter Section */}
          <div>
            <h2 className="text-white text-xl font-semibold mb-4">Newsletter</h2>
            <p className="mb-4">Don't miss out on the exciting world of travel – subscribe now and embark on a journey of discovery with us.</p>
            
            <form className="flex gap-2 mb-6">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 rounded-full bg-[#C4C4C4] border border-gray-700 focus:outline-none focus:border-gray-500"
              />
              <button
                type="submit"
                className="px-6 py-2 bg-[#C4C4C4] text-white rounded-full hover:bg-gray-600 transition-colors"
              >
                Submit
              </button>
            </form>

            {/* Social Media Icons */}
            <div className="flex gap-4">
              <a href="#" className="hover:text-white transition-colors" aria-label="Instagram">
                <Instagram className="w-6 h-6" />
              </a>
              <a href="#" className="hover:text-white transition-colors" aria-label="Facebook">
                <Facebook className="w-6 h-6" />
              </a>
              <a href="#" className="hover:text-white transition-colors" aria-label="YouTube">
                <Youtube className="w-6 h-6" />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 pt-8 border-t border-gray-800 text-center">
          <p>©2023 TravelM8, All Rights Reserved</p>
        </div>
      </div>
    </footer>
  );
};


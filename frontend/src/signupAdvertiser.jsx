import React, { useState } from 'react';
import './signup.css'; // Import CSS file for styling
import { Search, Menu, User, Heart, ShoppingCart } from 'lucide-react';
import axios from 'axios';




const FormPage = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        type: 'Advertiser'
    });

    const [message, setMessage] = useState('');  // State to hold the message
    const [messageType, setMessageType] = useState('');  // State to hold the message type (success or error)

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Send a POST request to your backend API
            const response = await axios.post('http://localhost:5001/api/pending-users', formData);
  
            // Handle success
            setMessage('User created successfully!');  // Set success message
            setMessageType('success');  // Set message type to 'success'
        } catch (error) {
            // Handle error
            setMessage('Error during signup. Please try again.');  // Set failure message
            setMessageType('error');  // Set message type to 'error'
        }
    };

    return (
      <><nav className="navbar">
        <div className="navbar-left">
          <Menu className="menu-icon" />
          <img src="/placeholder.svg?height=40&width=150" alt="TravelM8" className="logo" />
        </div>
        <div className="navbar-center">
        </div>
        <div className="navbar-right">
        <button className="nav-button">Home</button>
        <button className="nav-button">About Us</button>
        <button className="nav-button">Contact Us</button>
        </div>
      </nav><div className="form-container">
          <h1 className="form-title">Get started adverting on TravelM8</h1>
          <form onSubmit={handleSubmit} className="contact-form">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              placeholder="Enter your username" />

            <label htmlFor="email">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Enter your email" />

            <label htmlFor="password">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Enter your Password" />


            <button type="submit" className="submit-button">Sign Up</button>
          </form>

          {/* Display the success or error message */}
          {message && (
                    <div className={messageType === 'success' ? 'success-message' : 'error-message'}>
                        {message}
                    </div>
                )}

<p className="already-registered">
                    Already registered? <a href="/signin" className="signin-link">Sign in here</a>
                </p>
          
        </div></> 
        
    );
};

export default FormPage;

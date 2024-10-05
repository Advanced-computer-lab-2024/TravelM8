import React, { useState } from 'react';
import './signup.css';
import { Menu } from 'lucide-react';
import axios from 'axios';
import backgroundImage from '/Users/arwataha/Documents/GitHub/TravelM8/frontend/src/assets/background.jpeg';

const FormPage = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        type: 'Advertiser'
    });

    const [message, setMessage] = useState(''); 
    const [messageType, setMessageType] = useState('');  

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');

        try {
            const response = await axios.post('http://localhost:5001/api/pending-users', formData);
            setMessage('User created successfully!');
            setMessageType('success');  
        } catch (error) {
            setMessage('Error during signup. Please try again.');
            setMessageType('error');  
        }
    };

    return (
        <>
         <div
          className="background-image"
          style={{ backgroundImage: `url(${backgroundImage})` }} // Set the background image source here
        ></div>
            <nav className="navbar">
                <div className="navbar-left">
                    <img src="./src/assets/logo4.jpg" alt="TravelM8"  className="logo" />
                </div>
                <div className="navbar-right">
                    <button className="nav-button">Home</button>
                    <button className="nav-button">About Us</button>
                    <button className="nav-button">Our Services</button>
                    <button className="nav-button">Contact Us</button>
                    <button className="nav-login-button">Login</button>
                </div>
            </nav>
            <div className="form-container">
                <h1 className="form-title">Get started advertising of TravelM8</h1>
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
                        placeholder="Enter your password" />
                    <button type="submit" className="submit-button">Sign Up</button>
                </form>
                {message && (
                    <div className={messageType === 'success' ? 'success-message' : 'error-message'}>
                        {message}
                    </div>
                )}
                <p className="already-registered">
                    Already registered? <a href="/signin" className="signin-link">Sign in here</a>
                </p>
            </div>
        </>
    );
};

export default FormPage;

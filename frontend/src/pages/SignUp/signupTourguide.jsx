import React, { useState } from 'react';
import './signup.css';
import axios from 'axios';
import backgroundImage from '@/assets/background.jpeg';
import { useNavigate } from 'react-router-dom';

const FormPage = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        type: 'TourGuide'
    });
    const [documentData, setDocumentData] = useState({
        username: formData.username,
        type:formData.type
    });

    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('');
    const [termsAccepted, setTermsAccepted] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [image, setImage] = useState();
    const [idfile,setidfile]=useState();
    const [certificatesfile,setcertiffile]=useState();
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        
        // Ensure username in documentData is synced
        if (name === 'username') {
            setDocumentData((prev) => ({ ...prev, username: value }));
        }
    };

    const handleImageChange = (e) => {
      setImage(e.target.files[0]);
  };

  const handleFileChange1 = (e) => {
    setidfile(e.target.files[0]);
  };

  const handleFileChange2 = (e) => {
    setcertiffile(e.target.files[0]);
  };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');

        try {console.log("Form data being sent:", formData);
            const response = await axios.post('http://localhost:5001/api/pending-users', formData);

            if (response.status === 200) {

            const formDataToSend = new FormData();
            formDataToSend.append("image", image);
            formDataToSend.append("idfile", idfile);
            formDataToSend.append("certificatesfile",certificatesfile);
            formDataToSend.append("username", documentData.username);  // Add username here
            formDataToSend.append("type", documentData.type);  // Add type here
            await axios.post(
              'http://localhost:5001/api/upload-files2',
              formDataToSend,
              { headers: { "Content-Type": "multipart/form-data" } }
          );

            alert('Your Request Is Pending');
            setMessageType('success');
            navigate('/');
            }
        } catch (error) {
            if (error.response) {
                // Error from server
                console.error("Server error:", error.response.data);
                setErrorMessage(error.response.data.message || "Request failed.");
            } else if (error.request) {
                // No response from server
                console.error("No response from server:", error.request);
                setErrorMessage("No response from the server. Please try again later.");
            } else {
                // Error setting up request
                console.error("Error during request:", error.message);
                setErrorMessage("An error occurred while sending the request.");
            }
        }
    };

    const handleTermsChange = (e) => {
        setTermsAccepted(e.target.checked);
    };

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    return (
        <>
            <div
                className="background-image"
                style={{ backgroundImage: `url(${backgroundImage})` }}
            ></div>
            <nav className="navbar">
                <div className="navbar-left">
                    <img src="./src/assets/logo4.jpg" alt="TravelM8" className="logo" />
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
                <h1 className="form-title">Get started on TravelM8</h1>
                <form onSubmit={handleSubmit} className="contact-form">
                    <label className="form-label" htmlFor="username">Username</label>
                    <input
                        className="form-input"
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        required
                        placeholder="Enter your username"
                    />
                    <label className="form-label" htmlFor="email">Email</label>
                    <input
                        className="form-input"
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        placeholder="Enter your email"
                    />
                    <label className="form-label" htmlFor="password">Password</label>
                    <input
                        className="form-input"
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        placeholder="Enter your password"
                    />

                    <label >Upload Logo</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        name="image"
                    />

                    <label >Upload ID File</label>
                    <input
                        type="file"
                        accept=".pdf,.doc,.docx,image/*"
                        onChange={handleFileChange1}
                        name="idfile"
                        required
                    />

                    <label >Upload certificate Card</label>
                    <input
                        type="file"
                        accept=".pdf,.doc,.docx,image/*"
                        onChange={handleFileChange2}
                        name="certificatesfile"
                    />

                    <label className="form-label terms-container">
                        <input
                            type="checkbox"
                            checked={termsAccepted}
                            onChange={handleTermsChange}
                            required
                        />{' '}
                        I agree to the
                        <span className="terms-link" onClick={openModal}> Terms and Conditions</span>
                    </label>

                    <button type="submit" className="submit-button">Sign Up</button>
                </form>
                {message && (
                    <div className={messageType === 'success' ? 'success-message' : 'error-message'}>
                        {message}
                    </div>
                )}
                {isModalOpen && (
                    <div className="terms-modal">
                        <div className="terms-content">
                            <h2>Terms and Conditions</h2>
                            <p>Welcome to TravelMate! By accessing or using our website and services, 
                            you agree to be bound by the following Terms and Conditions. 
                            Please read them carefully. By registering on or using TravelMate, you agree to these 
                            Terms and Conditions and any future updates. If you do not 
                            agree, you may not use our services. By signing up, you agree 
                            to TravelMate’s Terms and Conditions and Privacy Policy....</p>                            <button className="close-button" onClick={closeModal}>Close</button>
                        </div>
                    </div>
                )}
                <p className="already-registered">
                    Already registered? <a href="/login" className="signin-link">Sign in here</a>
                </p>
            </div>
        </>
    );
};

export default FormPage;

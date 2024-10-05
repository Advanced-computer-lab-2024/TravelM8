import React, { useState, useEffect } from 'react';
import './profileTemplate.css';
import { Search, Menu, User, Heart, ShoppingCart } from 'lucide-react';

const ProfileTemplate = () => {


  const [profile, setProfile] = useState({
    username: '',
    email: '',
    password: '',
    yearsOfExperience: 0,
    mobileNumber: '',
    previousWork: ''
  });

  

  const [notifications, setNotifications] = useState([]);
  const [activeTab, setActiveTab] = useState('profile');

  useEffect(() => {
    // Simulating fetching profile data
    setProfile({
      username: 'JohnDoe',
      email: 'john@example.com',
      password: '********',
      yearsOfExperience: 5,
      mobileNumber: '1234567890',
      previousWork: 'Software Developer at XYZ Corp'
    });

    // Simulating fetching itineraries
  

    // Simulating fetching notifications
    setNotifications([
      { id: 1, message: 'New event in your area!', date: '2023-10-10' }
    ]);
  }, []);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    console.log('Updated Profile:', profile);
    // Here you would typically send the updated profile to your backend
  };



  const deleteNotification = (id) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };



  const [itineraries, setItineraries] = useState([]);
  const [currentItinerary, setCurrentItinerary] = useState({
    id: null,
    activity: '',
    location: '',
    startDate: '',
    endDate: '',
    duration: '',
    language: '',
    price: '',
    availableDates: '',
    availableTimes: '',
    accessibility: '',
    pickupLocation: '',
    dropoffLocation: ''
  });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    // Simulating fetching itineraries from an API
    const fetchedItineraries = [
      {
        id: 1,
        activity: 'Sightseeing',
        location: 'Paris',
        startDate: '2023-10-15',
        endDate: '2023-10-18',
        duration: '3 days',
        language: 'English, French',
        price: '€500',
        availableDates: '2023-10-15 to 2023-12-31',
        availableTimes: '9:00 AM - 5:00 PM',
        accessibility: 'Wheelchair accessible',
        pickupLocation: 'Charles de Gaulle Airport',
        dropoffLocation: 'Eiffel Tower'
      }
    ];
    setItineraries(fetchedItineraries);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentItinerary(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isEditing) {
      setItineraries(prev => prev.map(item => item.id === currentItinerary.id ? currentItinerary : item));
      setIsEditing(false);
    } else {
      const newItinerary = { ...currentItinerary, id: Date.now() };
      setItineraries(prev => [...prev, newItinerary]);
    }
    setCurrentItinerary({
      id: null,
      activity: '',
      location: '',
      startDate: '',
      endDate: '',
      duration: '',
      language: '',
      price: '',
      availableDates: '',
      availableTimes: '',
      accessibility: '',
      pickupLocation: '',
      dropoffLocation: ''
    });
  };

  const editItinerary = (itinerary) => {
    setCurrentItinerary(itinerary);
    setIsEditing(true);
  };

  const deleteItinerary = (id) => {
    setItineraries(prev => prev.filter(item => item.id !== id));
  };


  

  return (
    
    <><nav className="navbar">
          <div className="navbar-left">
              <Menu className="menu-icon" />
              <img src="/placeholder.svg?height=40&width=150" alt="Logo" className="logo" />
          </div>
          <div className="navbar-center">
              {/* <div className="search-bar">
                  <Search className="search-icon" />
                  <input type="text" placeholder="Where to?" />
              </div> */}
          </div>
          <div className="navbar-right">
              <Heart className="nav-icon" />
              <ShoppingCart className="nav-icon" />
              <User className="nav-icon" />
          </div>
      </nav>
      <div className="profile-template">

              <nav className="tab-navigation">
                  <button onClick={() => setActiveTab('profile')} className={activeTab === 'profile' ? 'active' : ''}>Profile</button>
                  <button onClick={() => setActiveTab('itinerary')} className={activeTab === 'itinerary' ? 'active' : ''}>Itinerary</button>
                  <button onClick={() => setActiveTab('notifications')} className={activeTab === 'notifications' ? 'active' : ''}>Notifications</button>
              </nav>

              {activeTab === 'profile' && (
                  <div className="profile-section">
                      <h2>Profile</h2>
                      <form onSubmit={handleProfileSubmit}>
                          <label htmlFor="username">Username</label>
                          <input type="text" name="username" value={profile.username} onChange={handleProfileChange} placeholder="Username" />
                          <label htmlFor="email">Email</label>
                          <input type="email" name="email" value={profile.email} onChange={handleProfileChange} placeholder="Email" />
                          <label htmlFor="password">Password</label>
                          <input type="password" name="password" value={profile.password} onChange={handleProfileChange} placeholder="Password" />
                          <label htmlFor="yearsOfExperience">Years Of Experience</label>
                          <input type="number" name="yearsOfExperience" value={profile.yearsOfExperience} onChange={handleProfileChange} placeholder="Years of Experience" />
                          <label htmlFor="mobileNumber">Mobile Number</label>
                          <input type="tel" name="mobileNumber" value={profile.mobileNumber} onChange={handleProfileChange} placeholder="Mobile Number" />
                          <label htmlFor="previousWork">Previous Work</label>
                          <textarea name="previousWork" value={profile.previousWork} onChange={handleProfileChange} placeholder="Previous Work"></textarea>
                          <button type="submit">Update Profile</button>
                      </form>
                  </div>
              )}

              {activeTab === 'itinerary' && (
                  <div className="itinerary-manager">
                      <h2>Itinerary Manager</h2>
                      <form onSubmit={handleSubmit} className="itinerary-form">
                          {/* Form inputs remain unchanged */}
                          <input
                              type="text"
                              name="activity"
                              value={currentItinerary.activity}
                              onChange={handleInputChange}
                              placeholder="Activity"
                              required />
                          <input
                              type="text"
                              name="location"
                              value={currentItinerary.location}
                              onChange={handleInputChange}
                              placeholder="Location"
                              required />
                          <input
                              type="date"
                              name="startDate"
                              value={currentItinerary.startDate}
                              onChange={handleInputChange}
                              required />
                          <input
                              type="date"
                              name="endDate"
                              value={currentItinerary.endDate}
                              onChange={handleInputChange}
                              required />
                          <input
                              type="text"
                              name="duration"
                              value={currentItinerary.duration}
                              onChange={handleInputChange}
                              placeholder="Duration"
                              required />
                          <input
                              type="text"
                              name="language"
                              value={currentItinerary.language}
                              onChange={handleInputChange}
                              placeholder="Language of Tour" />
                          <input
                              type="text"
                              name="price"
                              value={currentItinerary.price}
                              onChange={handleInputChange}
                              placeholder="Price" />
                          <input
                              type="text"
                              name="availableDates"
                              value={currentItinerary.availableDates}
                              onChange={handleInputChange}
                              placeholder="Available Dates" />
                          <input
                              type="text"
                              name="availableTimes"
                              value={currentItinerary.availableTimes}
                              onChange={handleInputChange}
                              placeholder="Available Times" />
                          <input
                              type="text"
                              name="accessibility"
                              value={currentItinerary.accessibility}
                              onChange={handleInputChange}
                              placeholder="Accessibility" />
                          <input
                              type="text"
                              name="pickupLocation"
                              value={currentItinerary.pickupLocation}
                              onChange={handleInputChange}
                              placeholder="Pick-up Location" />
                          <input
                              type="text"
                              name="dropoffLocation"
                              value={currentItinerary.dropoffLocation}
                              onChange={handleInputChange}
                              placeholder="Drop-off Location" />
                          <button type="submit">{isEditing ? 'Update Itinerary' : 'Add Itinerary'}</button>
                      </form>
                      <div className="itinerary-list">
                          {itineraries.map(itinerary => (
                              <div key={itinerary.id} className="itinerary-card">
                                  <div className="itinerary-header">
                                      <h3>{itinerary.activity} in {itinerary.location}</h3>
                                  </div>
                                  <div className="itinerary-details">
                                      <div className="detail-column">
                                          <p><strong>Date:</strong> {itinerary.startDate} to {itinerary.endDate}</p>
                                          <p><strong>Duration:</strong> {itinerary.duration}</p>
                                          <p><strong>Language:</strong> {itinerary.language}</p>
                                          <p><strong>Price:</strong> {itinerary.price}</p>
                                      </div>
                                      <div className="detail-column">
                                          <p><strong>Available:</strong> {itinerary.availableDates}, {itinerary.availableTimes}</p>
                                          <p><strong>Accessibility:</strong> {itinerary.accessibility}</p>
                                          <p><strong>Pick-up:</strong> {itinerary.pickupLocation}</p>
                                          <p><strong>Drop-off:</strong> {itinerary.dropoffLocation}</p>
                                      </div>
                                  </div>
                                  <div className="itinerary-actions">
                                      <button onClick={() => editItinerary(itinerary)} className="edit-btn">Edit</button>
                                      <button onClick={() => deleteItinerary(itinerary.id)} className="delete-btn">Delete</button>
                                  </div>
                              </div>
                          ))}
                      </div>
                  </div>
              )}

              {activeTab === 'notifications' && (
                  <div className="notifications-section">
                      <h2>Notifications</h2>
                      <ul className="notification-list">
                          {notifications.map(notification => (
                              <li key={notification.id}>
                                  {notification.message} - {notification.date}
                                  <button onClick={() => deleteNotification(notification.id)}>Dismiss</button>
                              </li>
                          ))}
                      </ul>
                  </div>
              )}
          </div></>
  );
};

export default ProfileTemplate;
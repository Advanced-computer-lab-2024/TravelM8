import React, { useState, useEffect } from 'react';
import { Route, Routes, Link } from 'react-router-dom';
import HistoricalPlacesList from '@/pages/TourismGovernor/HistoricalPlacesList.jsx';
import HistoricalPlaceForm from '@/pages/TourismGovernor/HistoricalPlaceForm.jsx';
import HistoricalPlaceDetails from '@/pages/TourismGovernor/HistoricalPlaceDetails.jsx';
import '@/pages/TourismGovernor/TourismGovernorDashboard.css';
import useRouter from "@/hooks/useRouter"

export default function TourismGovernorDashboard() {
  const [historicalPlaces, setHistoricalPlaces] = useState([]);
  const token = localStorage.getItem('token');
  const { navigate } = useRouter();

useEffect(() => {
    // Check if the user has a token
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login"); // Redirect to login page if no token
      return;
    }
    fetchHistoricalPlaces();

  }, [navigate]);

  const fetchHistoricalPlaces = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/myPlaces', {
        method: 'GET', // Specify the HTTP method
        headers: {
          'Content-Type': 'application/json', // Set content type if needed
          Authorization: `Bearer ${token}`, // Include the token in the Authorization header
        },
      });
      const data = await response.json();
      setHistoricalPlaces(data["Places"]);
    } catch (error) {
      console.error('Error fetching historical places:', error);
    }
  };

  const addHistoricalPlace = async (place) => {
    try {
      const response = await fetch('http://localhost:5001/api/addPlace', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(place),
      });
      const newPlace = await response.json();
      setHistoricalPlaces([...historicalPlaces, newPlace]);
    } catch (error) {
      console.error('Error adding historical place:', error);
    }
  };

  const updateHistoricalPlace = async (id, updatedPlace) => {
    try {
      const response = await fetch(`http://localhost:5001/api/updatePlace/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedPlace),
      });
      const updated = await response.json();
      setHistoricalPlaces(historicalPlaces.map(place => place._id === id ? updated : place));
    } catch (error) {
      console.error('Error updating historical place:', error);
    }
  };

  const deleteHistoricalPlace = async (id) => {
    try {
      await fetch(`http://localhost:5001/api/deletePlace/${id}`, { method: 'DELETE' });
      setHistoricalPlaces(historicalPlaces.filter(place => place._id !== id));
    } catch (error) {
      console.error('Error deleting historical place:', error);
    }
  };

  return (
    <div className="tourism-governor-dashboard">
      <nav>
        <ul className="nav-list">
          <li><Link to="/" className="nav-link">Dashboard</Link></li>
          <li><Link to="/add" className="nav-link">Add New Historical Place</Link></li>
        </ul>
      </nav>

      <Routes>
        <Route path="/" element={<HistoricalPlacesList places={historicalPlaces} onDelete={deleteHistoricalPlace} />} />
        <Route path="/add" element={<HistoricalPlaceForm />} />
        <Route path="/edit/:id" element={<HistoricalPlaceForm places={historicalPlaces} onSubmit={updateHistoricalPlace} />} />
        <Route path="/view/:id" element={<HistoricalPlaceDetails places={historicalPlaces} />} />
      </Routes>
    </div>
  );
}

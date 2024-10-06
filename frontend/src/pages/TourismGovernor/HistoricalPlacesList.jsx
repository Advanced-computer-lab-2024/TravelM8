import React from 'react';
import { Link } from 'react-router-dom';
import '@/pages/TourismGovernor/HistoricalPlacesList.css';

export default function HistoricalPlacesList({ places, onDelete }) {
  return (
    <div className="historical-places-list">
      <h2>Historical Places</h2>
      {places.map((place) => (
        <div key={place._id} className="historical-place-item">
          <img src={place.image} alt={place.name} className="place-image" />
          <div className="place-info">
            <h3>{place.name}</h3>
            <p>{place.description.substring(0, 100)}...</p>
            <p>Type: {place.tags.type}</p>
            <div className="place-actions">
              <Link to={`/view/${place._id}`} className="view-button">View</Link>
              <Link to={`/edit/${place._id}`} className="edit-button">Edit</Link>
              <button onClick={() => onDelete(place._id)} className="delete-button">Delete</button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
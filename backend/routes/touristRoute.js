import express from 'express';
import { createTourist, updateTourist, getTourists } from '../controllers/touristController.js';


const touristRoute = express.Router();

// Define the routes
touristRoute.post('/tourists', createTourist);              // Create a new user with website, hotline, etc.
touristRoute.put('/tourists/:username', updateTourist);        // Update user information by email
touristRoute.get('/tourists', getTourists);                 // Read user by email

export default touristRoute; 
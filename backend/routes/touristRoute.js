import express from 'express';
import { createTourist, updateTourist, getTourists, getMyProfile } from '../controllers/touristController.js';
import verifyToken from '../services/tokenDecodingService.js';


const touristRoute = express.Router();

// Define the routes
touristRoute.post('/tourists', createTourist);              // Create a new user with website, hotline, etc.
touristRoute.put('/tourists/:username', updateTourist);        // Update user information by email
touristRoute.get('/tourists', getTourists);                 // Read user by email
touristRoute.get('/tourists/myProfile', verifyToken , getMyProfile);

export default touristRoute; 
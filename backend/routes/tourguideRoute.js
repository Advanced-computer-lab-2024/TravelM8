import express from 'express';
import { createTourGuide, updateTourGuide, getTourGuides } from '../controllers/tourguideController.js';


const router = express.Router();

// Define the routes
router.post('/tourguides', createTourGuide);              // Create a new user with website, hotline, etc.
router.put('/tourguides/:username', updateTourGuide);        // Update user information by email
router.get('/tourguides', getTourGuides);                 // Read user by email

export default router; 
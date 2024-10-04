import express from 'express';
import { createAdvertiser, updateAdvertiser, getAdvertisers } from '../controllers/advertiserController.js'; // Add .js extension

const router = express.Router();

// Define the routes
router.post('/advertisers', createAdvertiser);      // Create a new user with website, hotline, etc.
router.put('/advertisers/:username', updateAdvertiser);       // Update user information by email
router.get('/advertisers', getAdvertisers);         // Read user by email

export default router;



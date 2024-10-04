import express from 'express';
import { createSeller, updateSeller, getSellers } from '../controllers/sellerController.js';

const router = express.Router();

// Define the routes
router.post('/sellers', createSeller);              // Create a new user with website, hotline, etc.
router.put('/sellers/:username', updateSeller);        // Update user information by email
router.get('/sellers', getSellers);                 // Read user by email

export default router; 

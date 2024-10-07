import express from 'express';
import { createAdvertiser, updateAdvertiserProfile, getAdvertisers, getMyProfile } from '../controllers/advertiserController.js'; // Add .js extension
import verifyToken from '../services/tokenDecodingService.js';

const router = express.Router();

// Define the routes
router.post('/advertisers', createAdvertiser);      // Create a new user with website, hotline, etc.
router.put('/advertisers/updateMyProfile', verifyToken ,updateAdvertiserProfile);       // Update user information by email
router.get('/advertisers', getAdvertisers);         // Read user by email
router.get('/advertisers/myProfile', verifyToken , getMyProfile);


export default router;



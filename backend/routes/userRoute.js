import express from 'express';
import Guest from './models/Guest.js';
import Admin from './models/adminModel.js';
import Tourist from './models/touristModel.js';
import TourGuide from './models/tourguideModel.js';
import Seller from './models/sellerModel.js';
import Advertiser from './models/advertiserModel.js';

const router = express.Router();

// Delete user endpoint by username
router.delete('/users', async (req, res) => {
    const { username, type } = req.query; // Get username and user type from query

    try {
        let result;

        switch (type) {
            case 'Guest':
                result = await Guest.findOneAndDelete({ username });
                break;
            case 'Admin':
                result = await Admin.findOneAndDelete({ username });
                break;
            case 'Tourist':
                result = await Tourist.findOneAndDelete({ username });
                break;
            case 'TourGuide':
                result = await TourGuide.findOneAndDelete({ username });
                break;
            case 'Seller':
                result = await Seller.findOneAndDelete({ username });
                break;
            case 'Advertiser':
                result = await Advertiser.findOneAndDelete({ username });
                break;
            default:
                return res.status(400).send('Invalid user type');
        }

        if (!result) {
            return res.status(404).send('User not found');
        }

        res.status(200).send('User deleted successfully');
    } catch (error) {
        res.status(500).send('Server error');
    }
});

export default router;


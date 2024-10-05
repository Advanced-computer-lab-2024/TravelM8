// Import statements
import Tourist from '../models/touristModel.js';
import TourGuide from '../models/tourguideModel.js';
import Seller from '../models/sellerModel.js';
import Advertiser from '../models/advertiserModel.js';
import Admin from '../models/adminModel.js';
import TourismGovernor from '../models/tourismGovernorModel.js';
import PendingUser from '../models/pendingUserModel.js';

// Helper function to check if the username or email is already in use
export const checkUniqueUsernameEmail = async (username, email) => {
    // Check all schemas for existing username or email
    const existingUser = await Promise.all([
        Tourist.findOne({ $or: [{ username }, { email }] }),
        TourGuide.findOne({ $or: [{ username }, { email }] }),
        Seller.findOne({ $or: [{ username }, { email }] }),
        Advertiser.findOne({ $or: [{ username }, { email }] }),
        Admin.findOne({ $or: [{ username }, { email }] }),
        TourismGovernor.findOne({ $or: [{ username }, { email }] }),
        PendingUser.findOne({ $or: [{ username }, { email }] })

    ]);

    return existingUser.some(user => user !== null); // Return true if any user with the same username or email exists
};

export const checkUniqueUsername = async (username) => {
    // Check all schemas for existing username or email
    const existingUser = await Promise.all([
        Tourist.findOne({ username }),
        TourGuide.findOne({ username }),
        Seller.findOne({ username }),
        Advertiser.findOne({ username }),
        Admin.findOne({ username }),
        TourismGovernor.findOne({ username }),
        PendingUser.findOne({ username }),

    ]);

    return existingUser.some(user => user !== null); // Return true if any user with the same username or email exists
};

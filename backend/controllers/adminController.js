import Admin from '../models/adminModel.js';
import Tourist from '../models/touristModel.js';
import TourGuide from '../models/tourguideModel.js';
import Seller from '../models/sellerModel.js';
import Advertiser from '../models/advertiserModel.js';
import bcrypt from 'bcrypt';
import { checkUniqueUsername } from "../helpers/signupHelper.js"; 
import Itinerary from '../models/itineraryModel.js';
import Product from '../models/productModel.js';
import Activity from '../models/activityModel.js';
import TourismGovernor from '../models/tourismGovernorModel.js';
import HistoricalPlaces from '../models/historicalPlacesModel.js';


export const registerAdmin = async (req, res) => {
  const { username, password } = req.body;
  const isNotUnique = await checkUniqueUsername(username);

        if (isNotUnique) {
            return res.status(400).json({ message: 'Username is already in use.' });
        }

  try {

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new Admin({ username, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: "Admin registered successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteAccount = async (req, res) => {
    const { username, type } = req.query; // Get username and user type from query params

    if (!username || !type) {
        return res.status(400).send('Username and user type are required');
    }

    try {
        let result;

        // Handle each user type case explicitly
        switch (type) {
            case 'Admin':
                result = await Admin.findOneAndDelete({ username });
                break;

            case 'Tourist':
                result = await Tourist.findOneAndDelete({ username });
                break;

            case 'TourGuide':
                result = await TourGuide.findOneAndDelete({ username });
                if (result) {
                    await Itinerary.deleteMany({ tourGuideId: result._id });
                }
                break;

            case 'TourismGovernor':
                result = await TourismGovernor.findOneAndDelete({ username });
                if (result) {
                    await HistoricalPlaces.deleteMany({ tourismGovernorId: result._id });
                }
                break;

            case 'Seller':
                result = await Seller.findOneAndDelete({ username });
                if (result) {
                    await Product.deleteMany({ sellerId: result._id });
                }
                break;

            case 'Advertiser':
                result = await Advertiser.findOneAndDelete({ username });
                if (result) {
                    await Activity.deleteMany({ advertiserId: result._id });
                }
                break;

            default:
                return res.status(400).send('Invalid user type');
        }

        // If no user was found, return 404
        if (!result) {
            return res.status(404).send('User not found');
        }

        res.status(200).send('User deleted successfully');
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
};

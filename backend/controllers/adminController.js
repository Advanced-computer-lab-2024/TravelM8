import Admin from '../models/adminModel.js';
import Tourist from '../models/touristModel.js';
import TourGuide from '../models/tourguideModel.js';
import Seller from '../models/sellerModel.js';
import Advertiser from '../models/advertiserModel.js';
import bcrypt from 'bcrypt';
import { checkUniqueUsername } from "../helpers/signupHelper.js"; 


const registerAdmin = async (req, res) => {
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

const deleteAccount = async (req, res) =>{

  const { username, type } = req.query; // Get username and user type from query

  if (!username || !type) {
      return res.status(400).send('Username and user type are required');
  }

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
};


export {registerAdmin, deleteAccount};

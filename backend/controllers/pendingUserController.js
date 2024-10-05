import PendingUser from "../models/pendingUserModel.js";
import Advertiser from "../models/advertiserModel.js";
import Seller from "../models/sellerModel.js";
import TourGuide from "../models/tourguideModel.js";
import { checkUniqueUsernameEmail } from "../helpers/signupHelper.js"; 

export const createPendingUser = async (req,res) => {
    const {username, email, password, type} = req.body;
    const isNotUnique = await checkUniqueUsernameEmail(username, email);
 
         if (isNotUnique) {
             return res.status(400).json({ message: 'Username or email is already in use.' });
         }
    try{
       const pending = await PendingUser.create({username,  email, password, type});
       res.status(200).json(pending);
    }catch(error){
       res.status(400).json({error:error.message});
    }
};

// Controller to accept a pending user
export const acceptPendingUser = async (req, res) => {
  const userId = req.params.id;

  try {
      // Find the pending user by ID
      const pending = await PendingUser.findById(userId);

      // Check if the pending user exists
      if (!pending) {
          return res.status(404).json({ message: 'Pending user not found' });
      }
      
      const type = pending.type;

      // Prepare the new user data to be added
      const newUser = {
          username: pending.username,
          email: pending.email,
          password: pending.password,
      };
      
      let result;

      // Create the user in the appropriate collection based on the user type
      switch (type) {
          case 'TourGuide':
              result = await TourGuide.create(newUser);
              break;
          case 'Seller':
              result = await Seller.create(newUser);
              break;
          case 'Advertiser':
              result = await Advertiser.create(newUser);
              break;
          default:
              return res.status(400).json({ message: 'Invalid user type' });
      }

      // If user creation was successful, remove the user from the PendingUser collection
      if (result) {
          await PendingUser.findByIdAndDelete(userId);
          return res.status(200).json({ message: 'User accepted and added to the main collection', user: result });
      } else {
          return res.status(500).json({ message: 'Failed to create new user' });
      }

  } catch (error) {
      console.error(error); // Log the error for debugging
      res.status(500).json({ message: 'Server error', error: error.message });
  }
};


// Controller to reject a pending user
export const rejectPendingUser = async (req, res) => {
    try {
      const userId = req.params.id;
  
      // Find and delete the user from the pendingUsers collection
      const deletedUser = await PendingUser.findByIdAndDelete(userId);
  
      if (!deletedUser) {
        return res.status(404).json({ message: 'Pending user not found' });
      }
  
      return res.json({ message: 'User rejected and removed from pending users' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

// Controller to reject a pending user
export const getPendingUsers = async (req, res) => {
    //retrieve all users from the database
    try{
       const pendingUsers = await PendingUser.find({});
       res.status(200).json(pendingUsers);
    }catch(error){
       res.status(400).json({error:error.message});
    }

};


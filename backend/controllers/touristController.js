import Tourist from '../models/touristModel.js'; 
import { checkUniqueUsernameEmail } from "../helpers/signupHelper.js"; 


export const createTourist = async(req,res) => {
   //add a new Tourist to the database with 
   const {username, name, email, password, mobileNumber, nationality, dob, occupation} = req.body;
   const isNotUnique = await checkUniqueUsernameEmail(username, email);

        if (isNotUnique) {
            return res.status(400).json({ message: 'Username or email is already in use.' });
        }
   try{
  
      const tourist = await Tourist.create({username, email, password, mobileNumber, nationality, dob, occupation});
      res.status(200).json({ id: tourist.id, ...tourist.toObject() });
         }catch(error){
      res.status(400).json({error:error.message});
   }
}



export const updateTouristProfile = async (req, res) => {
   const userId = req.user.userId;
   try{
    if (req.body.password) {
      req.body.password = await hashPassword(req.body.password);
    }
      const updatedTourist = await Tourist.findByIdAndUpdate(
         userId,        
         req.body,         
         { new: true, runValidators: true }          
       );
       if (!updatedTourist){
         res.status(400).json({error:error.message});
       }
      res.status(200).json(updatedTourist);
   }catch(error){
      res.status(400).json({error:error.message});
   }
};

export const updatePreferences = async (req, res) => {
  const touristId = req.params.touristId;  // This gets the touristId from the URL
  const { preferences } = req.body;

  try {
    const tourist = await Tourist.findById(touristId);
    if (!tourist) {
      return res.status(404).json({ message: 'Tourist not found' });
    }
    if (preferences && Array.isArray(preferences)) {
      tourist.preferences = preferences;
    } else {
      return res.status(400).json({ message: 'Invalid preferences data' });
    }

    await tourist.save();
    res.status(200).json(tourist);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getTourists = async (req, res) => {
    //retrieve all users from the database
    try{
       const Tourists = await Tourist.find({});
       res.status(200).json(Tourists);
    }catch(error){
       res.status(400).json({error:error.message});
    }
 }

 export const getMyProfile = async (req, res) => {
   const userId = req.user.userId;
   try {
      const touristInfo = await Tourist.findById(userId);
      res.status(200).json(touristInfo);
   } catch (error) {
      res.status(400).json({ message: "could not fetch account information" });
   }
}


export const updatePoints = async (userId, amountPaid) => {
  try {
    // Find the tourist by userId
    const tourist = await Tourist.findById(userId);
    if (!tourist) {
      throw new Error('Tourist not found');
    }

    let pointsEarned;
    // Calculate points based on loyalty points and amount paid
    if (tourist.loyaltyPoints <= 100000) {
      pointsEarned = amountPaid * 0.5;
    } else if (tourist.loyaltyPoints <= 500000) {
      pointsEarned = amountPaid * 1;
    } else {
      pointsEarned = amountPaid * 1.5;
    }

    // Update loyalty points
    tourist.loyaltyPoints += pointsEarned;

    // Update badge level based on new loyalty points
    if (tourist.loyaltyPoints <= 100000) {
      tourist.badgeLevel = 'Level 1';
    } else if (tourist.loyaltyPoints <= 500000) {
      tourist.badgeLevel = 'Level 2';
    } else {
      tourist.badgeLevel = 'Level 3';
    }

    // Save the tourist with the updated points and badge level
    await tourist.save();
    return {"points":pointsEarned, "current":tourist.loyaltyPoints};  // Return the updated tourist object
  } catch (error) {
    throw new Error(`Error processing payment: ${error.message}`); // Rethrow error for further handling
  }
};

export const redeemPoints = async (req, res) => {
  //const { id } = req.params;
  const userId = req.user.userId;
  try {
    const tourist = await Tourist.findById(userId);
    if (!tourist) {
      return res.status(404).json({ success: false, message: 'Tourist not found' });
    }

    if (tourist.loyaltyPoints < 100) {
      return res.status(400).json({ success: false, message: 'Not enough points to redeem' });
    }

    const cashEarned = Math.floor(tourist.loyaltyPoints / 10000) * 100;
    const pointsRedeemed = Math.floor(tourist.loyaltyPoints / 10000) * 10000;

    // Calculate the new wallet balance by adding cashEarned to current wallet value
    const newWalletBalance = tourist.wallet + cashEarned;

    // Update wallet and loyalty points directly in a single update call
    const updatedTourist = await Tourist.findByIdAndUpdate(
      userId,
      {
        wallet: tourist.wallet + ((tourist.loyaltyPoints / 10000) * 100),
        loyaltyPoints: 0
      },
      { new: true, runValidators: true }
    );

    res.status(200).json(updatedTourist);
  } catch (error) {
    res.status(500).json({ success: false, message: `Error redeeming points: ${error.message}` });
  }
};




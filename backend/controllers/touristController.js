import Tourist from '../models/touristModel.js'; 
import { checkUniqueUsernameEmail } from "../helpers/signupHelper.js"; 
import bcrypt from 'bcryptjs';




export const createTourist = async(req,res) => {
   //add a new Tourist to the database with 
   const {username, name, email, password, mobileNumber, nationality, dob, occupation} = req.body;
   const isNotUnique = await checkUniqueUsernameEmail(username, email);

        if (isNotUnique) {
            return res.status(400).json({ message: 'Username or email is already in use.' });
        }
   try{
  
      const tourist = await Tourist.create({username, email, password, mobileNumber, nationality, dob, occupation});
      res.status(200).json(tourist);
   }catch(error){
      res.status(400).json({error:error.message});
   }
}


export const updateTouristProfile = async (req, res) => {
   const userId = req.user.userId;
   try{
       // Check if the password is being updated and hash it if so
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


export const updatePoints = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.userId;
  const { amountPaid } = req.body;

  try {
    const tourist = await Tourist.findById(userId);
    if (!tourist) {
      return res.status(404).json({ success: false, message: 'Tourist not found' });
    }   
    let pointsEarned;
    if (tourist.loyaltyPoints <= 100000) {
      pointsEarned = amountPaid * 0.5;
    } else if (tourist.loyaltyPoints <= 500000) {
      pointsEarned = amountPaid * 1;
    } else {
      pointsEarned = amountPaid * 1.5;
    }

    // Update loyalty points
    tourist.loyaltyPoints += pointsEarned;

    
    if (tourist.loyaltyPoints <= 100000) {
      tourist.badgeLevel = 'Level 1';
    } else if (tourist.loyaltyPoints <= 500000) {
      tourist.badgeLevel = 'Level 2';
    } else {
      tourist.badgeLevel = 'Level 3';
    }

    await tourist.save();

    res.status(200).json({
      success: true,
      message: `Payment processed successfully. Points Earned: ${pointsEarned}, New Total Points: ${tourist.loyaltyPoints}, Badge Level: ${tourist.badgeLevel}`,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: `Error processing payment: ${error.message}` });
  }
};



export const redeemPoints = async (req, res) => {
  const { id } = req.params;  
  const userId = req.user.userId;
  try {
    const tourist = await Tourist.findById(userId);
    if (!tourist) {
      return res.status(404).json({ success: false, message: 'Tourist not found' });
    }

    // Check if the tourist has enough points to redeem
    if (tourist.loyaltyPoints < 10000) {
      return res.status(400).json({ success: false, message: 'Not enough points to redeem' });
    }

    const cashEarned = Math.floor(tourist.loyaltyPoints / 10000) * 100;
    const pointsRedeemed = Math.floor(tourist.loyaltyPoints / 10000) * 10000;

    // Update tourist's wallet and points
    tourist.wallet += cashEarned;
    tourist.loyaltyPoints -= pointsRedeemed;
 
    await tourist.save();

    res.status(200).json({
      success: true,
      message: `Successfully redeemed ${pointsRedeemed} points for ${cashEarned} EGP. New wallet balance: ${tourist.wallet} EGP.`,
      newLoyaltyPoints: tourist.loyaltyPoints,
      newWalletBalance: tourist.wallet,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: `Error redeeming points: ${error.message}` });
  }
};


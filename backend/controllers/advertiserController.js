import Advertiser from '../models/advertiserModel.js'; // Use ES module import
import { checkUniqueUsernameEmail } from "../helpers/signupHelper.js"; 

export const createAdvertiser = async (req, res) => {
   const { username, email, password} = req.body;
   const isNotUnique = await checkUniqueUsernameEmail(username, email);

        if (isNotUnique) {
            return res.status(400).json({ message: 'Username or email is already in use.' });
        }
   try {
      const advertiser = await Advertiser.create({ username, email, password});
      res.status(200).json(advertiser);
   } catch (error) {
      res.status(400).json({ error: error.message });
   }
};

export const updateAdvertiser = async (req, res) => {
   const {username} = req.params;
   try{
      const updatedAdvertiser = await Advertiser.findOneAndUpdate(
         { username },        
         req.body,         
         { new: true, runValidators: true }          
       );
       if (!updatedAdvertiser){
         res.status(400).json({error:error.message});
       }
      res.status(200).json(updatedAdvertiser);
   }catch(error){
      res.status(400).json({error:error.message});
   }
};

export const getAdvertisers = async (req, res) => {
   try {
      const advertisers = await Advertiser.find({});
      res.status(200).json(advertisers);
   } catch (error) {
      res.status(400).json({ error: error.message });
   }
};

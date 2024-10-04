import Seller from '../models/sellerModel.js'; 
import { checkUniqueUsernameEmail } from "../helpers/signupHelper.js"; 

export const createSeller = async(req,res) => {
   //add a new user to the database with 
   const {username, password,  email} = req.body;
   const isNotUnique = await checkUniqueUsernameEmail(username, email);

        if (isNotUnique) {
            return res.status(400).json({ message: 'Username or email is already in use.' });
        }
   try{
      const seller = await Seller.create({username,  email, password});
      res.status(200).json(seller);
   }catch(error){
      res.status(400).json({error:error.message});
   }
}


export const updateSeller = async (req, res) => {
   const {username} = req.params;
   try{
      const updatedSeller = await Seller.findOneAndUpdate(
         { username },        
         req.body,         
         { new: true, runValidators: true }          
       );
       if (!updatedSeller){
         res.status(400).json({error:error.message});
       }
      res.status(200).json(updatedSeller);
   }catch(error){
      res.status(400).json({error:error.message});
   }
};


  export const getSellers = async (req, res) => {
    //retrieve all users from the database
    try{
       const sellers = await Seller.find({});
       res.status(200).json(sellers);
    }catch(error){
       res.status(400).json({error:error.message});
    }
 }
 


import TourGuide from '../models/tourGuideModel.js'; 

export const createTourGuide = async(req,res) => {
   //add a new user to the database with 
   const {username, email, password} = req.body;
   try{
      const tourGuide = await TourGuide.create({username, email, password});
      res.status(200).json(tourGuide);
   }catch(error){
      res.status(400).json({error:error.message});
   }
}


export const updateTourGuide = async (req, res) => {
   const {username} = req.params;
   try{
      const updatedTourGuide = await TourGuide.findOneAndUpdate(
         { username },        
         req.body,         
         { new: true, runValidators: true }          
       );
       if (!updatedTourGuide){
         res.status(400).json({error:error.message});
       }
      res.status(200).json(updatedTourGuide);
   }catch(error){
      res.status(400).json({error:error.message});
   }
};


  export const getTourGuides = async (req, res) => {
    //retrieve all users from the database
    try{
       const tourGuides = await TourGuide.find({});
       res.status(200).json(tourGuides);
    }catch(error){
       res.status(400).json({error:error.message});
    }
 }
 

import mongoose from "mongoose";
import HistoricalPlace from "../models/historicalPlacesModel.js";
//const  mongoose = require('mongoose');



export const createHistoricalPlace= async (req, res) => {
    try {
      const { name, description, location, image, openingHours, price,tags } = req.body;
  
      if (!name || !description || !location || !image || !openingHours || !price) {
        return res.status(400).json({ message: "All fields are required." });
      }
      // Create a new HistoricalPlace instance
      const newPlace = new HistoricalPlace({name,description,location,image,openingHours,price,tags         
      });
  
        await newPlace.save();
      // Respond with the saved document
      res.status(201).json({message:" Historical place created successfully",newPlace});
    } catch (error) {
      console.error("Error creating new historical place:", error);
      res.status(500).json({ message: "Server error. Could not create the historical place." });
    }
  }; 

   //TourismGovernor only
export const getMyPlaces = async(req, res) => {    
  let Places;
  if(user.type === "TourismGovernor"){
      Places = await HistoricalPlace.find({TourismGovernorId: user.id});
      if(Places.length == 0)
          res.status(204);
      else
          res.status(200).json({Places});
  }else{
      res.status(400).json({message:"enter a valid id"});
  }
};

  
export const getAllHistoricalPlaces= async(req,res)=>{

    try {
        const places= await HistoricalPlace.find();
        
        res.status(200).json(places);
         

    } catch (error) {
        console.error("Error fetching activity categories:", error);
      res.status(500).json({ message: "Internal server error" });
    }
};

export const deleteHistoricalPLace=async(req,res)=>{
 
 const {id}= req.params;
 try {
  if(!mongoose.Types.ObjectId.isValid(id)){
    return res.status(404).json({  message:"Historical place not found; invalid id"});
  }
   
  const deletedPlace = await HistoricalPlace.findByIdAndDelete(id);
  if (!deletedPlace) {
    return res.status(404).json({ message: "Historical Place not found" });
  }

  res.status(200).json({ message: "Historical Place deleted successfully" });
} catch (error) {
  console.error("Error deleting Historical Place:", error);
  res.status(500).json({ message: "Internal server error" });
}
};


export const updateHistoricalPLace = async (req, res) => {
  
  try {
    const { id } = req.params;   
    const updatedData = req.body;  
    if(!mongoose.Types.ObjectId.isValid(id)){
      return res.status(404).json({  message:"Historical place not found; invalid id"});
    }
     
    const updatedPlace = await HistoricalPlace.findByIdAndUpdate(id, updatedData, {
      new: true, 
      runValidators: true  
    });
    if (!updatedPlace) {
      return res.status(404).json({ message: "Historical Place not found" });
    }

    res.status(200).json({ message: "Historical place updated successfully", updatedPlace });
  } catch (error) {
    console.error("Error updating historical place:", error);
    res.status(500).json({ message: "Server error. Could not update the historical place." });
  }
};
 

export const createTags=async(req,res)=>{

    try {
      const { id } = req.params;  
      const { type, historicalPeriod } = req.body;  
      // Find the historical place by ID
      if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({  message:"Historical place not found; invalid id"});
      }
      const place = await HistoricalPlace.findById(id);
      if (!place) {
        return res.status(404).json({ message: "Historical Place not found" });
      }
    
  
      // Update the type and/or historical period
      if (type) 
        place.tags.type = type;
      if (historicalPeriod) 
        place.tags.historicalPeriod = historicalPeriod;
      await place.save();
      
  
      res.status(200).json({ message: "Tags updated successfully", place });
    } catch (error) {
      console.error("Error updating tags:", error);
      res.status(500).json({ message: "Server error. Could not update the tags." });
    
  }
};

export const filterbyTags =async(req,res)=>{
  try {
    const { type, historicalPeriod } = req.query;  

    // Build the query object dynamically
    const filter = {};

    // Add filters to the query object based on the presence of query parameters
    if (type) 
          filter['tags.type'] = type;  
    if (historicalPeriod) 
      filter['tags.historicalPeriod'] = historicalPeriod;  
   
    const filteredPlaces = await HistoricalPlace.find(filter);

    // Send response
    res.status(200).json(filteredPlaces);

  } catch (error) {
    console.error("Error filtering historical places:", error);
    res.status(500).json({ message: "Server error. Could not filter historical places." });
  }



  
}


  

//module.exports = { getAllHistoricalPlaces,deleteHistoricalPLace,updateHistoricalPLace, };

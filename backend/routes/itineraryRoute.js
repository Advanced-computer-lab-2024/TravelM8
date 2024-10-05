import express from "express";
import { createItinerary, 
    readItineraries, 
    updateItinerary,
    deleteItinerary,
    //filterItineraries 
}
 from "../controllers/itineraryController.js"; 

 const router = express.Router();

 router.post("/itineraries", createItinerary); // Create a new itinerary
 router.get("/itineraries", readItineraries); // Retrieve all itineraries
 router.put("/itineraries/:id", updateItinerary); // Update an itinerary by ID
 router.delete("/itineraries/:id", deleteItinerary); // Delete an itinerary by ID
 //router.filter("/itineraries/:id",filterItineraries);

 export default router;
import express from "express";
import { createItinerary, 
    readItineraries, 
    updateItinerary,
    deleteItinerary,
    filterItineraries }
 from "../controllers/itineraryController.js"; 

 const router = express.Router();

 router.post("/api/itineraries", createItinerary); // Create a new itinerary
 router.get("/api/itineraries", readItineraries); // Retrieve all itineraries
 router.put("/api/itineraries/:id", updateItinerary); // Update an itinerary by ID
 router.delete("/api/itineraries/:id", deleteItinerary); // Delete an itinerary by ID
 //router.filter("/api/itineraries/:id",filterItineraries);

/*
router.post('/', createItinerary);
router.get('/', readItineraries);
router.put('/:id', updateItinerary);
router.delete('/:id', deleteItinerary);
*/
 export default router;
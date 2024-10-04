import express from "express";
import { 
    createHistoricalPlace ,
    getAllHistoricalPlaces,
    deleteHistoricalPLace,
    updateHistoricalPLace,
    createTags,
    filterbyTags,}
 from "../controllers/historicalPlacesController.js"; 

const router = express.Router();

router.post("/addPlace", createHistoricalPlace);  
router.get("/getAllPlaces", getAllHistoricalPlaces);    
router.put("/updatePlace/:id", updateHistoricalPLace); 
router.delete("/deletePlace/:id", deleteHistoricalPLace); 
router.put("/createTag/:id",createTags);
router.get("/filterbyTags",filterbyTags);





export default router;
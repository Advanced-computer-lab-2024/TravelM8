import express from "express";
import { 
    createNewActivity, 
    getAllActivities, 
    getActivityById,
    getMyActivities,
    updateActivity,
    deleteActivity 
} from "../controllers/activityController.js"; 

const router = express.Router();

router.get("/activities", getAllActivities); // Retrieve all activities
router.get("/activities/:id", getActivityById); // Retrieve a single activity by ID
router.get("/activities/myActivities", getMyActivities); // Retrieve all activities
router.post("/activities", createNewActivity); // Create a new activity
router.put("/activities/:id", updateActivity); // Update an activity by ID
router.delete("/activities/:id", deleteActivity); // Delete an activity by ID

// router.get("/api/activities", getAllActivities); // Retrieve all activities
// router.get("/api/activities/:id", getActivityById); // Retrieve a single activity by ID
// router.get("/api/activities/myActivities", getMyActivities); // Retrieve all activities
// router.post("/api/activities", createNewActivity); // Create a new activity
// router.put("/api/activities/:id", updateActivity); // Update an activity by ID
// router.delete("/api/activities/:id", deleteActivity); // Delete an activity by ID


export default router;
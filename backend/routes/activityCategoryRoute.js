import express from "express";
import {
  createActivityCategory,
  getAllActivityCategories,
  updateActivityCategory,
  deleteActivityCategory,
} from "../controllers/activityCategoryController.js";

const router = express.Router();

// Activity Category CRUD Routes
router.post("/activity-categories", createActivityCategory);
router.get("/activity-categories", getAllActivityCategories);
router.put("/activity-categories", updateActivityCategory); // if we're updating by name
router.delete("/activity-categories/:id", deleteActivityCategory);

export default router;

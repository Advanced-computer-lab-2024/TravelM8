import express from "express";
import { registerGovernor } from "../controllers/tourismGovernorController.js";

const router = express.Router();

// Tourist Registration Route
router.post("/tourism-governors", registerGovernor);

export default router;

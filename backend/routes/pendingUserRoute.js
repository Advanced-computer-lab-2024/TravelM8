import express from "express";
import {
  createPendingUser,
  acceptPendingUser,
  rejectPendingUser,
  getPendingUsers,
  rejectPendingUser2,
} from "../controllers/pendingUserController.js";

const router = express.Router();

router.get("/pending-users", getPendingUsers);
router.post("/pending-users", createPendingUser);
router.patch("/pending-users/:id", acceptPendingUser);
router.delete("/pending-users/:id", rejectPendingUser);
router.delete("/pending-users-documents/:id", rejectPendingUser2);

export default router;

import express from "express";
import { 
    createPendingUser, 
    acceptPendingUser, 
    rejectPendingUser,
    getPendingUsers,
} from "../controllers/pendingUserController.js"; 


const router = express.Router();

router.get('/pending-users', getPendingUsers);
router.post('/pending-users', createPendingUser);
router.patch('/pending-users/:id', acceptPendingUser);
router.delete('/pending-users/:id', rejectPendingUser);

export default router;

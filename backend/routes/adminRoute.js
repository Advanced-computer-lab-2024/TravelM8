import expresss from 'express';
import {registerAdmin, deleteAccount} from '../controllers/adminController.js';

const router =expresss.Router();

// Admin Registration Route

router.post("/admins/register", registerAdmin);
router.delete("/users/:username", deleteAccount); //

// router.delete("/api/delete-user/:username", deleteAccount);

export default router;

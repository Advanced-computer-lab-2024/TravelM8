import express from 'express';
import { createDeletionRequest, getAllDeletionRequests } from '../controllers/deleteRequestController.js';
import verifyToken from "../services/tokenDecodingService.js";
const router = express.Router();

router.post('/deleteRequests', createDeletionRequest);
router.get('/Allrequests', getAllDeletionRequests);

export default router;

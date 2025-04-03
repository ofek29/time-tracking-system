import express from 'express';
import { getTime } from '../controllers/timeController.js';
import { requireAuth, requireRole } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/current', requireAuth, requireRole(['user', 'admin']), getTime);

export default router;
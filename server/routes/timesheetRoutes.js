import express from 'express';
import { getUserTimesheet, checkIn, checkOut } from '../controllers/timesheetController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(authenticateToken);
router.get('/me', getUserTimesheet);
router.post('/checkin', checkIn);
router.post('/checkout', checkOut);

export default router;
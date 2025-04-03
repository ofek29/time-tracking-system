import express from 'express';
import { getUserTimesheet, checkIn, checkOut } from '../controllers/timesheetController.js';
import { requireAuth, requireRole } from '../middleware/authMiddleware.js';

const router = express.Router();

// Middleware to authenticate user
router.use(requireAuth, requireRole('user'));

// Timesheet routes
router.get('/me', getUserTimesheet);
router.post('/checkin', checkIn);
router.post('/checkout', checkOut);

export default router;
import express from 'express';
import { getUsers, getAllTimesheets, updateTimesheetRecord } from '../controllers/adminController.js';
import { requireAuth, requireRole } from '../middleware/authMiddleware.js';

const router = express.Router();

// Middleware to authenticate admin
router.use(requireAuth, requireRole('admin'));

// Admin routes
router.get('/users', getUsers);
router.get('/timesheets', getAllTimesheets);
router.patch('/timesheets/:userId/:date', updateTimesheetRecord);


export default router;
import express from 'express';
import { getUsers, getAllTimesheets, updateTimesheetRecord } from '../controllers/adminController.js';
const router = express.Router();

// Admin routes
router.get('/users', getUsers);
router.get('/timesheets', getAllTimesheets);
router.patch('/timesheets/:userId/:date', updateTimesheetRecord);


export default router;
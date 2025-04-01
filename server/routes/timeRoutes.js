import express from 'express';
import { getTime } from '../controllers/timeController.js';

const router = express.Router();

router.get('/current', getTime);

export default router;
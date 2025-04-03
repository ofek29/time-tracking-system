import express from 'express';
import { login, logout, refreshToken } from '../controllers/authController.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/login', login);
router.post('/logout', logout);
router.post('/refresh', refreshToken);

// Used to get current logged-in user's info
router.get('/me', requireAuth, (req, res) => {
    res.json({ user: req.user });
});

export default router;

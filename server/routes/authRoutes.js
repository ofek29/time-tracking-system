import express from 'express';
import { login, logout, refreshToken } from '../controllers/authController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';
const router = express.Router();

// Authentication routes
router.post('/login', login);
router.post('/logout', logout);
router.post('/refresh', refreshToken);
router.get('/me', authenticateToken, (req, res) => {
    const user = req.user;
    res.json({ user });
});

export default router;
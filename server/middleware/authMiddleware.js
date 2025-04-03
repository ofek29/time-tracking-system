import jwt from 'jsonwebtoken';
import config from '../config/config.js';

const ACCESS_TOKEN_SECRET = config.jwt.accessTokenSecret;

export const requireAuth = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    try {
        const decoded = jwt.verify(token, ACCESS_TOKEN_SECRET);
        // Attach user data to request
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Invalid or expired access token', requireRefresh: true });
    }
};

export const requireRole = (roles) => {
    const allowed = Array.isArray(roles) ? roles : [roles];
    return (req, res, next) => {
        if (!req.user || !allowed.includes(req.user.role)) {
            return res.status(403).json({ message: 'Forbidden. You do not have the required role.' });
        }
        next();
    };
};

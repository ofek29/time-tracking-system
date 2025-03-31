import jwt from 'jsonwebtoken';

const ACCESS_TOKEN_SECRET = process.env.JWT_SECRET_KEY;

export const authenticateToken = (req, res, next) => {
    const token = req.cookies.accessToken;

    if (!token) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    try {
        const decoded = jwt.verify(token, ACCESS_TOKEN_SECRET);

        // Attach user data to request
        req.user = decoded;
        next();
    } catch (error) {
        // When access token is expired/invalid, client should try to refresh
        res.status(401).json({ message: 'Invalid or expired access token', requireRefresh: true });
    }
};
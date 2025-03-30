import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { readDataFile } from '../services/fileService.js';

const JWT_SECRET = process.env.JWT_SECRET_KEY;
const COOKIE_MAX_AGE = 24 * 60 * 60 * 1000; // 24 hours

// Login a user
export const login = async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Read users data from file
        const users = await readDataFile('users.json');

        const user = users[username];

        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Create JWT token
        const token = generateToken(user);

        // Set cookie with JWT token
        res.cookie('authToken', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: COOKIE_MAX_AGE,
            sameSite: 'strict'
        });

        // Return user info (without password)
        const userWithoutPassword = { username: user.username, id: user.id, role: user.role };
        return res.status(200).json({
            message: 'Login successful',
            user: userWithoutPassword
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Log out a user by clearing the authentication cookie
export const logout = (req, res) => {
    res.clearCookie('authToken');
    res.status(200).json({ message: 'Logged out successfully' });
};

// Refresh the authentication token
export const refreshToken = async (req, res) => {
    try {
        // Get the token from cookie
        const token = req.cookies.authToken;

        if (!token) {
            return res.status(401).json({ message: 'Not authenticated' });
        }

        // Verify and decode the token
        try {
            const decoded = jwt.verify(token, JWT_SECRET);

            // Read users to get current user data
            const users = await readDataFile('users.json');
            const user = users[decoded.username];

            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            // Generate a new token
            const newToken = generateToken(user);

            // Set the new token in a cookie
            res.cookie('authToken', newToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                maxAge: COOKIE_MAX_AGE,
                sameSite: 'strict'
            });

            const userWithoutPassword = { username: user.username, id: user.id, role: user.role };
            return res.status(200).json({
                message: 'Token refreshed successfully',
                user: userWithoutPassword
            });

        } catch (error) {
            res.clearCookie('authToken');
            return res.status(401).json({ message: 'Invalid or expired token' });
        }
    } catch (error) {
        console.error('Token refresh error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

/**
 * Generate a JWT token for a user
 * @param {Object} user - User object containing user data
 * @returns {string} - JWT token
 */
function generateToken(user) {
    return jwt.sign(
        {
            username: user.username,
            id: user.id,
            role: user.role
        },
        JWT_SECRET,
        { expiresIn: '1h' }
    );
}
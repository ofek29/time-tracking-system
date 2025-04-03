import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { readDataFile } from '../services/fileService.js';
import config from '../config/config.js';

const isProduction = config.isProduction;
const ACCESS_TOKEN_SECRET = config.jwt.accessTokenSecret;
const REFRESH_TOKEN_SECRET = config.jwt.refreshTokenSecret;
const ACCESS_TOKEN_EXPIRY = config.jwt.accessTokenExpiry;
const REFRESH_TOKEN_EXPIRY = config.jwt.refreshTokenExpiry;
const REFRESH_COOKIE_MAX_AGE = config.cookie.refreshMaxAge;



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

        // Create JWT tokens
        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        // Set cookie with JWT refresh token
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: isProduction,
            sameSite: 'strict',
            maxAge: REFRESH_COOKIE_MAX_AGE
        });

        // Return user info (without password)
        const { password: _, ...userWithoutPassword } = user;
        return res.status(200).json({
            accessToken,
            message: 'Login successful',
            user: {
                username,
                ...userWithoutPassword
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Log out a user by clearing the authentication cookie
export const logout = async (req, res) => {
    res.clearCookie('refreshToken');
    res.status(200).json({ message: 'Logged out successfully' });
};

// Refresh the authentication token
export const refreshToken = async (req, res) => {
    try {
        // Get the token from cookie
        const token = req.cookies.refreshToken;

        if (!token) {
            return res.status(401).json({ message: 'Not authenticated' });
        }

        // Verify and decode the token
        try {
            const decoded = jwt.verify(token, REFRESH_TOKEN_SECRET);

            // Read users to get current user data
            const users = await readDataFile('users.json');
            const user = users[decoded.username];

            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            // Generate a new token
            const newAccessToken = generateAccessToken(user);
            const newRefreshToken = generateRefreshToken(user);

            res.cookie('refreshToken', newRefreshToken, {
                httpOnly: true,
                secure: isProduction,
                maxAge: REFRESH_COOKIE_MAX_AGE,
                sameSite: 'strict'
            });

            const { password: _, ...userWithoutPassword } = user;
            return res.status(200).json({
                accessToken: newAccessToken,
                message: 'Token refreshed successfully',
                user: {
                    username: decoded.username,
                    ...userWithoutPassword
                }
            });

        } catch (error) {
            res.clearCookie('refreshToken');
            return res.status(401).json({ message: 'Invalid or expired token' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};

function generateAccessToken(user) {
    return jwt.sign(
        { username: user.username, id: user.id, role: user.role },
        ACCESS_TOKEN_SECRET,
        { expiresIn: ACCESS_TOKEN_EXPIRY }
    );
}

function generateRefreshToken(user) {
    return jwt.sign(
        { username: user.username, id: user.id, role: user.role },
        REFRESH_TOKEN_SECRET,
        { expiresIn: REFRESH_TOKEN_EXPIRY }
    );
}
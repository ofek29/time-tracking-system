import dotenv from 'dotenv';
dotenv.config();

export default {
    port: process.env.PORT || 3000,
    jwt: {
        accessTokenSecret: process.env.JWT_ACCESS_SECRET || 'access_token_dev_secret',
        refreshTokenSecret: process.env.JWT_REFRESH_SECRET || 'refresh_token_dev_secret',
        accessTokenExpiry: '15m',
        refreshTokenExpiry: '7d'
    },
    cookie: {
        refreshMaxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    },
    isProduction: process.env.NODE_ENV === 'production'
};
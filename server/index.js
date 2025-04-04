import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/authRoutes.js';
import timeRoutes from './routes/timeRoutes.js';
import timesheetRoutes from './routes/timesheetRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import config from './config/config.js';

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/time', timeRoutes);
app.use('/api/timesheet', timesheetRoutes);
app.use('/api/admin', adminRoutes);


// Start server
const port = config.port;
const server = app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});

// Graceful shutdown function
const shutdownServer = async () => {
    console.log("\nShutting down...");
    try {
        server.close(() => {
            console.log("Server stopped.");
            process.exit(0);
        });
    } catch (error) {
        console.error('Failed to close server', error);
        process.exit(1);
    }
};

// Handle shutdown signals
process.on('SIGINT', shutdownServer);
process.on('SIGTERM', shutdownServer);

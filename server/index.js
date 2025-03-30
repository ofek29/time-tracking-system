import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
    res.send('Time Tracking API is running');
});

const port = process.env.PORT || 3000;
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

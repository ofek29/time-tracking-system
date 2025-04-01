import { getBerlinTime } from "../services/timeService.js";

export const getTime = async (req, res) => {
    try {
        const response = await getBerlinTime();
        res.status(200).json(response);

    } catch (error) {
        res.status(500).json({ message: "Failed to fetch time data" });
    }
};
import axios from "axios";
import { getTime } from "../services/timeService";

export const getTime = async (req, res) => {
    try {
        const response = await getTime();
        res.status(200).json(response.data);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch time data" });
    }
};
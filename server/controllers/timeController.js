import axios from "axios";

export const getTime = async (req, res) => {
    try {
        const response = await axios.get("https://timeapi.io/api/Time/current/zone?timeZone=Europe/Berlin");
        res.status(200).json(response.data);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch time data" });
    }
};
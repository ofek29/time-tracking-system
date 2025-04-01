import axios from "axios";

export const getTime = async () => {
    const response = await axios.get("https://timeapi.io/api/Time/current/zone?timeZone=Europe/Berlin");
    return response.data;
}
import axios from "axios";

/**
 * Fetches the current date and time in the Europe/Berlin timezone
 * from the timeapi.io API
 *
 * @async
 * @function
 * @returns {Promise<{
*   year: number,
*   month: number,
*   day: number,
*   hour: number,
*   minute: number,
*   seconds: number,
*   milliSeconds: number,
*   dateTime: string,
*   date: string,
*   time: string,
*   timeZone: string,
*   dayOfWeek: string,
*   dstActive: boolean
* }>} Resolves with an object containing detailed date and time information.
*
*/
export const getBerlinTime = async () => {
    try {
        const response = await axios.get(
            "https://timeapi.io/api/Time/current/zone?timeZone=Europe/Berlin",
        );
        return response.data;
    } catch (error) {
        console.log("Error fetching time data from API", error);
    }
};

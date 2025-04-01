import axios from "axios";

/**
 * Fetches the current date and time in the Europe/Berlin timezone
 * from the timeapi.io API, with fallback to local calculation.
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
    const maxRetries = 2;

    for (let attempt = 0; attempt < maxRetries; attempt++) {
        try {
            const response = await axios.get(
                "https://timeapi.io/api/Time/current/zone?timeZone=Europe/Berlin",
                { timeout: 2000 }
            );
            return response.data;
        } catch (error) {
            console.log(`API attempt ${attempt + 1} failed: ${error.message}`);

            // If this is the last retry, don't wait
            if (attempt < maxRetries - 1) {
                // Wait 1 second before retrying
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
        }
    }

    // Stupid Fallback: Calculate Berlin time locally
    // Berlin is typically 1 hour behind Israel
    console.log("Using fallback local time calculation for Berlin time");

    const now = new Date();

    // Create a date for Berlin (1 hour behind Israel)
    const berlinTime = new Date(now.getTime() - 60 * 60 * 1000);

    // Format data to match the structure from the API
    const year = berlinTime.getFullYear();
    const month = berlinTime.getMonth() + 1;
    const day = berlinTime.getDate();
    const hour = berlinTime.getHours();
    const minute = berlinTime.getMinutes();
    const seconds = berlinTime.getSeconds();
    const milliSeconds = berlinTime.getMilliseconds();

    // Create formatted strings
    const formattedDate = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
    const formattedTime = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    const dateTime = `${formattedDate} ${formattedTime}`;

    // Get day of week
    const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const dayOfWeek = daysOfWeek[berlinTime.getDay()];

    // Return data in the same format as the API would
    return {
        year,
        month,
        day,
        hour,
        minute,
        seconds,
        milliSeconds,
        dateTime,
        date: formattedDate,
        time: formattedTime,
        timeZone: "Europe/Berlin",
        dayOfWeek,
        dstActive: isDSTActive(berlinTime)
    };
};

/**
 * Roughly detects if DST is active for a given date in Berlin.
 */
const isDSTActive = (date) => {
    const jan = new Date(date.getFullYear(), 0, 1).getTimezoneOffset();
    const jul = new Date(date.getFullYear(), 6, 1).getTimezoneOffset();
    return date.getTimezoneOffset() < Math.max(jan, jul);
};
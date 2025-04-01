import { readDataFile, writeDataFile } from "../services/fileService.js";


export const getUsers = async (req, res) => {
    try {
        const users = await readDataFile("users.json");
        const userList = Object.entries(users)
            .filter(([_, userData]) => userData.role !== "admin") // Exclude admin users
            .map(([username, userData]) => ({
                id: userData.id,
                username,
                role: userData.role,
            }));
        res.status(200).json(userList);
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }

};

export const getAllTimesheets = async (req, res) => {
    try {
        const timesheets = await readDataFile("timesheet.json");
        res.status(200).json(timesheets);
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};

export const updateTimesheetRecord = async (req, res) => {
    const { userId, date } = req.params;
    const { checkIn, checkOut } = req.body;

    if (!checkIn && !checkOut) {
        return res.status(400).json({ message: "At least one of checkIn or checkOut must be provided." });
    }

    try {
        const timesheets = await readDataFile("timesheet.json");
        const userEntry = timesheets.find(entry => entry.userId === Number(userId));

        if (!userEntry) {
            return res.status(404).json({ message: "User not found in timesheets." });
        }

        let record = userEntry.records.find(r => r.date === date);
        if (!record) {
            record = { date };
            userEntry.records.push(record);
        }

        if (checkIn) record.checkIn = checkIn;
        if (checkOut) record.checkOut = checkOut;

        await writeDataFile("timesheet.json", timesheets);
        res.status(200).json({ message: "Timesheet updated successfully." });
    } catch (err) {
        res.status(500).json({ message: "Internal server error" });
    }
};

import { readDataFile, writeDataFile } from "../services/fileService.js";
import { getBerlinTime } from "../services/timeService.js";


export const getUserTimesheet = async (req, res) => {
    const userId = req.user.id;
    console.log(`User ID: ${userId}`);
    const time = await getBerlinTime();
    const timesheet = await readDataFile("timesheet.json");
    if (!timesheet) {
        return res.status(200).json(null);
    }

    const userTimesheet = timesheet.find(user => user.userId === userId);
    if (!userTimesheet) {
        return res.status(200).json(null);
    }

    const todayRecord = userTimesheet.records.find(record => record.date === time.date);
    return res.status(200).json(todayRecord || null);
};

export const checkIn = async (req, res) => {
    const userId = req.user.id;
    const time = await getBerlinTime();

    const timesheet = await readDataFile("timesheet.json");
    const userTimesheet = timesheet.find((user) => user.userId === userId);

    if (!userTimesheet) {
        timesheet.push({
            userId,
            records: [{ date: time.date, checkIn: time.time }]
        });
    } else {
        const record = userTimesheet.records.find(r => r.date === time.date);
        if (record) {
            if (record.checkIn) {
                return res.status(400).json({ message: "Already checked in today" });
            }
            record.checkIn = time.time;
        } else {
            userTimesheet.records.push({
                date: time.date,
                checkIn: time.time
            });
        }
    }

    await writeDataFile("timesheet.json", timesheet);
    return res.status(200).json({ message: "Check-in successful", time: time.time });
}

export const checkOut = async (req, res) => {
    const userId = req.user.id;
    const time = await getBerlinTime();

    const timesheet = await readDataFile("timesheet.json");
    const userTimesheet = timesheet.find(user => user.userId === userId);

    if (!userTimesheet) {
        return res.status(400).json({ message: "Check-in not found for today" });
    }

    const record = userTimesheet.records.find(r => r.date === time.date);

    if (!record || !record.checkIn) {
        return res.status(400).json({ message: "Check-in not found for today" });
    }

    if (record.checkOut) {
        return res.status(400).json({ message: "Already checked out today" });
    }

    record.checkOut = time.time;

    await writeDataFile("timesheet.json", timesheet);
    return res.status(200).json({ message: "Check-out successful", time: time.time });
};
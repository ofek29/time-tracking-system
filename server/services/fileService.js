import fs from 'fs/promises';
import path from 'path';

const getFilePath = (fileName) => {
    return path.join(__dirname, '..', 'data', fileName);
}

/** 
 * Reads a JSON file and returns the parsed data.
 * @param {string} fileName - The name of the file to read.
 * @returns {Promise<Object>} - The parsed JSON data.
 */
export const readDataFile = async (fileName) => {
    try {
        const data = await fs.readFile(getFilePath(fileName), 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error(`Error reading file ${fileName}:`, error);
    }

}

/**
 * Writes data to a JSON file.
 * @param {string} fileName - The name of the file to write to.
 * @param {Object} data - The data to write to the file.
 * @returns {Promise<void>}
 */
export const writeDataFile = async (fileName, data) => {
    try {
        const jsonData = JSON.stringify(data, null, 2);
        await fs.writeFile(getFilePath(fileName), jsonData, 'utf8');
    } catch (error) {
        console.error(`Error writing to file ${fileName}:`, error);
    }
}
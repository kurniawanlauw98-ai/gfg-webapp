const { GoogleSpreadsheet } = require('google-spreadsheet');
require('dotenv').config();

let doc;

const getDoc = () => {
    if (!doc) {
        if (!process.env.GOOGLE_SHEETS_ID) {
            throw new Error('GOOGLE_SHEETS_ID is missing');
        }
        doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEETS_ID);
    }
    return doc;
};

const initDoc = async () => {
    if (!process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || !process.env.GOOGLE_PRIVATE_KEY || !process.env.GOOGLE_SHEETS_ID) {
        throw new Error('Missing Google Sheets Environment Variables (EMAIL, PRIVATE_KEY, or ID)');
    }

    const document = getDoc();
    const privateKey = process.env.GOOGLE_PRIVATE_KEY
        .replace(/\\n/g, '\n') // Handle escaped \n
        .replace(/\n /g, '\n') // Handle potential indentation after \n
        .replace(/^"(.*)"$/, '$1'); // Remove surrounding quotes if they exist

    await document.useServiceAccountAuth({
        client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        private_key: privateKey,
    });
    await document.loadInfo();
};

/**
 * Sync data to a specific sheet (Append)
 */
const syncToSheet = async (title, data) => {
    try {
        await initDoc();
        const document = getDoc();
        let sheet = document.sheetsByTitle[title];

        if (!sheet) {
            const headers = Object.keys(data[0] || {});
            sheet = await document.addSheet({ title, headerValues: headers });
        }

        await sheet.addRows(data);
        console.log(`Successfully synced ${data.length} rows to sheet: ${title}`);
    } catch (error) {
        console.error(`Error syncing to Google Sheets (${title}):`, error.message);
        throw new Error(`Google Sheets Write Error: ${error.message}`);
    }
};

/**
 * Get all rows from a specific sheet
 */
const getRows = async (title) => {
    try {
        await initDoc();
        const document = getDoc();
        const sheet = document.sheetsByTitle[title];
        if (!sheet) return [];
        return await sheet.getRows();
    } catch (error) {
        console.error(`Error getting rows from Google Sheets (${title}):`, error);
        return [];
    }
};

/**
 * Update a user's points in the sheet
 */
const updateUserPoints = async (email, pointsToAdd) => {
    try {
        await initDoc();
        const document = getDoc();
        const sheet = document.sheetsByTitle['Users'];
        if (!sheet) return;
        const rows = await sheet.getRows();
        const row = rows.find(r => r.Email && r.Email.toLowerCase() === email.toLowerCase());
        if (row) {
            row.Points = (parseInt(row.Points) || 0) + pointsToAdd;
            await row.save();
        } else {
            throw new Error(`User with email ${email} not found to update points`);
        }
    } catch (error) {
        console.error(`Error updating points in Google Sheets:`, error.message);
        throw error;
    }
};

/**
 * Update a user's role in the sheet
 */
const updateUserRole = async (email, newRole) => {
    try {
        await initDoc();
        const document = getDoc();
        const sheet = document.sheetsByTitle['Users'];
        if (!sheet) return false;
        const rows = await sheet.getRows();
        const row = rows.find(r => r.Email && r.Email.toLowerCase() === email.toLowerCase());
        if (row) {
            row.Role = newRole;
            await row.save();
            return true;
        }
        return false;
    } catch (error) {
        console.error(`Error updating role in Google Sheets:`, error);
        return false;
    }
};

/**
 * Generic Update row by ID
 */
const updateSheetRow = async (title, id, updatedData) => {
    try {
        await initDoc();
        const document = getDoc();
        const sheet = document.sheetsByTitle[title];
        if (!sheet) return false;
        const rows = await sheet.getRows();
        const row = rows.find(r => r.ID === id);
        if (row) {
            Object.assign(row, updatedData);
            await row.save();
            return true;
        }
        return false;
    } catch (error) {
        console.error(`Error updating row in Google Sheets (${title}):`, error);
        return false;
    }
};

/**
 * Test Connection Diagnostic
 */
const testConnection = async () => {
    try {
        await initDoc();
        const document = getDoc();
        return {
            success: true,
            title: document.title,
            sheets: document.sheetsByIndex.map(s => s.title)
        };
    } catch (error) {
        return {
            success: false,
            error: error.message
        };
    }
};

module.exports = { syncToSheet, getRows, updateUserPoints, updateUserRole, updateSheetRow, testConnection };

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
    await document.useServiceAccountAuth({
        client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/gm, '\n').replace(/"/g, ''),
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
        console.error(`Error syncing to Google Sheets (${title}):`, error);
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
        const row = rows.find(r => r.Email === email);
        if (row) {
            row.Points = (parseInt(row.Points) || 0) + pointsToAdd;
            await row.save();
        }
    } catch (error) {
        console.error(`Error updating points in Google Sheets:`, error);
    }
};

module.exports = { syncToSheet, getRows, updateUserPoints };

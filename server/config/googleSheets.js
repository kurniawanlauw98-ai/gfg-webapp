const { GoogleSpreadsheet } = require('google-spreadsheet');
const { JWT } = require('google-auth-library');
require('dotenv').config();

// Initialize auth
const serviceAccountAuth = new JWT({
    email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    key: process.env.GOOGLE_PRIVATE_KEY.replace(/^"/, '').replace(/"$/, '').replace(/\\n/g, '\n'),
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEETS_ID, serviceAccountAuth);

/**
 * Sync data to a specific sheet
 * @param {string} title - The title of the sheet (tab)
 * @param {Array<Object>} data - Array of objects to append as rows
 */
const syncToSheet = async (title, data) => {
    try {
        await doc.loadInfo();
        let sheet = doc.sheetsByTitle[title];

        // Create sheet if it doesn't exist
        if (!sheet) {
            const headers = Object.keys(data[0] || {});
            sheet = await doc.addSheet({ title, headerValues: headers });
        }

        await sheet.addRows(data);
        console.log(`Successfully synced ${data.length} rows to sheet: ${title}`);
    } catch (error) {
        console.error(`Error syncing to Google Sheets (${title}):`, error);
        throw error;
    }
};

module.exports = { syncToSheet };

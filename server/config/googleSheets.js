const { GoogleSpreadsheet } = require('google-spreadsheet');
require('dotenv').config();

const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEETS_ID);

/**
 * Sync data to a specific sheet
 * @param {string} title - The title of the sheet (tab)
 * @param {Array<Object>} data - Array of objects to append as rows
 */
const syncToSheet = async (title, data) => {
    try {
        // Authenticate using Service Account in v3 syntax
        await doc.useServiceAccountAuth({
            client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
            private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/gm, '\n').replace(/"/g, ''),
        });

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
        // Don't throw if it's just a sync failure to prevent server crash
    }
};

module.exports = { syncToSheet };

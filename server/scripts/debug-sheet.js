const { GoogleSpreadsheet } = require('google-spreadsheet');
require('dotenv').config();

const diagnose = async () => {
    try {
        if (!process.env.GOOGLE_SHEETS_ID) {
            console.error('Missing GOOGLE_SHEETS_ID');
            return;
        }

        const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEETS_ID);

        const privateKey = process.env.GOOGLE_PRIVATE_KEY
            .replace(/\\n/g, '\n')
            .replace(/\n/g, '\n')
            .replace(/"/g, '')
            .replace(/'/g, '')
            .trim();

        await doc.useServiceAccountAuth({
            client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
            private_key: privateKey,
        });

        await doc.loadInfo();
        console.log(`Document Title: ${doc.title}`);

        const sheet = doc.sheetsByTitle['Users'];
        if (!sheet) {
            console.log("Sheet 'Users' NOT found!");
            // List all sheets
            console.log("Available sheets:");
            doc.sheetsByIndex.forEach(s => console.log(` - ${s.title}`));
            return;
        }

        console.log("Sheet 'Users' FOUND.");
        console.log("Header Values:", sheet.headerValues);

        const rows = await sheet.getRows();
        console.log(`Row count: ${rows.length}`);

        if (rows.length > 0) {
            console.log("First row keys:", Object.keys(rows[0]));
            // Try access
            const firstRow = rows[0];
            console.log(`Email check: r.Email='${firstRow.Email}' | r.email='${firstRow.email}'`);
        }

    } catch (error) {
        console.error("Error:", error);
    }
};

diagnose();

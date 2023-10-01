const express = require("express");
const multer = require("multer");
const csv = require("csv-parser");
const { google } = require('googleapis');
const { OAuth2Client, GoogleAuth } = require('google-auth-library');
const fs = require('fs').promises;
const path = require('path');
const process = require('process');
require('dotenv').config()
const cors = require("cors");
const authorize = require("./hello");

const app = express();
const port = 3000;
app.use(express.json())
// Set up multer storage engine
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
app.use(cors());
// Handle POST request to /upload


app.post("/upload", upload.single("file"), (req, res) => {
    const csvFile = req.file;
    if (!csvFile) {
        return res.status(400).send("No CSV file uploaded");
    }

    // Parse the CSV file and extract the column names
    const columnNames = [];
    csvFile.buffer
        .toString()
        .split("\n")[0]
        .split(",")
        .forEach((columnName) => {
            columnNames.push(columnName.trim());
        });

    // Send the column names in the response
    res.send(columnNames);
});



app.post("/spreadsheet", upload.single("data"), async (req, res) => {

    const csvFile = req.file;
    const columnNames = req.body.columns;
    if (!csvFile) {
        return res.status(400).send("No CSV file uploaded");
    }

    // if (!columnNames || !Array.isArray(columnNames)) {
    //     return res.status(400).send("Invalid column names");
    // }

    // Authenticate with Google Sheets API
    // const auth = await authorize();
    // const auth = new google.auth.GoogleAuth({
    //     keyFile: "keys.json", //the key file
    //     //url to spreadsheets API
    //     scopes: "https://www.googleapis.com/auth/spreadsheets", 
    // });
    const authClientObject = await auth.getClient();
    // console.log(auth);
    // Create a new spreadsheet
    const sheets = google.sheets({ version: "v4", authClientObject });
    const spreadsheet = await sheets.spreadsheets.create({
        auth,
        resource: {
            properties: {
                title: "New Spreadsheet",
            },
        },
    });

    // Get the ID of the new spreadsheet
    const spreadsheetId = spreadsheet.data.spreadsheetId;

    // Add a new sheet to the spreadsheet
    await sheets.spreadsheets.batchUpdate({
        spreadsheetId,
        resource: {
            requests: [
                {
                    addSheet: {
                        properties: {
                            title: "Sheet2",
                        },
                    },
                },
            ],
        },
    });

    // Parse the CSV file and extract the data
    const data = [];
    csvFile.buffer
        .toString()
        .split("\n")
        .slice(1)
        .forEach((row) => {
            const rowData = {};
            row.split(",").forEach((value, index) => {
                rowData[columnNames[index]] = value.trim();
            });
            data.push(rowData);
        });

    // Write the data to the new sheet
    await sheets.spreadsheets.values.update({
        spreadsheetId,
        range: "Sheet1!A1",
        valueInputOption: "USER_ENTERED",
        resource: {
            values: [columnNames, ...data.map((row) => Object.values(row))],
        },
    });

    // Send the URL of the new spreadsheet in the response
    res.send(`https://docs.google.com/spreadsheets/d/${spreadsheetId}`);
});



app.get('/hello',(req,res)=>{
    res.send(`https://docs.google.com/spreadsheets/d/`);
    
})
app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});

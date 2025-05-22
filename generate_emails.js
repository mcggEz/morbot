const XLSX = require('xlsx');

// Import the email generation function from robot.js
const { generateFilipinoEmail } = require('./robot.js');

// Generate 257 unique emails
const emails = [];
for (let i = 0; i < 257; i++) {
    emails.push([generateFilipinoEmail(i)]); // Each email in its own row as an array
}

// Create a new workbook and worksheet
const workbook = XLSX.utils.book_new();
const worksheet = XLSX.utils.aoa_to_sheet(emails);

// Add the worksheet to the workbook
XLSX.utils.book_append_sheet(workbook, worksheet, "Emails");

// Write the file
XLSX.writeFile(workbook, "generated_emails.xlsx");

console.log("✅ Excel file with 257 unique emails has been created!"); 
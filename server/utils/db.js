// database/database.js
const mongoose = require("mongoose");

// Connect to the user database
const accountDbConnection = mongoose.createConnection(
  process.env.ACCOUNT_DB_URI
);

// Connect to the post database
const appDbConnection = mongoose.createConnection(process.env.APP_DB_URI);

// Error handling for the user database connection
accountDbConnection.on("error", (err) => {
  console.error(
    "=> Fail, error connecting to User Account database:",
    err.message
  );
});

// Error handling for the post database connection
appDbConnection.on("error", (err) => {
  console.error("=> Fail, error connecting to App database:", err.message);
});

module.exports = { accountDbConnection, appDbConnection };

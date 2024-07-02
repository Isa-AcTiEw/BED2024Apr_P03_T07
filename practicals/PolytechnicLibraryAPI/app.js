const express = require('express');
const mssql = require('mssql');

const app = express();
const port = process.env.PORT || 2000; // Use process.env.PORT for dynamic port or default to 2000

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});



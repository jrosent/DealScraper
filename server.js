//Import Environment Variables
require('dotenv').config();

//Node modules
const https = require('https');
const path = require('path');
const fs = require('fs');

//Installed modules
const axios = require('axios');
const cheerio = require('cheerio');
const express = require('express');

//Run Express application
const app = express();

//Assign environment variableshj
const ROOT_DIR = process.env.ROOT_DIR;
const PORT = process.env.PORT;
const KEY = process.env.KEY_LOC;
const CERT = process.env.CERT_LOC;

https.createServer({
    key: fs.readFileSync(path.join(__dirname, KEY)),
    cert: fs.readFileSync(path.join(__dirname,CERT))
},app)
.listen(PORT, () => console.log("Listening on port: " + PORT));

//Main Page
app.get("/",(req,res) => {
    res.sendFile(ROOT_DIR + 'index.html', { root : __dirname});
});
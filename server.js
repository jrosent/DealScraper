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

//Assign environment variables
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

app.get("/scrape.js",(req,res) => {
    res.contentType("text/javascript");
    res.sendFile('scrape.js',{root:__dirname});
})

app.get("/scrapeDeals", async (req,res) => {
    const title = await scrapeDeals();
    //console.log("App.get:" + title);
    res.send(title);
})

async function scrapeDeals(){
    const URL = process.env.NE;

    const htmlData = await axios(URL);
    const body = htmlData.data;
    let $ = cheerio.load(body);

    let title = $(process.env.NE_LOGO).text();
    //console.log("ScrapeNE: " + title);
    return title;
}
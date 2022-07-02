//Import Environment Variables
require('dotenv').config();

//Node modules
const https = require('https');
const path = require('path');
const fs = require('fs');
const url = require('url');

//Installed modules
const axios = require('axios');
const cheerio = require('cheerio');
const express = require('express');
const { title } = require('process');

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
    console.log(req.query.searchText);
    const title = await scrapeDeals(req.query.searchText);
    //console.log("App.get:" + title);
    res.send(title);
})

async function scrapeDeals(searchText){
    const URL = process.env.NE;

    const htmlData = await axios(URL);
    const body = htmlData.data;
    let $ = cheerio.load(body);
    let deals = [];
        
    $(process.env.NE_CELL).each((_,e)=>{
        let title = $(e).find(process.env.NE_TITLE).text();
        if(title.toLowerCase().includes(searchText.toLowerCase())){
            let img = $(e).find(process.env.NE_IMG).find('img').attr('src');
            let link = $(e).find(process.env.NE_TITLE).attr('href');
            deals.push({'img':img, 'title':title, 'link':link});
        }
    });
  
    let jsonObj = {deals};
    return jsonObj;
}
//Import Environment Variables
require('dotenv').config();

//Node modules
const http = require('http');
const path = require('path');
const fs = require('fs');
const url = require('url');

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

http.createServer(app)
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

    const title = await scrapeDeals(req.query.searchText);
    res.header("Access-Control-Allow-Origin","*");
    res.send(title);

})

async function scrapeDeals(searchText){
    const URL = process.env.NE;

    const htmlData = await axios(URL);
    const body = htmlData.data;
    let $ = cheerio.load(body);
    let deals = [];
    let i = 0;
        
    $(process.env.NE_CELL).each((_,e)=>{
        let title = $(e).find(process.env.NE_TITLE).text();
        if(title.toLowerCase().includes(searchText.toLowerCase()) || title === ''){
            let img = $(e).find(process.env.NE_IMG).find('img').attr('src');
            let link = $(e).find(process.env.NE_TITLE).attr('href');
            let price = $(e).find(process.env.NE_PRICE).text();
            deals.push({'img':img, 'title':title, 'link':link, 'price':price});
        }
    });
  
    let jsonObj = {deals};
    return jsonObj;
}
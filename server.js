//Import Environment Variables
import "dotenv/config.js";

//Node modules
import * as http from "http";
import * as path from "path";
import * as fs from "fs";
import * as url from "url";

//Installed modules
import axios from "axios";
import cheerio from "cheerio";
import express, { json } from "express";
import puppeteer from "puppeteer";

//Run Express application
const app = express();

//Assign environment variables
const ROOT_DIR = process.env.ROOT_DIR;
const PORT = process.env.PORT;
const __filename = url.fileURLToPath(import.meta.url);
const __dirname = url.fileURLToPath(new URL('.',import.meta.url));

//Read in data to be used in searches
//scrapeToFile();

http.createServer(app)
.listen(PORT, () => console.log("Listening on port: " + PORT));

//Main Page
app.get("/",(req,res) => {
    res.sendFile(ROOT_DIR + 'index.html', { root : __dirname});
});

app.get("/client.js",(req,res) => {
    res.contentType("text/javascript");
    res.sendFile('client.js',{root:__dirname});
})


app.get("/scrapeDeals", async (req,res) => {
    //await filterBySearch(req.query.searchText);
    const searchText = req.query.searchText;
    fs.readFile("./neScrapeData.json",'utf8', (err, data)=>{
        if(err){
            console.log(err);
        }
        else{
            const resp = {'deals':[]};
            const jsonObj = JSON.parse(data);
            jsonObj.deals.forEach((element)=>{
                if (element.title.toLowerCase().includes(searchText.toLowerCase()) 
                || element.title === ''){
                    resp.deals.push(element);
                };
            });
            res.header("Access-Control-Allow-Origin","*");
            res.send(resp);
            res.end();
        };
    });
    //console.log(JSON.stringify(response));
    //res.header("Access-Control-Allow-Origin","*");
    //res.end();
})


//Scrapes static html from given url
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

//Scrape website for deal items using puppeteer to load scripts
async function filterBySearch(searchText) {
    fs.readFile("./neScrapeData.json",'utf8', (err, data)=>{
        if(err){
            console.log(err);
        }
        else{
            const resp = {'deals':[]};
            const jsonObj = JSON.parse(data);
            jsonObj.deals.forEach((element)=>{
                if (element.title.toLowerCase().includes(searchText.toLowerCase()) 
                || element.title === ''){
                    resp.deals.push(element);
                };
            });
            res.header("Access-Control-Allow-Origin","*");
            res.send(resp);
        };
    });
};

async function scrapeToFile() {
    const chromeOptions = {
        headless:false,
        defaultViewPort: null
    };

    const browser = await puppeteer.launch(chromeOptions);

    const page = await browser.newPage()
    await page.goto(process.env.NE)

    const htmlData = await page.evaluate(() => {
        return {
            data: document.documentElement.innerHTML,
        }
    })

    const body = htmlData.data
    let $ = cheerio.load(body)
    let deals = []

    $('#shopAllDealsItemsWithPaging')
        .find(process.env.NE_CELL)
        .each((_, e) => {
            let title = $(e).find(process.env.NE_TITLE).text();
            let img = $(e).find(process.env.NE_IMG).find('img').attr('src');
            let link = $(e).find(process.env.NE_TITLE).attr('href');
            let price = $(e).find(process.env.NE_PRICE).text();
            deals.push({ img: img, title: title, link: link, price: price });
        });

    let jsonObj = {deals};
    await browser.close();

    fs.writeFile("./neScrapeData.json", JSON.stringify(jsonObj),(err)=>{
        if(err){
            console.log(err);
        }
        else{
            console.log("File written successfully");
        };
    });
}
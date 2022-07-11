//Import Environment Variables
import "dotenv/config.js";

//Node modules
import * as http from "http";
import * as url from "url";
import * as fs from "fs";

//Installed modules
import express, { json } from "express";
import {scrapeToFile,filterBySearch} from "./Scrape/scLogic.js"

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
    const response = await filterBySearch(req.query.searchText,res);
    //console.log(JSON.stringify(response));
    //res.header("Access-Control-Allow-Origin","*");
    //res.end();
})

//Scrape website for deal items using puppeteer to load scripts
async function filterBySearch(searchText,res) {
    let response = [];
    fs.readFile("./Scrape/neScrapeData.json",'utf8', (err, data)=>{
        if(err){
            return;
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
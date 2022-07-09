//Import Environment Variables
import "dotenv/config.js";

//Node modules
import * as http from "http";
import * as url from "url";

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
    await filterBySearch(req.query.searchText,res);
    //console.log(JSON.stringify(response));
    //res.header("Access-Control-Allow-Origin","*");
    //res.end();
})
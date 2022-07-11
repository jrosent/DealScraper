import * as fs from "fs";

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
async function filterBySearch(searchText,res) {
    
    ()=>{   
        const resp = {'deals':[]};
        fs.readFile("./neScrapeData.json",'utf8', (err, data)=>{
            
            if(err){
                return;
            }
            else{
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
        })
    }
    
};

//Reads from browser and writes information to json file
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

export {filterBySearch as filterBySearch, scrapeToFile as scrapeToFile};
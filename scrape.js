

async function tester(){
    //let msg = document.createElement('p');
    const response = await fetch('https://localhost:3000/scrapeDeals');
    const title = await response.json();
    const deals = title.deals;

    deals.forEach(element => {
        let d = document.createElement('p');
        d.innerHTML = element;
        document.body.appendChild(d);
    });
    
    //msg.innerHTML = title;
    //document.body.appendChild(msg);
    //console.log("Tester: " + title);
}
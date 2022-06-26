

async function tester(){
    let msg = document.createElement('p');
    const response = await fetch('https://localhost:3000/scrapeDeals');
    const title = await response.text();
    msg.innerHTML = title;
    document.body.appendChild(msg);
    //console.log("Tester: " + title);
}
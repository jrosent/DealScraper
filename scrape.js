

async function tester(){
    //let msg = document.createElement('p');
    const response = await fetch('https://localhost:3000/scrapeDeals');
    const title = await response.json();
    const deals = title.deals;

    deals.forEach(element => {
        let div = document.createElement('div');
        div.id = 'deal';
        let d = document.createElement('a');
        d.innerHTML = element.title;
        d.href = element.link;
        div.appendChild(d);
        document.body.appendChild(div);
    });
}

async function tester(){
    //let msg = document.createElement('p');
    let search = document.getElementById('searchText').value;
    let endpoint = new URL('https://localhost:3000/scrapeDeals');
    endpoint.searchParams.set('searchText',search);
    const response = await fetch(endpoint);
    const title = await response.json();
    const deals = title.deals;

    deals.forEach(element => {
        let div = document.createElement('div');
        div.id = 'deal';

        let imgA = document.createElement('a');
        imgA.href = element.link;

        let img = document.createElement('img');
        img.src = element.img;

        let d = document.createElement('a');
        d.innerHTML = element.title;
        d.href = element.link;

        imgA.appendChild(img);
        div.appendChild(imgA);
        div.appendChild(d);
        document.body.appendChild(div);
    });
}
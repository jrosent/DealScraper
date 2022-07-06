async function tester(){
    //Get domain and origin path and set url for search
    let url = document.location.origin;
    let search = document.getElementById('searchText').value;
    let endpoint = new URL(url + '/scrapeDeals');
    endpoint.searchParams.set('searchText',search);

    //Fetch data from server and process json
    const response = await fetch(endpoint, {});
    const title = await response.json();
    const deals = title.deals;
    
    //Clear the root div to make room for results of new search
    const root = document.getElementById('root');
    root.innerHTML = '';

    //Check if any results were returned
    if(deals.length <= 0){
        root.innerHTML = "NO RESULTS FOUND FOR '" + search + "'";
    }
    else{
        //Make a new div for each object in the response json
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

            let price = document.createElement('p');
            price.textContent = element.price;

            imgA.appendChild(img);
            div.appendChild(imgA);
            div.appendChild(d);
            div.appendChild(price);
            root.appendChild(div);
        });
    }
}
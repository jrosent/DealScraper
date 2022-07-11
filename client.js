async function tester(){
    //Get domain and origin path and set url for search
    let url = document.location.origin;
    let search = document.getElementById('searchText').value;
    let endpoint = new URL(url + '/scrapeDeals');
    endpoint.searchParams.set('searchText',search);

    //Fetch data from server and process json
    const response = await fetch(endpoint);
    const title = await response.json();
    const deals = title.deals;
    console.log(deals);
    
    //Clear the root div to make room for results of new search
    const root = document.getElementById('root');
    root.innerHTML = '';

    //Check if any results were returned
    if(deals.length <= 0){
        root.innerHTML = "NO RESULTS FOUND FOR '" + search + "'";
    }
    else{
        let i = 1;
        //Make a new div for each object in the response json
        deals.forEach(element => {
            let div = document.createElement('div');
            div.class = 'deal';
            div.id = 'deal' + i;

            let imgDiv = document.createElement('div');
            imgDiv.class = 'imgDiv';

            let imgA = document.createElement('a');
            imgA.href = element.link;

            let img = document.createElement('img');
            img.src = element.img;

            let infoDiv = document.createElement('div');
            infoDiv.class = 'infoDiv';

            let title = document.createElement('a');
            title.innerHTML = element.title;
            title.href = element.link;

            let price = document.createElement('p');
            price.textContent = element.price;

            imgDiv.append(img,imgA);
            infoDiv.append(title, price);
            div.append(imgDiv,infoDiv);
            root.appendChild(div);

            i++;
        });
    }
}
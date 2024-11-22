import {config, API_URL} from './config.js';

async function getWine(){
    // Extract the wineId from the URL query parameters
    const urlParams = new URLSearchParams(globalThis.window.location.search);
    const wineId = urlParams.get('id'); // '123' in this case

    if (wineId) {
        try {
            const response = await fetch(`${config.endpoint}${API_URL}/wine?id=${wineId}`)
            const data = await response.json();
            displayData(data);
        } catch(error) {
            console.error('Error fetching data:', error);
        }
    } else {
        console.error("No wineId provided in the URL");
    }
}

function displayData(data) {
    // Select elements in the DOM where data will be displayed
    const wineName = document.querySelector('.wine-title');
    const grapesList = document.querySelector('.grapes-list');
    const wineTypesList = document.querySelector('.types-list');
    const winery = document.querySelector('.winery-value');
    const wineRegion = document.querySelector('.region-value');
    const wineCountry = document.querySelector('.country-value');
    const wineAlcoholContent = document.querySelector('.alcohol-value');
    const winePrice = document.querySelector('.price-value');
    const wineVolume = document.querySelector('.volume-value');
    const stockCount = document.querySelector('.count-value'); // Ensure this exists in the HTML

    // Populate the elements with data
    if (wineName) wineName.textContent = data.name;
    if (wineRegion) wineRegion.textContent = ` ${data.region}`;
    if (wineCountry) wineCountry.textContent = ` ${data.country}`;
    if (wineAlcoholContent) wineAlcoholContent.textContent = ` ${data.abv}%`;
    if (winePrice) winePrice.textContent = ` $${data.price}`;
    if (wineVolume) wineVolume.textContent = ` ${data.volume.toFixed(2)}L`;
    if (stockCount) stockCount.textContent = ` ${data.count}`;

    // Populate wine grapes (assuming it's an array)
    if (grapesList && Array.isArray(data.grapes)) {
        grapesList.innerHTML = ''; // Clear existing grapes
        data.grapes.forEach((grape) => {
            const listItem = document.createElement('li');
            listItem.textContent = grape;
            grapesList.appendChild(listItem);
        });
    }

    // Populate wine types (assuming it's an array)
    if (wineTypesList && Array.isArray(data.types)) {
        wineTypesList.innerHTML = ''; // Clear existing types
        data.types.forEach((type) => {
            const listItem = document.createElement('li');
            listItem.textContent = type;
            wineTypesList.appendChild(listItem);
        });
    }

    if (data.winery_uuid) {
        const wineryLink = document.createElement('a');
        wineryLink.href = `/winery.html?id=${data.winery_uuid}`;
        wineryLink.textContent = data.winery || 'N/A';
        wineryLink.classList.add('winery-link');
        winery.innerHTML = '';
        winery.appendChild(wineryLink);
    }
}

await getWine();
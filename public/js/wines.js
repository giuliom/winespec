import Alpine from 'https://esm.sh/alpinejs@3.14.8';
import { config, API_URL } from './config.js';

async function getContent() {
  try {
      const response = await fetch(`${config.endpoint}${API_URL}/wines`);
      const data = await response.json();
      displayData(data);
    } catch(error) {
      console.error('Error fetching data:', error);
    }
}

// Function to display the wine data in the HTML
function displayData(data) {
  const container = document.getElementById('wine-grid'); // Ensure this div exists in your HTML

  data.forEach(wine => {
    // Create a new div for each wine item
    const wineDiv = document.createElement('div');
    wineDiv.classList.add('wine-box');

    console.log(wine.grapes);
  
    // Populate the div with wine details
    wineDiv.innerHTML = `
      <winecard-component
        name="${wine.name}"
        year="${wine.year}"
        grapes="${wine.grapes}"
        abv="${wine.abv}"
        types="${wine.types}"
        winery="${wine.winery}"
        region="${wine.region}"
        country="${wine.country}"
        price="${wine.price.toFixed(2)}"
        volume="${wine.volume}"
        count="${wine.count}"
      ></winecard-component>`;

    // Create an anchor tag and wrap the wineDiv
    const link = document.createElement('a');
    link.href = `/wine.html?id=${wine.uuid}`;
    link.classList.add('wine-card-link'); // Add a class for custom styling
    link.appendChild(wineDiv);

    // Append the link (with wineDiv inside) to the container
    container.appendChild(link);
});
}

// Alpine startup
globalThis.window.Alpine = Alpine
Alpine.start()
  
  // Call the function when the page loads
await getContent();
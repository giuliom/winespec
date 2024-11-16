import {config, API_URL} from './config.js';

function getContent() {
    fetch(`${config.endpoint}${API_URL}/content`)
    .then(response => response.json())
  .then(data => {
    // Call a function to display the data
    displayData(data);
  })
  .catch(error => {
    console.error('Error fetching data:', error);
  });
}

// Function to display the wine data in the HTML
function displayData(data) {
  const container = document.getElementById('wine-grid'); // Ensure this div exists in your HTML

  data.forEach(wine => {
    // Create a new div for each wine item
    const wineDiv = document.createElement('div');
    wineDiv.classList.add('wine-box');

    // Generate the types HTML
    const typesHTML = wine.types
        .map(type => `<span class="wine-type">${type}</span>`)
        .join(', ');

    // Populate the div with wine details
    wineDiv.innerHTML = `
    <div class="wine-card">
        <div class="wine-image">
            <i class="fas fa-wine-bottle wine-icon"></i>
        </div>
        <div class="wine-details">
            <h2 class="wine-title">${wine.name} <span class="wine-year">(${wine.year})</span></h2>
            <ul>
                <li><i class="fas fa-wine-glass-alt"></i><span><strong>Grape:</strong> ${wine.grape}</span></li>
                <li><i class="fas fa-percentage"></i><span><strong>Alcohol Content:</strong> ${wine.alcohol_content}%</span></li>
                <li><i class="fas fa-tint"></i><span><strong>Type:</strong> ${typesHTML}</span></li>
                <li><i class="fas fa-industry"></i><span><strong>Winery:</strong> ${wine.winery}</span></li>
                <li><i class="fas fa-map-marker-alt"></i><span><strong>Region:</strong> ${wine.region}, ${wine.country}</span></li>
                <li><i class="fas fa-dollar-sign"></i><span><strong>Price:</strong> $${wine.price.toFixed(2)}</span></li>
                <li><i class="fas fa-wine-glass"></i><span><strong>Volume:</strong> ${wine.volume}L</span></li>
                <li><i class="fas fa-boxes"></i><span><strong>Count:</strong> ${wine.count}</span></li>
            </ul>
        </div>
    </div>
    `;

    // Append the wine div to the container
    container.appendChild(wineDiv);
});
}
  
  // Call the function when the page loads
getContent();
import {config, API_URL} from './config.js';

document.addEventListener('DOMContentLoaded', async () => {
    // Get winery ID from URL parameters
    const urlParams = new URLSearchParams(globalThis.window.location.search);
    const wineryId = urlParams.get('id');

    if (!wineryId) {
        showError('No winery ID provided');
        return;
    }

    try {
        // Fetch winery data
        const response = await fetch(`${config.endpoint}${API_URL}/winery?id=${wineryId}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const winery = await response.json();
        
        // Update DOM elements
        document.getElementById('wineryName').textContent = winery.name;
        document.getElementById('wineryRegion').textContent = winery.region;
        document.getElementById('wineryCountry').textContent = winery.country;

    } catch (error) {
        showError(`Failed to load winery details: ${error.message}`);
    }
});

function showError(message) {
    const container = document.querySelector('.winery-details');
    container.innerHTML = `
        <div class="alert alert-danger" role="alert">
            <i class="fas fa-exclamation-circle me-2"></i>${message}
        </div>
    `;
}
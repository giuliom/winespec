import {config, API_URL} from '../js/config.js';

let form;

document.addEventListener('DOMContentLoaded', () => {
    form = document.getElementById('addWineForm');

    form.addEventListener('submit', submitWine);

    // Optional: Add reset button handler
    const resetButton = document.createElement('button');
    resetButton.type = 'reset';
    resetButton.className = 'btn btn-secondary mt-2';
    resetButton.innerHTML = '<i class="fas fa-undo"></i> Reset Form';
    form.appendChild(resetButton);
});

async function submitWine(e) {
    e.preventDefault();
    console.log("submitWine()");
        
    try {
        // Collect form data
        const formData = new FormData(form);
        const wine = {
            name: formData.get('name'),
            year: parseInt(formData.get('year')),
            grapes: Array.from(formData.getAll('grapes')),
            abv: parseFloat(formData.get('abv')),
            types: Array.from(formData.getAll('types')),
            winery: formData.get('winery'),
            region: formData.get('region'),
            country: formData.get('country'),
            price: parseFloat(formData.get('price')),
            volume: parseFloat(formData.get('volume')),
        };

        // Send POST request
        const response = await fetch(`${config.endpoint}${API_URL}/wine/add`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(wine)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Show success message
        alert('Wine added successfully!');
        const json = await response.json();
        const wineId = json.uuid;
        
        // Redirect to wine list
        globalThis.window.location.href = `${config.endpoint}/wine.html?id=${wineId}`;

    } catch (error) {
        console.error('Error adding wine:', error);
        alert('Failed to add wine. Please try again.');
    }
}
import {config, API_URL} from '../js/config.js';

let form;
let types = [];

document.addEventListener('DOMContentLoaded', () => {
    getTypes();
    form = document.getElementById('addWineForm');

    form.addEventListener('submit', submitWine);

    document.querySelector('.search-input').addEventListener('input', function(e) {
        const searchTerm = e.target.value.toLowerCase();
        const checkboxes = document.querySelectorAll('.form-check');
        
        checkboxes.forEach(checkbox => {
            const label = checkbox.querySelector('label').textContent.toLowerCase();
            checkbox.style.display = label.includes(searchTerm) ? '' : 'none';
        });
    });

    // Optional: Add reset button handler
    const resetButton = document.createElement('button');
    resetButton.type = 'reset';
    resetButton.className = 'btn btn-secondary mt-2';
    resetButton.innerHTML = '<i class="fas fa-undo"></i> Reset Form';
    form.appendChild(resetButton);
});

async function getTypes() {
   const response = await fetch(`${config.endpoint}${API_URL}/wine/types`)
   
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    try {
        const json = await response.json();
        types = json;

        const typeSelect = document.getElementById('types');
        
        // Clear existing options
        typeSelect.innerHTML = '';
        
        // Add new options from backend
        types.forEach(type => {
            const option = document.createElement('form-check');
            option.innerHTML = `<input class="form-check-input" type="checkbox" name="types[]" value="${type.type}" id="type${type.type}">
                                        <label class="form-check-label" for="typeRed">${type.type}</label>`;
            typeSelect.appendChild(option);
        });

    } catch (error) {
        console.error('Error fetching types:', error);
    }
}

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
            winery_name: formData.get('winery'),
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
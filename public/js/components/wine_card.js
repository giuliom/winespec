class WineCard extends HTMLElement {
    constructor() {
      super();
    }
  
    connectedCallback() {
        const name = this.getAttribute('name');
        const year = this.getAttribute('year');
        const abv = this.getAttribute('abv');
        const winery = this.getAttribute('winery');
        const region = this.getAttribute('region');
        const country = this.getAttribute('country');
        const price = this.getAttribute('price');
        const volume = this.getAttribute('volume');
        const count = this.getAttribute('count');

        // Generate the grapes HTML
        const grapes = this.getAttribute('grapes').split(',');
        const grapesHTML =  grapes
        .map(type => `<span class="wine-type">${type}</span>`).join(', ');

        // Generate the types HTML
        const types = this.getAttribute('types').split(',');
        const typesHTML = types
        .map(type => `<span class="wine-type">${type}</span>`).join(', ');

        this.innerHTML = `
        <div class="wine-card">
            <div class="wine-image">
                <i class="fas fa-wine-bottle wine-icon"></i>
            </div>
            <div class="wine-details">
                <h2 class="wine-title">${name} <span class="wine-year">(${year})</span></h2>
                <ul>
                    <li><i class="fas fa-wine-glass-alt"></i><span><strong>Grape:</strong> ${grapesHTML}</span></li>
                    <li><i class="fas fa-percentage"></i><span><strong>Alcohol Content:</strong> ${abv}%</span></li>
                    <li><i class="fas fa-tint"></i><span><strong>Type:</strong> ${typesHTML}</span></li>
                    <li><i class="fas fa-industry"></i><span><strong>Winery:</strong> ${winery}</span></li>
                    <li><i class="fas fa-map-marker-alt"></i><span><strong>Region:</strong> ${region}</span></li>
                    <li><i class="fas fa-globe"></i><span><strong>Country:</strong> ${country}</span></li>
                    <li><i class="fas fa-dollar-sign"></i><span><strong>Price:</strong> $${price}</span></li>
                    <li><i class="fas fa-wine-glass"></i><span><strong>Volume:</strong> ${volume}L</span></li>
                    <li><i class="fas fa-boxes"></i><span><strong>Count:</strong> ${count}</span></li>
                </ul>
            </div>
        </div>
        `;
    }
  }
  
  customElements.define('winecard-component', WineCard);
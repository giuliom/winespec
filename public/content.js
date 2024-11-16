function getContent() {
    fetch('http://localhost:8000/api/content')
    .then(response => response.json())
    .then(wines => {
      const wineGrid = document.getElementById('wine-grid');
      wineGrid.innerHTML = ''; // Clear any existing content
      wines.forEach(wine => {
        const wineBox = document.createElement('div');
        wineBox.className = 'wine-box';

        const icon = document.createElement('i');
        icon.className = 'fas fa-wine-bottle wine-icon';

        const wineName = document.createElement('h2');
        wineName.textContent = wine.name;

        const wineInfo = document.createElement('p');
        wineInfo.textContent = `${wine.year} - ${wine.region}`;

        wineBox.appendChild(icon);
        wineBox.appendChild(wineName);
        wineBox.appendChild(wineInfo);

        wineGrid.appendChild(wineBox);
      });
    })
    .catch(error => console.error('Error fetching wines:', error));
  }
  
  // Call the function when the page loads
getContent();
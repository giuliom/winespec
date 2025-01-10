class Footer extends HTMLElement {
    constructor() {
      super();
    }
  
    connectedCallback() {
      this.innerHTML = `
        <footer class="footer">
            <p>&copy; 2024 WineSpec. All rights reserved.</p>
        </footer>
      `;
    }
  }
  
  customElements.define('footer-component', Footer);
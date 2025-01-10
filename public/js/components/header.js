class Header extends HTMLElement {
    constructor() {
      super();
    }
  
    connectedCallback() {
      this.innerHTML = `
        <header class="header">
            <div class="logo">
                <i class="fas fa-wine-bottle"></i>
                <span>WineSpec</span>
            </div>
            <nav class="main-nav">
                <a href="index.html" class="nav-link"><i class="fas fa-home"></i> Home</a>
                <a href="wines.html" class="nav-link"><i class="fas fa-wine-glass-alt"></i> Wines</a>
                <a href="collections.html" class="nav-link"><i class="fas fa-list"></i> Collections</a>
                <button class="btn btn-outline"><i class="fas fa-sign-in-alt"></i> Sign In</button>
                <button class="btn btn-primary"><i class="fas fa-user-plus"></i> Register</button>
            </nav>
        </header>
      `;
    }
  }
  
  customElements.define('header-component', Header);
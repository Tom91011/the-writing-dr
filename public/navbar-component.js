export default function navbarComponent() {
  class Navbar extends HTMLElement {
    constructor() {
      super()
    }
    connectedCallback() {
      this.innerHTML = `
        <div class="header-main">
          <nav class="navigation">
            <a href="./">HOME</a>
            <a href="./about">ABOUT</a>
            <a href="./services">SERVICES</a>
            <a href="./blogs">BLOG</a>
            <a href="./contact">CONTACT</a>
          </nav>
        </div>


      `
    }
  }
  customElements.define("navbar-component", Navbar)
}

navbarComponent()

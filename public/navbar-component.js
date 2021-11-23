export default function navbarComponent() {
  class Navbar extends HTMLElement {
    constructor() {
      super()
    }
    connectedCallback() {
      this.innerHTML = `
        <div class="header-main">
          <nav class="navigation">
            <a href="./test">HOME</a>
            <a href="./about">ABOUT</a>
            <a href="./services.html">SERVICES</a>
            <a href="./blogs.html">BLOG</a>
            <a href="./contact.html">CONTACT</a>
          </nav>
        </div>


      `
    }
  }
  customElements.define("navbar-component", Navbar)
}

navbarComponent()

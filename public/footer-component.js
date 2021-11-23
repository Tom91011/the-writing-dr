export default function footerComponent() {
  class Footer extends HTMLElement {
    constructor() {
      super()
    }
    connectedCallback() {
      this.innerHTML = `
      <div class="footer-container">
        <h3 class="footer-social">Reach out on social media</h3>
        <div class="social-icons">
          <i class="fab fa-twitter"></i>
          <i class="fab fa-instagram-square"></i>
          <i class="fab fa-linkedin-in"></i>
        </div>
        <h4 class="footer-policy" href="#">Web Privacy Policy</h4>
        <br>
        <h4 class="footer-policy" href="#">Web Cookie Policy</h4>
        <h3>© 2021 The Writing Doctor, Inc. | All Rights Reserved | <span class="creative-credits highlight-yellow">Creative Credits</span> | <span class="to-top highlight-yellow">  <a href="#top">Back to top</a> </span></h3>
      </div>
      `
    }
  }
  customElements.define("footer-component", Footer)
}

footerComponent()

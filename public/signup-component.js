export default function signupComponent() {
  class Signup extends HTMLElement {
    constructor() {
      super()
    }
    connectedCallback()   {
      this.innerHTML = `
      <div class="signup-component">
        <div class="signup-inner">
          <p>SIGN UP FOR YOUR WEEKLY DOSE</p>
          <p class="tips">Writing tips, SEO masterclass, content creation advice and more</p>
          <div class="button">
            <p>sign me up</p>
          </div>
        </div>
      </div>
      `
    }
  }
  customElements.define("signup-component", Signup)
}

signupComponent()

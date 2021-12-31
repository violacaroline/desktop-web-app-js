/**
 * The desktop web component module.
 */

// Define template.
const template = document.createElement('template')
template.innerHTML = `
<style>
    body {
      height: 100vh;      
    }

    #desktop-template {
      border: 4px solid #433E49;
      background-color: #F3E8EB;
      text-align: center;
      font-size: 50px;
      height: 100vh;
      padding: 20px;
      margin: 20px;
    }

    h1 {
      font-family: "Times New Roman", Times, serif
      font-weight: bold;
      font-size: 150%;
    }

    #icon-dock {
      background-color: #DBC1AD;
      border-radius: 30px;
      margin: auto;
      height: 20%;
      width: 60%;
    }

    .hidden {
      display: none;
    }
</style>
<div id="desktop-template">
    <h1>My Desktop</h1>
    <p>Poop</p>
    <div id="icon-dock"></div>
  </div>
`

customElements.define('my-desktop',
  /**
   * Represents the desktop element.
   *
   */
  class extends HTMLElement {
    /**
     * The desktop template. // TA EVENTUELLT BORT DENNA?
     *
     * @type {HTMLDivElement}
     */
    #desktopTemplate

    /**
     * The icon dock.
     *
     * @type {HTMLDivElement}
     */
    #iconDock

    /**
     * Creates an instance of the desktop element.
     */
    constructor () {
      super()

      // Attach shadow and append template.
      this.attachShadow({ mode: 'open' }).appendChild(template.content.cloneNode(true))

      // Get elements in shadowroot.
      this.#desktopTemplate = this.shadowRoot.querySelector('#desktop-template') // TA EVENTUELLT BORT DENNA?
      this.#iconDock = this.shadowRoot.querySelector('#icon-dock')
    }
  }
)

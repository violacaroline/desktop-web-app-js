/**
 * The my-window web component module.
 */

// Define template
const template = document.createElement('template')
template.innerHTML = `
<style>
  #container-window {
   justify-content: center;
   background-color: #F3E8EB;
   position: relative;
   padding: 5px;
   height: 600px;
   width: 600px;
   margin: auto;
   border: solid 1px #433E49;
  }

  #top-bar {
    position: relative;
    border: solid 1px #433E49;
    height: 30px;
    margin: 5px;
  }

  #close-btn {
    position: absolute;
    background-color: #F3E8EB;
    font-family: "Times New Roman", Times, serif;
    top: 3px;
    right: 2px;
    margin: 2px;
    border: solid 1px;
  }

  button:hover {
    box-shadow: 0px 0 5px #433E35;
  }
</style>
<div id="container-window">
  <div id="top-bar">
  <button id="close-btn"> X </button>
</div>
</div>
`
// Define custom element.
customElements.define('my-window',
/**
 * Represents a window component.
 */
  class extends HTMLElement {
  /**
   * Close window.
   *
   * @type {HTMLButtonElement} - Close the window button.
   */
   #closeButton

   /**
    * Creates an instance of the current type.
    */
   constructor () {
     super()

     // Attach shadow DOM and append template.
     this.attachShadow({ mode: 'open' }).appendChild(template.content.cloneNode(true))

     // Get the elements in the shadow root.
     this.#closeButton = this.shadowRoot.querySelector('#close-btn')
   }
  }
)

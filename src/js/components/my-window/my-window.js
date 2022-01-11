/**
 * The my-window web component module.
 */

// Define template
const template = document.createElement('template')
template.innerHTML = `
<style>
  :host {
    position: absolute;
    top: 70px;
    left: 100px;
    height: 500px;
    width: 500px;
  }

  #container-window {
   justify-content: center;
   background-color: #F3E8EB;
   text-align: center;
   padding: 5px;
   margin: auto;
   overflow: hidden;
   border: solid 1px #433E49;
  }

  #menu-bar {
    position: relative;
    background-color: #e6d1c1;
    border: solid 1px #433E49;
    height: 30px;
    margin: 5px;
  }

  #close-btn {
    position: absolute;
    background-color: #e6d1c1;
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
  <div id="menu-bar">
  <button id="close-btn"> X </button>
  </div>
  <slot name="content"><slot>
</div>
`
// Define custom element.
customElements.define('my-window',
  /**
   * Represents a window component.
   */
  class extends HTMLElement {
    /**
     * The window container.
     *
     * @type {HTMLDivElement}
     */
    #containerWindow

    /**
     * The menu bar.
     *
     * @type {HTMLDivElement}
     */
    #menuBar

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
      this.#containerWindow = this.shadowRoot.querySelector('#container-window')
      this.#menuBar = this.shadowRoot.querySelector('#menu-bar')
      this.#closeButton = this.shadowRoot.querySelector('#close-btn')

      this.x = 0
      this.y = 0
      this.mouseDown = false
    }

    /**
     * Called when element is inserted in DOM.
     */
    connectedCallback () {
      this.#menuBar.addEventListener('mousedown', (event) => {
        this.mouseDownEvent(event)
      }, true)

      this.#containerWindow.addEventListener('mousemove', (event) => {
        this.mouseMoveEvent(event)
      }, true)

      window.addEventListener('mouseup', (event) => {
        this.mouseUp(event)
      }, true)

      this.#closeButton.addEventListener('click', () =>
        this.remove(this.#containerWindow)
      )
    }

    /**
     * Handles mousedown events.
     *
     * @param {event} event - The mousedown event.
     */
    mouseDownEvent (event) {
      this.mouseDown = true
      this.x = this.offsetLeft - event.clientX
      this.y = this.offsetTop - event.clientY
    }

    /**
     * Handles mousemove events.
     *
     * @param {event} event - The mousemove event.
     */
    mouseMoveEvent (event) {
      // Save current viewport
      const rect = this.getBoundingClientRect()

      if (this.mouseDown) {
        // Check viewport edges and return window to start position if outside bounds
        if (rect.top < 0 || rect.left < 0 || rect.x < 0 || rect.y < 0 || rect.bottom > window.innerHeight + 200 || rect.right > window.innerWidth + 200) {
          this.mouseDown = false
          this.style.left = '100px'
          this.style.top = '70px'
        } else {
          this.style.left = event.clientX + this.x + 'px'
          this.style.top = event.clientY + this.y + 'px'
        }
      }
    }

    /**
     * Handles mouseup events.
     *
     * @param {event} event - The mouseup event.
     */
    mouseUp (event) {
      this.mouseDown = false
    }
  }
)

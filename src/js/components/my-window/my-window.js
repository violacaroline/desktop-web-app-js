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
   background-color: #BFD8D2;
   text-align: center;
   padding: 5px;
   margin: auto;
   overflow: hidden;
   border: none;
   border-radius: 5px;
   box-shadow: 0px 0px 3px grey;
  }

  /* #menu-bar {
    position: relative;
    background-color: #e6d1c1;
    border: solid 1px #433E49;
    height: 30px;
    margin: 5px;
  } */

  #close-btn {
    background-color: #BFD8D2;
    border-radius: 2px;
    position: absolute;
    font-family: arial;
    font-weight: 50;
    cursor: pointer;
    top: 3px;
    right: 3px;
    margin: 2px;
    border:none;
  }

  button:hover {
    box-shadow: 0px 0 2px #433E35;
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
      })

      this.#containerWindow.addEventListener('mousemove', (event) => {
        this.mouseMoveEvent(event)
      })

      window.addEventListener('mouseup', (event) => {
        this.mouseUp(event)
      })

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

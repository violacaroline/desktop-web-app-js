/**
 * The my-window web component module.
 */
import '../my-memory/'
import '../my-chat/'

// Define template
const template = document.createElement('template')
template.innerHTML = `
<style>
  :host {
    position: absolute;
    top: 30px;
    left: 30px;
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
      const rect = this.getBoundingClientRect()
      console.log('Rect from window', rect)

      this.#menuBar.addEventListener('mousedown', (event) => {
        this.mouseDownEvent(event)
      }, true)

      this.#containerWindow.addEventListener('mousemove', (event) => {
        this.mouseMoveEvent(event)
      }, true)

      window.addEventListener('mouseup', (event) => {
        this.mouseUp(event)
      }, true)

      // FIX THIS SHIT // EVENTUELLT PÅ BARA THIS //
      this.#containerWindow.addEventListener('focus', (event) => {
        // ETT WINDOW ELEMENT SKAPAS VID TRYCK PÅ EN IKON PÅ FÖRSTA SIDAN (DESKTOP), SPARAS I EN CONST, DÄRFTER APPENDAS/SLOTTAS KORREKT KOMPONENT BEROENDE PÅ VILKEN IKON SOM TRYCKTES (MEMORY, CHAT, ADVICE) - VERKAR SOM ATT JAG REFERERAR TILL FEL ELEMENT NÄR JAG VILL GE FOKUS?
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
      // MUSKNAPP NED SÄTTS TILL TRUE
      this.mouseDown = true
      // SPARA START POSITION AV FÖNSTER
      // FÖNSTRETS VÄNSTRA TOPPHÖRN - HORISONTELL KOORDINAT FÖR KLICKEVENTET
      // FÖNSTRETS TOPP - VERTIKAL KOORDINAT FÖR KLICKEVENTET
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

      if (this.mouseDown) {
        // OM MUSKNAPP HÅLLS NED, SÄTT NY POSITION
        // VART KLICKET HÄNDER + STARTPOSITION // ÄR JAG UTANFÖR VIEWPORT RETURN, THIS.GETBOUNDING
        this.style.left = event.clientX + this.x + 'px'
        this.style.top = event.clientY + this.y + 'px'
      }
    }

    /**
     * Handles mouseup events.
     *
     * @param {event} event - The mouseup event.
     */
    mouseUp (event) {
      // OM MUSKNAPP SLÄPPS SÄTTS MOUSEDOWN TILL FALSE
      this.mouseDown = false
    }
  }
)

/**
 * The flipping tile web component module.
 */

// Define template.
const template = document.createElement('template')
template.innerHTML = `
<style>
    :host {
      display: block;
      height: 80px;
      width: 80px;
      position: relative;
    }

    :host([hidden]) #tile {
      box-shadow: none;
      background-color: #c9719d;
    }

    :host([hidden]) #tile>* {
      visibility: hidden;
    }

    :host([face-up]) #front {
      display: inline-block;
    }

    :host([face-up]) #back {
      display: none;
    }

    #tile {
      display: inline-block;
      height: 100%;
      width: 100%;
      padding: 0;
      border-radius: 5px;
      border: none;
      outline: none;
      background-color: #c9719d;
    }

    #tile:hover {
      cursor: pointer;
    }

    #tile:focus {
      box-shadow: 0px 0 5px #433E49;
    }

    #front, #back {
      width: calc(100% - 4px);
      height: calc(100% - 4px);
      border-radius: 8px;
      margin: 2px;     
    }

    #front {
      background-color: #c9719d;
      display: none;
    }

    #back {
      background-color: #c9719d
      display: inline-block;
    }

    slot {
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    /* Styles slotted images */
    ::slotted(img) {
      max-width: 90%;
      max-height: 90%;
    }


</style>
<button part="entire-tile" id="tile">
    <div part="front-tile" id="front">
        <slot></slot>
    </div>
    <div part="tile-back" id="back"></div>
</button>
`
/**
 * Define custom element.
 */
customElements.define('my-flip-tile',
/**
 * Represents a single tile in a memory game.
 */
  class extends HTMLElement {
    /**
     * The tile element.
     */
    #tile

    /**
     * Creates an instance of the current type.
     */
    constructor () {
      super()

      // Attach shadow DOM and append template.
      this.attachShadow({ mode: 'open' }).appendChild(template.content.cloneNode(true))

      // Get the elements in the shadow root.
      this.#tile = this.shadowRoot.querySelector('#tile')

      // Flip on click
      this.addEventListener('click', (event) => {
        event.stopPropagation()
        this.#flip()
      })
    }

    /**
     * Attributes to monitor.
     *
     * @returns {string[]} - A string array of attributes.
     */
    static get observedAttributes () {
      return ['face-up', 'disabled', 'hidden']
    }

    /**
     * Called when monitored attributes changes.
     *
     * @param {string} name - The attribute's name.
     * @param {*} oldValue - Old value
     * @param {*} newValue - New value.
     */
    attributeChangeCallback (name, oldValue, newValue) {
      // Enable/disable button in shadow DOM
      if ((name === 'disabled' || name === 'hidden') && oldValue !== newValue) {
        // Should disabled attribute be active or not.
        const isActive = Boolean(newValue) || newValue === ''

        if (isActive) {
          this.#tile.setAttribute('disabled', '')
          this.blur()
        } else {
          this.#tile.removeAttribute('disabled')
        }
      }
    }

    /**
     * Check if tiles matches.
     *
     * @param {*} otherTile - The tile to be compared.
     * @returns {boolean} - Returns true if second tile has the same content as first.
     */
    isMatch (otherTile) {
      return this.isEqualNode(otherTile)
    }

    /**
     * Flips tile, if not disabled.
     */
    #flip () {
      if (this.hasAttribute('disabled') || this.hasAttribute('hidden')) {
        return
      }

      // Set or remove face-up attribute.
      this.hasAttribute('face-up')
        ? this.removeAttribute('face-up')
        : this.setAttribute('face-up', '')

      // Dispatch flip event.
      this.dispatchEvent(new CustomEvent('flip', {
        bubbles: true,
        detail: { faceUp: this.hasAttribute('face-up') }
      }))
    }
  }
)

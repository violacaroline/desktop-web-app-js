/**
 * The flipping tile web component module.
 */

// Define template.
const template = document.createElement('template')
template.innerHTML = `
<style>
    :host {
        display: block;
        height: 100px;
        width: 100px;
    }

    :host([face-up]) #front {
        display: inline-block;
    }

    :host([face-up]) #back {
        display: none;
    }

    /* MAYBE A WEIRD HOST HIDDEN STYLE HERE */

    :host([hidden]) #tile>* {
        visibility: hidden;
    }

    #tile {
        display: inline-block;
        height: 100%;
        width: 100%;
        padding: 0;
        border: solid 2px #433E49;
        outline: none;
        background-color: #DBC1AD;
    }

    #tile:focus {
        box-shadow: 0px 0 10px #433E49;
    }

    /* MAYBE A WEIRD HOST DISABLED STYLE HERE */
    #front, #back {
        width: calc(100% - 4px);
        height: calc(100% - 4px);
        border-radius: 8px;
        margin:2px;
    }

    #front {
        background-color: #DBC1AD;
        display: none;
    }

    #back {
        background: #DBC1AD no-repeat center/50% url("./images/m.png")
        display: inline-block;
    }

    slot {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    /* Styles any content in the slot element.  */
    slot>* {
        max-width: 80%;
        max-height: 80%;
    }
 
    /* Styles slotted images.  */
    ::slotted(img) {
        max-width: 80%;
        max-height: 80%;
    }


</style>
<button part="entire-tile" id="tile">
    <div part="front-tile" id="front">
        <slot></slot>
    </div>
    <div part="tile-back" id="back"></div>
</button>
`

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

      // Add event listener for 'click'
      this.addEventListener('click', (event) => {
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
        detail: { faceUp: this.hasAttribute('face-up') }
      }))
    }
  }
)

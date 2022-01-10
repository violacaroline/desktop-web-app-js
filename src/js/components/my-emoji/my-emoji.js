/**
 * The my-emoji web component module.
 */

// Define template.
const template = document.createElement('template')
template.innerHTML = `
<style>
    #container-emoji {
        background-color: #fff;
        width: 100px;
        height: 80px;
        border-radius: 5px; 
    }

    #emoji-list {
        background-color: #fff;
        width: 100%;
        height: 100px;
        display: flex;
        flex-wrap: wrap;
        overflow: auto;
        border-radius: 5px;
        padding: 10px;
    }

    .emoji {
        position: relative;
        font-size: 20px;
        width: 32px;
        height: 32px;
        margin: 0 auto;
    }

    .emoji:hover {
        transform: scale(1.3);
    }
  
</style>
<div id="container-emoji">
    <div id="emoji-list">
        <div class="emoji">🙂</div>
        <div class="emoji">😂</div>
        <div class="emoji">😍</div>
        <div class="emoji">😎</div>
        <div class="emoji">☹️</div>
        <div class="emoji">😡</div>
    </div>
</div>
`
/**
 * Define custom element.
 */
customElements.define('my-emoji',
  /**
   * Represents an emoji picker.
   */
  class extends HTMLElement {
    /**
     * The container of emojis.
     *
     * @type {HTMLDivElement}
     */
    #containerEmoji

    /**
     * Creates an instance of the current type.
     */
    constructor () {
      super()

      // Attach shadow DOM and append template.
      this.attachShadow({ mode: 'open' }).appendChild(template.content.cloneNode(true))

      // Get the elements in the shadow root.
      this.#containerEmoji = this.shadowRoot.querySelector('#container-emoji')
    }

    /**
     * Called when element is inserted in DOM.
     */
    connectedCallback () {

    }
  }
)

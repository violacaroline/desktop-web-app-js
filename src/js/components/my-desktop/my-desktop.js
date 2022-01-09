/**
 * The desktop web component module.
 */
import '../my-window/'
import '../my-memory/'
import '../my-chat/'

// Define template.
const template = document.createElement('template')
template.innerHTML = `
<style>
    #desktop-template {
      /* border: 4px solid #433E49; */
      background-color: #F3E8EB;
      text-align: center;
      font-size: 50px;
      height: 100vh;
      padding: 20px;      
    }

    h1 {
      font-family: "Times New Roman", Times, serif
      font-weight: bold;
      font-size: 150%;
    }

    p {
      white-space: nowrap;
    }

    #icon-dock {
      background-color: #DBC1AD;
      white-space: nowrap;
      border-radius: 30px;
      margin: auto;
      padding: 10px;
      height: 20%;
      width: 50%;
      min-width: min-content;
      min-height: 100px;
    }

    button {
      border: 2px solid #433E49;
      border-radius: 50%;
      padding: 10px;
      margin: 10px;
      height: 90px;
      width: 90px;
      box-shadow: 0px 0 5px #433E49;
    }

    button:hover {
      box-shadow: 0px 0 10px #433E49;
    }

    #memory-btn {
      background: url("/js/components/my-desktop/images/memory-icon.png") no-repeat center/70%;
    }

    #chat-btn {
      background: url("/js/components/my-desktop/images/chat-icon.png") no-repeat center/70%;
    }

    #advice-btn {
      background: url("/js/components/my-desktop/images/advice-icon.png") no-repeat center/70%;
    }

    .hidden {
      display: none;
    }
</style>
<div id="desktop-template">
    <h1>My Desktop</h1>
    <p>Memory | Chat | Advice</p>
    <div id="icon-dock">
      <button id="memory-btn"></button><button id="chat-btn"></button><button id="advice-btn"></button>
    </div>
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
     * The memory game button.
     *
     * @type {HTMLButtonElement}
     */
    #memoryBtn

    /**
     * The chat app button.
     *
     * @type {HTMLButtonElement}
     */
    #chatBtn

    /**
     * The advice app button.
     *
     * @type {HTMLButtonElement}
     */
    #adviceBtn

    /**
     * Creates an instance of the desktop element.
     */
    constructor () {
      super()

      // Attach shadow and append template.
      this.attachShadow({ mode: 'open' }).appendChild(template.content.cloneNode(true))

      // Get elements in shadowroot.
      this.#desktopTemplate = this.shadowRoot.querySelector('#desktop-template') // TA EVENTUELLT BORT DENNA?
      this.#iconDock = this.shadowRoot.querySelector('#icon-dock') // TA EVENTUELLT BORT DENNA?
      this.#memoryBtn = this.shadowRoot.querySelector('#memory-btn')
      this.#chatBtn = this.shadowRoot.querySelector('#chat-btn')
      this.#adviceBtn = this.shadowRoot.querySelector('#advice-btn')
    }

    /**
     * Called when element is inserted in DOM.
     */
    connectedCallback () {
      // Handle memory button clicks.
      this.#memoryBtn.addEventListener('click', () => {
        const currentWindow = this.#desktopTemplate.appendChild(document.createElement('my-window'))
        currentWindow.appendChild(document.createElement('my-memory'))
      })

      // Handle chat button clicks.
      this.#chatBtn.addEventListener('click', () => {
        const currentWindow = this.#desktopTemplate.appendChild(document.createElement('my-window'))
        currentWindow.appendChild(document.createElement('my-chat'))
      })

      // Handle advice button clicks.
      this.#adviceBtn.addEventListener('click', () => {
        const currentWindow = this.#desktopTemplate.appendChild(document.createElement('my-window'))
        currentWindow.appendChild(document.createElement('my-advice'))
      })
    }
  }
)

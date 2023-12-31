/**
 * The desktop web component module.
 */

// Define template.
const template = document.createElement('template')
template.innerHTML = `
<style>
    #desktop-template {
      box-sizing: border-box;
      /* background-color: #F3E8EB; */
      background-color: #BFD8D2;
      text-align: center;
      font-size: 50px;
      height: 100vh;
      padding: 20px;
      user-select: none;      
    }

    h1 {
      font-family: Courier New;
      font-weight: 200;
      font-size: 150%;
    }

    p {
      font-family: Courier New;
      font-weight: 100;
      white-space: nowrap;
    }

    #icon-dock {
      white-space: nowrap;
      margin: auto;
      padding: 10px;
      height: 20%;
      width: 50%;
      min-width: min-content;
      min-height: 100px;
    }

    button {
      border: none;
      border-radius: 50%;
      cursor: pointer;
      padding: 10px;
      margin: 10px;
      height: 90px;
      width: 90px;
      box-shadow: 0px 0 5px grey;
    }

    button:hover {
      box-shadow: 0px 0 10px #433E49;
    }

    #memory-btn {
      /* background: url("/js/components/my-desktop/images/memory-icon.png") no-repeat center/70%; */
      background: url("/images/memory-icon.png") no-repeat center/70%;
      background-color: #c9719d;
    }

    #chat-btn {
      background: url("/images/chat-icon.png") no-repeat center/70%;
      background-color: #9dcf93;
    }

    #advice-btn {
      background: url("/images/advice-icon.png") no-repeat center/70%;
      background-color: #F08A4B;
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
     * The desktop template.
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
     * Tracks Z-index.
     *
     * @type {number} - The current z-index.
     */
    #currentZIndex = 0

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
        // Set z-index on click
        currentWindow.addEventListener('click', () => {
          currentWindow.focus()
          currentWindow.style.zIndex = this.#currentZIndex++
        })
      })

      // Handle chat button clicks.
      this.#chatBtn.addEventListener('click', () => {
        const currentWindow = this.#desktopTemplate.appendChild(document.createElement('my-window'))
        currentWindow.appendChild(document.createElement('my-chat'))
        // Set z-index on click
        currentWindow.addEventListener('click', () => {
          currentWindow.focus()
          currentWindow.style.zIndex = this.#currentZIndex++
        })
      })

      // Handle advice button clicks.
      this.#adviceBtn.addEventListener('click', () => {
        const currentWindow = this.#desktopTemplate.appendChild(document.createElement('my-window'))
        currentWindow.appendChild(document.createElement('my-advice'))
        // Set z-index on click
        currentWindow.addEventListener('click', () => {
          currentWindow.focus()
          currentWindow.style.zIndex = this.#currentZIndex++
        })
      })
    }
  }
)

/**
 * The chat web component module.
 */

// Define template.
const template = document.createElement('template')
template.innerHTML = `
<style>
  #container-chat {
    background-color: #DBC1AD;
    display: block;
    font-family: "Times New Roman", Times, serif
    font-weight: bold;
    font-size: 25px;
    padding: 10px;
    text-align: center;
    justify-content: center;
    height: 500px;
    width: 500px;
  }

  h1 {
    margin: 10px;
  }

  p {
    font-size: 20px;
  }

  #text-area {
    font-family: Arial, Helvetica, sans-serif;
    font-size: 15px;
    margin-bottom: 20px;
    padding: 10px; 
    height: 200px;
    width: 250px;
    resize: none;
  }

  input {
    font-size: 15px;
    display: block;
    padding: 10px;
    margin: 0 auto;
  }

  button {
      background-color: #fff;
      font-family: "Times New Roman", Times, serif
      font-weight: bold;
      margin: 20px;
      padding: 5px;
      border-radius: 3px;
      width: 20%;
      border: solid 1px black;
      box-shadow: 0px 0 3px #433E49;
    }

    button:hover {
      box-shadow: 0px 0 10px #433E49;
    }

</style>
<div id="container-chat">
  <h1>Chat</h1>
  <p>Talk to me, baby</p>
  <textarea id="text-area" placeholder="Type your message"></textarea>
  <input id="input-area" placeholder="Type your name">
  <button id="send-btn">Send</button>
</div>
`
/**
 * Define custom element.
 */
customElements.define('my-chat',
  /**
   * Represents achat window.
   */
  class extends HTMLElement {
    /**
     * The text area.
     *
     * @type {HTMLInputElement} - NO TEXTAREA ELEMENT?
     */
    #textArea

    /**
     * The input area.
     *
     * @type {HTMLInputElement}
     */
    #inputArea

    /**
     * The send button.
     *
     * @type {HTMLButtonElement}
     */
    #sendBtn

    /**
     * Creates an instance of the current type.
     */
    constructor () {
      super()

      // Attach shadow COM and append template.
      this.attachShadow({ mode: 'open' }).appendChild(template.content.cloneNode(true))

      // Get the elements in the shadow root.
      this.#textArea = this.shadowRoot.querySelector('#text-area')
      this.#inputArea = this.shadowRoot.querySelector('#input-area')
      this.#sendBtn = this.shadowRoot.querySelector('#send-btn')
    }

    /**
     * Called when element is inserted in DOM.
     */
    connectedCallback () {
      const socket = new window.WebSocket('wss://courselab.lnu.se/message-app/socket')

      socket.addEventListener('open', () => {
        console.log('Yay, open!')
      })

      this.#sendBtn.addEventListener('click', () => {
        console.log('Input', this.#inputArea.value)
        this.showMessage(this.#inputArea.value)
        this.#inputArea.value = ''
      })
    }

    /**
     * Shows message.
     *
     * @param {string} message - The message to display.
     */
    showMessage (message) {
      this.#textArea.textContent += `${message}\n`
      console.log(message)
    }
  }
)

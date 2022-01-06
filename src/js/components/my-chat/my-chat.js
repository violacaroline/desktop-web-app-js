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
    size: min-content;
    /* height: 500px;
    width: 500px; */
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

  #text-area-send {
    font-size: 15px;
    display: block;
    padding: 10px;
    margin: 0 auto;
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

    .hidden {
      display: none;
    }

</style>
<div id="container-chat">
  <h1>Chat</h1>
  <p>Talk to me, baby</p>
  <div id="name-ui">
  <input id="input-area" placeholder="Type your name">
  <button id="send-btn">Send</button>
  </div>
  <div id="message-ui" class="hidden">
  <textarea id="text-area"></textarea>
  <textarea placeholder="Type your message" id="text-area-send"></textarea>
  <button id="send-msg-btn">Send</button>
  </div>
  
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
     * Name UI
     *
     * @type {HTMLDivElement}
     */
    #nameUi

    /**
     * Message UI
     *
     * @type {HTMLDivElement}
     */
    #messageUi

    /**
     * The text area.
     *
     * @type {HTMLInputElement} - NO TEXTAREA ELEMENT?
     */
    #textArea

    /**
     * Text area send.
     *
     * @type {HTMLInputElement} - NO TEXTAREA ELEMENT.
     */
    #textAreaSend

    /**
     * The input area.
     *
     * @type {HTMLInputElement}
     */
    #inputArea

    /**
     * The send name button.
     *
     * @type {HTMLButtonElement}
     */
    #sendBtn

    /**
     * Send message button.
     *
     * @type {HTMLButtonElement}
     */
    #sendMsgBtn

    /**
     * Users name.
     *
     * @type {string}
     */
    #userName

    /**
     * Creates an instance of the current type.
     */
    constructor () {
      super()

      // Attach shadow COM and append template.
      this.attachShadow({ mode: 'open' }).appendChild(template.content.cloneNode(true))

      // Get the elements in the shadow root.
      this.#nameUi = this.shadowRoot.querySelector('#name-ui')
      this.#messageUi = this.shadowRoot.querySelector('#message-ui')
      this.#textArea = this.shadowRoot.querySelector('#text-area')
      this.#textAreaSend = this.shadowRoot.querySelector('#text-area-send')
      this.#inputArea = this.shadowRoot.querySelector('#input-area')
      this.#sendBtn = this.shadowRoot.querySelector('#send-btn')
      this.#sendMsgBtn = this.shadowRoot.querySelector('#send-msg-btn')
    }

    /**
     * Called when element is inserted in DOM.
     */
    connectedCallback () {
      // CREATE SOCKET
      const socket = new window.WebSocket('wss://courselab.lnu.se/message-app/socket')

      // DATA OBJECT
      const data = {
        type: 'message',
        data: '',
        username: this.#inputArea.value,
        key: 'eDBE76deU7L0H9mEBgxUKVR0VCnq0XBd'
      }

      // LISTEN FOR OPEN SOCKET EVENT
      socket.addEventListener('open', () => {
        console.log('Yay, open!')
      })

      // SAVE DATA
      let poop

      // SEND NAME
      this.#sendBtn.addEventListener('click', () => {
        this.#userName = this.#inputArea.value
        console.log(this.#userName)
        this.#nameUi.classList.add('hidden')
        this.#messageUi.classList.remove('hidden')
      })

      // LISTEN FOR MESSAGE EVENT
      socket.addEventListener('message', (event) => {
        poop = JSON.parse(event.data)

        if (poop.type === 'heartbeat') {
          console.log('HEARTBEAT')
        } else {
          this.showMessage(`${poop.username} says ${poop.data}`)
          console.log(poop)
        }
      })

      // SEND MESSAGE
      this.#sendMsgBtn.addEventListener('click', () => {
        console.log(this.#userName)
        poop.username = this.#userName
        data.data = this.#textAreaSend.value
        socket.send(JSON.stringify(data))
        this.#textAreaSend.value = ''
      })
    }

    /**
     * Called when element is removed from DOM.
     */
    disconnectedCallback () {
      // WEBSOCKET IN A CLASS VARIABEL? tO BE ABLE TO REACH IT EVERYWHERE.
    }

    /**
     * Shows message.
     *
     * @param {string} message - The message to display.
     */
    showMessage (message) {
      this.#textArea.textContent += `${message}\n`
    }
  }
)

/**
 * The chat web component module.
 */
import '../my-emoji/'

// Define template.
const template = document.createElement('template')
template.innerHTML = `
<style>
  #container-chat {
    background-color: #e6d1c1;
    display: block;
    font-family: "Times New Roman", Times, serif
    font-weight: bold;
    font-size: 20px;
    padding: 10px;
    border-radius: 5px;
    text-align: center;
    justify-content: center;
    margin: auto auto;
    height: 430px;
    width: 470px;
  }

  h1 {
    margin-top: 0;
    margin-bottom: 10px;
  }

  p {
    font-size: 15px;
  }

  #text-area {
    font-family: Arial, Helvetica, sans-serif;
    font-size: 15px;
    margin-bottom: 20px;
    line-height: 1.5;
    padding: 10px; 
    height: 170px;
    width: 300px;
    resize: none;
  }

  #text-area-send {
    font-size: 15px;
    display: block;
    padding: 10px;
    margin: 0 auto;
    width: 300px;
    resize: none;
  }

  input {
    font-size: 15px;
    display: block;
    padding: 10px;
    margin: 0 auto;
    margin-top: 50px;
  }

  button {
      background-color: #e6d1c1;
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
  <textarea readonly tabindex="-1" id="text-area"></textarea>
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
     * Create websocket.
     *
     * @type {WebSocket}
     */
    #socket = new window.WebSocket('wss://courselab.lnu.se/message-app/socket')

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
      console.log(window.localStorage.getItem('user-name'))
      // NOT THE RIGHT WAY???
      if (window.localStorage.getItem('user-name') !== null) {
        this.#nameUi.classList.add('hidden')
        this.#messageUi.classList.remove('hidden')
      } else {
        this.#messageUi.classList.add('hidden')
        this.#nameUi.classList.remove('hidden')
      }

      // SEND NAME
      this.#sendBtn.addEventListener('click', () => {
        if (this.#inputArea.value) {
          this.#userName = this.#inputArea.value
          window.localStorage.setItem('user-name', this.#userName)
          this.#nameUi.classList.add('hidden')
          this.#messageUi.classList.remove('hidden')
        } else {
          this.#inputArea.setAttribute('placeholder', 'Try again')
        }
      })
      // DATA OBJECT
      let parsedData = {
        type: 'message',
        data: '',
        username: '',
        key: ''
      }

      // LISTEN FOR OPEN SOCKET EVENT
      this.#socket.addEventListener('open', () => {
        console.log('Yay, open!')
        // LISTEN FOR MESSAGE EVENT
        this.#socket.addEventListener('message', (event) => {
          parsedData = JSON.parse(event.data)

          if (parsedData.data === '') {
            console.log('Server does shit, but message empty you n00b!')
          } else {
            this.showMessage(`${parsedData.username} says ${parsedData.data}`)
          }
        })

        // SEND MESSAGE
        this.#sendMsgBtn.addEventListener('click', () => {
          parsedData.username = this.#userName || window.localStorage.getItem('user-name')
          parsedData.data = this.#textAreaSend.value
          parsedData.key = 'eDBE76deU7L0H9mEBgxUKVR0VCnq0XBd'
          this.#socket.send(JSON.stringify(parsedData))
          this.#textAreaSend.value = ''
        })
      })

      // Prevent focus on text area displaying messages.
      this.#textArea.addEventListener('click', (event) => {
        this.preventFocus(event)
      })
    }

    /**
     * Called when element is removed from DOM.
     */
    disconnectedCallback () {
      this.#socket.close()
    }

    /**
     * Prevent text area focus.
     *
     * @param {event} event - The click event.
     */
    preventFocus (event) {
      event.preventDefault()
      event.currentTarget.blur()
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

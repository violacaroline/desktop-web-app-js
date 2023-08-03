/**
 * The my-advice webcomponent module.
 */

// Define template.
const template = document.createElement('template')
template.innerHTML = `
<style>
    #container-advice {
      background-color: #BFD8D2;
      font-family: Courier New;
      font-size: 20px;
      width: 400px;
      height: 450px;
      text-align: center;
      margin: 0 auto;
    }

    h1 {
      font-size: 40px;
      font-weight: 200;
    }

    #display-advice {
      background-color: white;
      color: black; 
      font-size: 23px;
      width: 300px;
      height: 300px;
      box-sizing: border-box;
      padding: 50px;
      text-align: center;
      margin: 0 auto;
      box-shadow: 0px 0 2px #433E49;
      border:none;
      border-radius: 5px;
    }

    button {
      background-color: #F08A4B;
      font-family: Courier New;
      color: black;
      cursor: pointer;
      font-weight: 200;
      margin: 20px;
      padding: 5px;
      border-radius: 3px;
      width: 30%;
      border: none;
      box-shadow: 0px 0 3px #433E49;
    }

    button:hover {
      box-shadow: 0px 0 10px #433E49;
    }

</style>
<div id="container-advice">
    <h1>Advice Wizard</h1>
    <div id="display-advice"></div>
    <button id="get-advice-btn">GET ADVICE</button>
</div>
`

/**
 * Define custom element.
 */
customElements.define('my-advice',
/**
 * Represents a random advice app.
 */
  class extends HTMLElement {
    /**
     * The display advice area.
     *
     * @type {HTMLDivElement}
     */
    #displayAdvice

    /**
     * The get advice button.
     *
     * @type {HTMLButtonElement}
     */
    #getAdviceBtn

    /**
     * Creates an instance of the current type.
     */
    constructor () {
      super()

      // Attach shadow DOM and append template.
      this.attachShadow({ mode: 'open' }).appendChild(template.content.cloneNode(true))

      // Get the elements in the shadow root.
      this.#displayAdvice = this.shadowRoot.querySelector('#display-advice')
      this.#getAdviceBtn = this.shadowRoot.querySelector('#get-advice-btn')
    }

    /**
     * Called when element is inserted in DOM.
     */
    connectedCallback () {
      this.#getAdviceBtn.addEventListener('click', () => {
        // Get an advice
        this.displayAdvice()
      })
    }

    /**
     * Display advice.
     */
    async displayAdvice () {
      let advice = await this.fetchAdvice()
      if (advice[advice.length - 1] === '.') {
        advice = advice.slice(0, advice.length - 1)
      }
      this.#displayAdvice.textContent = `${advice}`
    }

    /**
     * Fetch an advice.
     *
     * @returns {string} - A string of advice.
     */
    async fetchAdvice () {
      const advicePromise = await fetch('https://api.adviceslip.com/advice')
      const adviceJson = await advicePromise.json()

      return adviceJson.slip.advice
    }
  }
)

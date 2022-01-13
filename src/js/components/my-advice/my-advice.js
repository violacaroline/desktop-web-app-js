/**
 * The my-advice webcomponent module.
 */

// Define template.
const template = document.createElement('template')
template.innerHTML = `
<style>
    #container-advice {
      background-color: #F3E8EB;
      font-family: "Times New Roman", Times, serif
      font-size: 20px;
      width: 400px;
      height: 450px;
      text-align: center;
      margin: 0 auto;
    }

    h1 {
      font-size: 40px;
    }

    #display-advice {
      background-color: #e6d1c1;
      font-size: 23px;
      width: 300px;
      height: 300px;
      box-sizing: border-box;
      padding: 50px;
      text-align: center;
      margin: 0 auto;
      box-shadow: 0px 0 5px #433E49;
      border: solid 1px black; 
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

</style>
<div id="container-advice">
    <h1>Advice Wizard</h1>
    <div id="display-advice"></div>
    <button id="get-advice-btn">Get advice</button>
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
      const advice = await this.fetchAdvice()
      this.#displayAdvice.textContent = `"${advice}"`
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

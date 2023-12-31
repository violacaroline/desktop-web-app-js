/**
 * The memory game web component module.
 */

// Define template
const template = document.createElement('template')
template.innerHTML = `
<style>
    #container-memory {
      background-color: #BFD8D2;
      font-family: Courier New;
      font-size: 20px;
      width: 480px;
      height: 450px;
      text-align: center;
      margin: 0 auto;
    }

    h1 {
      font-weight: 200;
    }

    :host {
      --tile-size: 60px;
    }

    #game-board {
      display: grid;
      width: min-content;
      margin: 0 auto;
      grid-template-columns: repeat(4, var(--tile-size));
      gap: 12px;   
    }

    #game-board.small {
      grid-template-columns: repeat(2, var(--tile-size));
    }

    #attempts {
      font-size: 15px;
      text-align: center;
    }

    button {
      background-color: #c9719d;
      font-family: Courier New;
      font-weight: 300;
      letter-spacing: 1px;
      cursor: pointer;
      margin: 20px;
      padding: 5px;
      border-radius: 3px;
      border: none;
      box-shadow: 0px 0 3px #433E49;
    }

    button:hover {
      box-shadow: 0px 0 10px #433E49;
    }

    .hidden {
      display: none;
    }

    my-flip-tile {
      width: var(--tile-size);
      height: var(--tile-size);
    }

    my-flip-tile::part(tile-back) {
      border-width: 3px;
      background: url("/images/m.png") no-repeat center/70%;
      /* background: url("/images/m.png") no-repeat center/70%; */
    }
</style>
<div slot="content" id="container-memory">
<h1>Memory Game</h1>
<template id="tile">
    <my-flip-tile>
        <img />
    </my-flip-tile>
</template>
<audio id="correct-answer">
  <source src="/audio/correct-answer.mp3"/>
</audio>
<audio id="wrong-answer">
  <source src="/audio/wrong-answer.mp3"/>
</audio>
<div id="game-board"></div>
<p id="attempts" class="hidden"></p>
<button id="small-btn">SMALL</button><button id="medium-btn">MEDIUM</button><button id="restart-btn">LARGE</button>
</div>
`

/**
 * Define custom element.
 */
customElements.define('my-memory',
  /**
   * Represents a memory game.
   */
  class extends HTMLElement {
    /**
     * The game board element.
     *
     * @type {HTMLDivElement}
     */
    #gameBoard

    /**
     * The flip tile element.
     *
     * @type {HTMLTemplateElement}
     */
    #tile

    /**
     * Relative path to images.
     *
     * @type {string}
     */
    #relativePathImages = '/images/'

    /**
     * Displays amount of attempts per gameround
     *
     * @type {HTMLParagraphElement}
     */
    #displayAttempts

    /**
     * Amount of attempts.
     *
     * @type {number} - The number of attempts.
     */
    #amountAttempts = 0

    /**
     * The button representing a small gameboard.
     *
     * @type {HTMLButtonElement}
     */
    #smallBtn

    /**
     * The button representing a medium gameboard.
     *
     * @type {HTMLButtonElement}
     */
    #mediumBtn

    /**
     * Restart, default gameboard.
     *
     * @type {HTMLButtonElement}
     */
    #restartBtn

    /**
     * Creates an instance of the current type.
     */
    constructor () {
      super()

      // Attach shadow DOM and append template.
      this.attachShadow({ mode: 'open' }).appendChild(template.content.cloneNode(true))

      // Get the elements in the shadow root.
      this.#gameBoard = this.shadowRoot.querySelector('#game-board')
      this.#tile = this.shadowRoot.querySelector('#tile')
      this.#displayAttempts = this.shadowRoot.querySelector('#attempts')
      this.#mediumBtn = this.shadowRoot.querySelector('#medium-btn')
      this.#smallBtn = this.shadowRoot.querySelector('#small-btn')
      this.#restartBtn = this.shadowRoot.querySelector('#restart-btn')
    }

    /**
     * Get the game board size.
     *
     * @returns {string} - The desired game board size.
     */
    get gameBoardSize () {
      return this.getAttribute('gameboardsize')
    }

    /**
     * Set game board size.
     *
     * @param {string} desiredSize - The desired size of game board.
     */
    set gameBoardSize (desiredSize) {
      this.setAttribute('gameboardsize', desiredSize)
    }

    /**
     * Attributes to monitor.
     *
     * @returns {string[]} - A string array of attributes.
     */
    static get observedAttributes () {
      return ['gameboardsize']
    }

    /**
     * Determine the game board sizes.
     *
     * @returns {object} - An object determining the game board size.
     */
    gameSize () {
      const gameSize = {
        width: 4,
        height: 4
      }

      if (this.gameBoardSize === 'small') {
        gameSize.width = gameSize.height = 2
      } else if (this.gameBoardSize === 'medium') {
        gameSize.height = 2
      }
      return gameSize
    }

    /**
     * Get tiles.
     *
     * @returns {object} - An object of tiles.
     */
    get flipTiles () {
      const flipTiles = Array.from(this.#gameBoard.children)
      return {
        all: flipTiles,
        faceUp: flipTiles.filter(tile => tile.hasAttribute('face-up') && !tile.hasAttribute('hidden')),
        faceDown: flipTiles.filter(tile => !tile.hasAttribute('face-up') && !this.hasAttribute('hidden')),
        hidden: flipTiles.filter(tile => tile.hasAttribute('hidden'))
      }
    }

    /**
     * Called when element is inserted in DOM.
     */
    connectedCallback () {
      this.populateGameboard()

      // Listen for gameboard changes
      this.#smallBtn.addEventListener('click', () => {
        this.#displayAttempts.classList.add('hidden')
        this.#amountAttempts = 0
        this.setAttribute('gameboardsize', 'small')
        this.#gameBoard.classList.add('small')
        this.populateGameboard()
      })
      this.#mediumBtn.addEventListener('click', () => {
        this.#displayAttempts.classList.add('hidden')
        this.#amountAttempts = 0
        this.setAttribute('gameboardsize', 'medium')
        this.#gameBoard.classList.remove('small')
        this.populateGameboard()
      })
      this.#restartBtn.addEventListener('click', () => {
        this.#displayAttempts.classList.add('hidden')
        this.#amountAttempts = 0
        this.removeAttribute('gameboardsize')
        this.#gameBoard.classList.remove('small')
        this.populateGameboard()
      })

      // Listen for player won.
      this.addEventListener('playerWon', () => {
        this.getAmountAttempts()
      })

      // Listen for flip events.
      this.#gameBoard.addEventListener('flip', () => {
        const disabledTiles = this.disableTiles()
        this.checkIfMatch(disabledTiles)
      })
    }

    /**
     * Populate the gameboard.
     */
    populateGameboard () {
      while (this.#gameBoard.firstChild) {
        this.#gameBoard.removeChild(this.#gameBoard.lastChild)
      }
      const { width, height } = this.gameSize()
      const amountTiles = width * height
      // Add tiles.
      for (let i = 0; i < amountTiles; i++) {
        const tile = this.#tile.content.cloneNode(true)
        this.#gameBoard.appendChild(tile)
      }

      // Randomize image order.
      const imageOrder = [...Array(amountTiles).keys()]
      const randomizedImageOrder = imageOrder.sort((a, b) => 0.5 - Math.random())

      // Add images.
      this.flipTiles.all.forEach((tile, index) => {
        tile.querySelector('img').setAttribute('src', `${this.#relativePathImages + randomizedImageOrder[index] % (amountTiles / 2) + '.png'}`)
        tile.faceUp = tile.disabled = tile.hidden = false
      })
    }

    /**
     * Disable tiles when flipped tiles are two.
     *
     * @returns {Array} - An array of disabled flip tiles.
     */
    disableTiles () {
      const flipTiles = this.flipTiles
      const disableFlipTiles = Array.from(flipTiles.faceUp)

      if (flipTiles.faceUp.length > 1) {
        disableFlipTiles.push(...flipTiles.faceDown)
      }

      disableFlipTiles.forEach(tile => tile.setAttribute('disabled', ''))

      return disableFlipTiles
    }

    /**
     * Determine whether flip tiles facing up matches.
     *
     * @param {Array} disabledTiles - An array of disabled tiles.
     */
    checkIfMatch (disabledTiles) {
      const flipTiles = this.flipTiles
      const [firstTile, secondTile, ...enableFlipTiles] = disabledTiles

      // Set a timer to hide or flip back tiles
      if (secondTile) {
        const isMatch = firstTile.isMatch(secondTile)
        const timer = 1000

        window.setTimeout(() => {
          let nameEvent = 'no-match'
          if (isMatch) {
            firstTile.setAttribute('hidden', '')
            secondTile.setAttribute('hidden', '')
            nameEvent = 'match'
            // Increase amount of attempts
            this.#amountAttempts++
            this.getSoundEffect('#correct-answer')
          } else {
            firstTile.removeAttribute('face-up')
            secondTile.removeAttribute('face-up')
            enableFlipTiles.push(firstTile, secondTile)
            // Increase amount of attempts
            this.#amountAttempts++
            this.getSoundEffect('#wrong-answer')
          }

          this.dispatchEvent(new CustomEvent(nameEvent, {
            bubbles: true,
            detail: { firstTile, secondTile }
          }))

          // Player has won
          if (flipTiles.all.every(tile => tile.hidden)) {
            flipTiles.all.forEach(tile => (tile.disabled = true))
            this.dispatchEvent(new CustomEvent('playerWon', {
              bubbles: true
            }))
          } else {
            // Enable tiles.
            enableFlipTiles.forEach(tile => tile.removeAttribute('disabled'))
          }
        }, timer)
      }
    }

    /**
     * Count amount of attempts and display it.
     */
    getAmountAttempts () {
      this.#displayAttempts.classList.remove('hidden')
      this.#displayAttempts.textContent = `Attempts: ${this.#amountAttempts++}`
    }

    /**
     * Get sound effects.
     *
     * @param {HTMLAudioElement} sound - The type of sound to be played.
     */
    getSoundEffect (sound) {
      const soundEffect = this.shadowRoot.querySelector(sound)
      soundEffect.play()
    }
  }
)

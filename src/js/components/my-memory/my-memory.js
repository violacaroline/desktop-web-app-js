/**
 * The memory game web component module.
 */
import '../my-flip-tile/'

/**
 * Define template.
 */
const template = document.createElement('template')
template.innerHTML = `
<style>
    #container-memory {
      background-color: #e6d1c1;
      font-family: "Times New Roman", Times, serif
      font-weight: bold;
      font-size: 20px;
      max-width: 500px;
      max-height: 500px;
      text-align: center;
      margin: 0 auto;
    }

    :host {
      --tile-size: 60px;
    }

    #game-board {
      display: grid;
      justify-content: center;
      grid-template-columns: repeat(4, var(--tile-size));
      gap: 15px;
    }

    #game-board.small {
      grid-template-columns: repeat(2, var(--tile-size));
    }

    button {
      background-color: #DBC1AD;
      font-family: "Times New Roman", Times, serif
      font-weight: bold;
      margin: 25px;
      padding: 7px;
      border-radius: 3px;
      border: solid 1px black;
    }

    button:hover {
      box-shadow: 0px 0 10px #433E49;
    }

    my-flip-tile {
      width: var(--tile-size);
      height: var(--tile-size);
    }

    my-flip-tile::part(tile-back) {
      border-width: 3px;
      background: url("/js/components/my-memory/images/m.png") no-repeat center/70%;
    }
</style>
<div slot="content" id="container-memory">
<h1>Memory Game</h1>
<template id="tile">
    <my-flip-tile>
        <img />
    </my-flip-tile>
</template>
<div id="game-board"></div>
<button id="small-btn">Small 2*2</button><button id="medium-btn">Medium 2*4</button><button id="restart-btn">Restart</button>
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
    #relativePathImages = '/js/components/my-memory/images/'

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
      console.log('Gameboard', this.#gameBoard)
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
        this.setAttribute('gameboardsize', 'small')
        this.#gameBoard.classList.add('small')
        this.populateGameboard()
      })
      this.#mediumBtn.addEventListener('click', () => {
        this.setAttribute('gameboardsize', 'medium')
        this.#gameBoard.classList.remove('small')
        this.populateGameboard()
      })
      this.#restartBtn.addEventListener('click', () => {
        this.removeAttribute('gameboardsize')
        this.#gameBoard.classList.remove('small')
        this.populateGameboard()
      })

      // Listen for flip events.
      this.#gameBoard.addEventListener('flip', () => {
        console.log('Some shit just flipped from Memory')
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
      // TEST TO ADD TILES
      for (let i = 0; i < amountTiles; i++) {
        const tile = this.#tile.content.cloneNode(true)
        this.#gameBoard.appendChild(tile)
      }

      // TEST TO RANDOMIZE IMAGE ORDER
      const imageOrder = [...Array(amountTiles).keys()]
      const randomizedImageOrder = imageOrder.sort((a, b) => 0.5 - Math.random())

      // TEST TO ADD IMAGES
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
        const timer = isMatch ? 1000 : 1200

        window.setTimeout(() => {
          let nameEvent = 'no-match'
          if (isMatch) {
            firstTile.setAttribute('hidden', '')
            secondTile.setAttribute('hidden', '')
            nameEvent = 'match'
          } else {
            firstTile.removeAttribute('face-up')
            secondTile.removeAttribute('face-up')
            enableFlipTiles.push(firstTile, secondTile)
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
            console.log('You won maddafakka')
            // Repopulate the board
            this.populateGameboard()
          } else {
            // Enable tiles.
            enableFlipTiles.forEach(tile => tile.removeAttribute('disabled'))
          }
        }, timer)
      }
    }
  }
)

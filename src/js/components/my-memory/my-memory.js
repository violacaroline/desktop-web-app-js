/**
 * The memory game web component module.
 */
import './my-flip-tile/index.js'

/**
 * Define template.
 */
const template = document.createElement('template')
template.innerHTML = `
<style>
    :host {
        --tile-size: 100px;
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

    my-flip-tile {
        width: var(--tile-size);
        height: var(--tile-size);
    }

    my-flip-tile::part(tile-back) {
        border-width: 3px;
        background-color: #DBC1AD;
        background: url("/js/components/my-memory/images/m.png") no-repeat center/70%;
    }
</style>
<div id="container-memory">
<template id="tile">
    <my-flip-tile>
        <img />
    </my-flip-tile>
</template>
<div id="game-board"></div>
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
     */
    #relativePathImages = '/js/components/my-memory/images/'

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
      if (!this.hasAttribute('gameboardsize')) {
        this.setAttribute('gameboardsize', 'large') // Large does not exist???
      }

      // UPGRADE PROPERTY

      // EVENT LISTENER FOR FLIPPING THE TILE

      // TEST TO ADD TILES
      const amountTiles = 16
      for (let i = 0; i < amountTiles; i++) {
        const tile = this.#tile.content.cloneNode(true)
        this.#gameBoard.appendChild(tile)
      }

      // TEST TO ADD IMAGES
      this.flipTiles.all.forEach((tile, index) => {
        console.log(`${this.#relativePathImages + index + '.png'}`)
        tile.querySelector('img').setAttribute('src', `${this.#relativePathImages + index % (amountTiles / 2) + '.png'}`)
        console.log(tile)
        tile.faceUp = tile.disabled = tile.hidden = false
      })
    }
  }
)

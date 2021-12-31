/**
 * The memory game web component.
 */

// Define template
const template = document.createElement('template')
template.innerHTML = `
<style>
    #memory-game-container {
        height: 100vh;
        border: 4px solid #433E49;
        text-align: center;
    }
    #game-board {
        display: grid;
        grid-template-columns: repeat(4, 100px);
        grid-template-rows: repeat(4, 75px);
        gap: 20px;
        justify-content: center;
    }
    img {
        margin: auto;
    }
</style>
<div id="memory-game-container">
<h1>Memory Game</h1>
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
     * Flipping tiles.
     *
     * @type {Array}
     */
    #flippingTiles = []

    /**
     * Chosen tiles.
     *
     * @type {Array}
     */
    #clickedTiles = []

    /**
     * Clicked tiles ID number.
     *
     * @type {Array}
     */
    #clickedTilesId = []

    /**
     * Matched tiles.
     *
     * @type {Array}
     */
    #matchedTiles = []

    /**
     * Creates an instance of the current type.
     */
    constructor () {
      super()

      // Attach shadow DOM and append template.
      this.attachShadow({ mode: 'open' }).appendChild(template.content.cloneNode(true))

      // Get the elements in the shadow root.
      this.#gameBoard = this.shadowRoot.querySelector('#game-board')
    }

    /**
     * Called when element is inserted in the DOM.
     */
    connectedCallback () {
      this.createFlippingTiles()
      this.#flippingTiles.sort(() => 0.5 - Math.random())
      this.createGameBoard(this.#flippingTiles)
    }

    /**
     * Check if tiles match.
     */
    tilesMatch () {
      const tileImages = this.querySelectorAll('img')
      const firstTile = this.#clickedTilesId[0]
      const secondTile = this.#clickedTilesId[1]
      if (this.#clickedTiles[0] === this.#clickedTiles[1]) {
        tileImages[firstTile].setAttribute('src', 'images/transparent.png')
        tileImages[secondTile].setAttribute('src', 'images/transparent.png')
        this.#matchedTiles.push(this.#clickedTiles)
      } else {
        tileImages[firstTile].setAttribute('src', 'images/m.png')
        tileImages[secondTile].setAttribute('src', 'images/m.png')
      }
      this.#clickedTiles = []
      this.#clickedTilesId = []
    }

    /**
     * Flip a tile.
     */
    flipTile () {
      const tileIdNumber = this.getAttribute('data-id')
      console.log('Tile ID', tileIdNumber)
      this.#clickedTiles.push(this.#flippingTiles[tileIdNumber].name)
      this.#clickedTilesId.push(tileIdNumber)
      this.setAttribute('src', this.#flippingTiles[tileIdNumber].img)
      if (this.#clickedTiles === 2) {
        setTimeout(this.tilesMatch, 600)
      }
    }

    /**
     * Create game board.
     *
     * @param {Array} flippingTilesArray - An array of flipping tiles.
     */
    createGameBoard (flippingTilesArray) {
      console.log('Flipping tiles from create gameboard', flippingTilesArray)
      for (let i = 0; i < this.#flippingTiles.length; i++) {
        const flippingTile = document.createElement('img')
        flippingTile.setAttribute('src', 'images/m.png')
        flippingTile.setAttribute('data-id', i)
        // flippingTile.addEventListener('click', this.flipTile())
        this.#gameBoard.appendChild(flippingTile)
      }
    }

    /**
     * Create flipping tiles.
     */
    createFlippingTiles () {
      this.#flippingTiles = [
        {
          name: '1',
          img: 'images/1.png'
        },
        {
          name: '1',
          img: 'images/1.png'
        },
        {
          name: '2',
          img: 'images/2.png'
        },
        {
          name: '2',
          img: 'images/2.png'
        },
        {
          name: '3',
          img: 'images/3.png'
        },
        {
          name: '3',
          img: 'images/3.png'
        },
        {
          name: '4',
          img: 'images/4.png'
        },
        {
          name: '4',
          img: 'images/4.png'
        },
        {
          name: '5',
          img: 'images/5.png'
        },
        {
          name: '5',
          img: 'images/5.png'
        },
        {
          name: '6',
          img: 'images/6.png'
        },
        {
          name: '6',
          img: 'images/6.png'
        },
        {
          name: '7',
          img: 'images/7.png'
        },
        {
          name: '7',
          img: 'images/7.png'
        },
        {
          name: '8',
          img: 'images/8.png'
        },
        {
          name: '8',
          img: 'images/8.png'
        }
      ]
    }
  }
)

import { useContext, useEffect, useRef, useState } from 'react';
import './cagematch.css';
import { TerminalContext } from './../../context/TerminalContext';
export default function Cagematch() {
  const maxLives = 16;
  const dealSpeed = 30;
  const { updateCommand } = useContext(TerminalContext);
  const [screen, setScreen] = useState('');
  const [hearts, setHearts] = useState(maxLives);
  let chosen = [];
  let matchedCards = [];
  const main = useRef();

  // =======================  SOUNDS  ======================= //

  const themesong = new Audio('./cagematch_assets/sounds/psykick.mp3');
  const cagesings = new Audio('./cagematch_assets/sounds/singing.mp3');
  const misssound = new Audio('./cagematch_assets/sounds/hit-01.wav');
  const dealsound = new Audio('./cagematch_assets/sounds/deal.wav');
  const flipsound = new Audio('./cagematch_assets/sounds/flip.wav');
  const shame = new Audio('./cagematch_assets/sounds/shame-on-you.mp3');
  const throughtoyou = new Audio(
    './cagematch_assets/sounds/am-i-getting-through-to-you.mp3'
  );
  const cagethanksyou = new Audio('./cagematch_assets/sounds/cage-thanks.mp3');
  const boredcage = new Audio('./cagematch_assets/sounds/cage-bored.mp3');
  const bunny = new Audio('./cagematch_assets/sounds/cage-bunny.mp3');

  const declaration = new Audio(
    './cagematch_assets/sounds/cage-declaration.mp3'
  );
  const matchsound = new Audio(
    './cagematch_assets/sounds/collect-point-01.wav'
  );
  const clipArray = [throughtoyou, boredcage, bunny, declaration];
  const getRandoSound = () => {
    let num = Math.floor(Math.random() * clipArray.length);
    return clipArray[num];
  };

  // =======================  IMAGES  ======================= //

  const cardbacksrc = './cagematch_assets/images/cage10.jpg';
  const caged = './cagematch_assets/images/cage6.jpg';
  const loser = './cagematch_assets/images/cage9.jpg';
  const winner = './cagematch_assets/images/cage8.jpg';
  const titleScreen = './cagematch_assets/images/title-screen.jpg';

  const cardArray = [
    {
      name: 'cage1',
      img: './cagematch_assets/images/cage1.jpg',
    },
    {
      name: 'cage2',
      img: './cagematch_assets/images/cage2.jpg',
    },
    {
      name: 'cage3',
      img: './cagematch_assets/images/cage3.jpg',
    },
    {
      name: 'cage4',
      img: './cagematch_assets/images/cage4.jpg',
    },
    {
      name: 'cage5',
      img: './cagematch_assets/images/cage5.jpg',
    },
    {
      name: 'cage7',
      img: './cagematch_assets/images/cage7.jpg',
    },
    {
      name: 'cage11',
      img: './cagematch_assets/images/cage11.jpg',
    },
    {
      name: 'cage12',
      img: './cagematch_assets/images/cage12.jpg',
    },
    {
      name: 'cage13',
      img: './cagematch_assets/images/cage13.jpg',
    },
    {
      name: 'cage14',
      img: './cagematch_assets/images/cage14.jpg',
    },
  ];
  let cardArrayCopy = cardArray.map((x) => x);
  let fullArray = cardArray.concat(cardArrayCopy);
  fullArray.sort(() => 0.5 - Math.random());

  // =======================  UTIL  ======================= //

  /**
   *
   * @returns NodeList of images
   */
  const getAllCards = () => {
    return document.querySelectorAll('img');
  };

  /**
   *
   * Async function to wait for any key to be pressed
   * Can wait for a specific key passed as a keycode number in parameter
   * @param {number} code Which keycode to wait for requires integer
   * @returns {Promise} Resolves when specified key is pressed or any key if no keycode provided
   */
  const waitForKey = async function (code = null) {
    return new Promise((resolve) => {
      const handle = (event) => {
        if (!code || event.keyCode === code) {
          document.removeEventListener('keyup', handle);
          document.removeEventListener('click', handle);
          resolve();
        }
      };
      document.addEventListener('keyup', handle);
      document.addEventListener('click', handle);
    });
  };
  /**
   * Allows clicking on all cards after they are dealt
   * Changes the state of `command` using updateCommand function
   * Uses getAllCards function for the NodeList
   * Checks for data-match before enabling pointer-event
   * @returns {void}
   *
   */
  function enableClicking() {
    updateCommand('cage3');
    let cards = getAllCards();
    for (const card of cards) {
      let match = card.getAttribute('data-match');
      if (!match) {
        card.setAttribute('style', 'pointer-events: auto');
      }
    }
  }
  /**
   * Disables clicking by removing pointer events on all cards
   * Uses getAllCards function for the NodeList
   * @returns {void}
   *
   *
   */
  function disableClicking() {
    let cards = getAllCards();
    for (const card of cards) {
      card.setAttribute('style', 'pointer-events: none');
    }
  }
  /**
   * Sets innerHTML of current ref to empty string ''
   * @returns {void}
   *
   *
   */
  const clearBoard = () => {
    const grid = main.current;
    grid.innerHTML = '';
  };
  /** 
  useEffect hook that runs the init function when the component is mounted
  @returns {void}
  */
  useEffect(() => {
    init();
  }, []);

  /**
   * Game start function
   * Sends messages to status terminal
   * Shows title screen and music
   * Uses waitForKey() function to proceed through screens
   * Runs and contains the recursive dealCards function
   * @returns {void}
   */

  const init = async () => {
    updateCommand('cage1'); // send for initial message in terminal
    await waitForKey();
    updateCommand('clear');
    setScreen(TitleScreen);
    themesong.play();
    await waitForKey(13);
    themesong.pause();
    setScreen(GameScreen);
    const grid = main.current;
    updateCommand('cage2');
    cagesings.play();

    /**
     * dealCards - A function that recursively deals cards in the game
     * for each item in the array it uses the index of current card to set img src and data attributes
     * it also adds a click listener to use the flipCard function
     * clicking is disabled initially
     * use dealSpeed value to set the rate the cards are displayed
     * when the index equals the length of array it calls enableClicking() to set pointer-events to auto
     *
     * @param {Array} arr - The array of cards to be dealt
     * @param {number} i - The index of the current card being dealt
     * @returns {void}
     */
    const dealCards = (arr, i) => {
      if (i === arr.length) {
        enableClicking();
      } else {
        const card = document.createElement('img');
        card.setAttribute('src', cardbacksrc);
        card.setAttribute('data-id', i);
        card.addEventListener('click', flipCard.bind(this));
        // initially disable clicking
        card.setAttribute('style', 'pointer-events: none');
        dealsound.play();
        grid.appendChild(card);
        setTimeout(dealCards, dealSpeed, arr, i + 1);
      }
    };
    // initial index is 0 to match the natural first key of the array
    dealCards(fullArray, 0);
  };
  /**
   * flipCard - handles the click event of a card to show which image is associated with this id
   * @param {Event} event - The event object that triggered this function
   * @returns {void}
   */
  const flipCard = (event) => {
    let self = event.target;
    // set the image and disable pointer events
    self.setAttribute('src', fullArray[self.getAttribute('data-id')].img);
    self.setAttribute('style', 'pointer-events: none');
    chosen.push(self);
    flipsound.play();
    if (chosen.length === 2) {
      disableClicking();
      setTimeout(checkForMatch.bind(this), 800);
    }
  };

  // change image, remove pointer events, and add new data-attribuute so enableClicking will skip these
  const setMatchedAttributes = (card) => {
    card.setAttribute('data-match', true);
    card.setAttribute('src', caged);
    card.setAttribute('style', 'pointer-events: none');
  };

  // Check choices for a match
  const checkForMatch = () => {
    let card1 = chosen[0];
    let card2 = chosen[1];
    let cardName1 = fullArray[card1.getAttribute('data-id')].name;
    let cardName2 = fullArray[card2.getAttribute('data-id')].name;

    if (cardName1 === cardName2) {
      matchsound.play();
      matchedCards.push(card1, card2);
      setMatchedAttributes(card1);
      setMatchedAttributes(card2);
      // remove fail point if match
      setHearts((z) => (z === maxLives ? z : z + 1));
      console.log('Matched so far: ', matchedCards);
      if (matchedCards.length === fullArray.length) {
        console.log('YOU ARE A BIG WEEEINER');
      }
    } else {
      card1.setAttribute('src', cardbacksrc);
      card2.setAttribute('src', cardbacksrc);

      misssound.play();
      setHearts((z) => z - 1);
    }

    // empty the array
    chosen = [];
    // allow clicking on everything again
    enableClicking();
    // remove any left over message in terminal
    updateCommand('clear');
  };

  // Functions based on score
  useEffect(() => {
    switch (hearts) {
      case 0:
        gameOver();
        break;
      case 1:
        updateCommand('cage5');
        break;
      case 2:
        getRandoSound().play();
        break;
      case 3:
        updateCommand('cage4');
        break;
      default:
        break;
    }
  }, [hearts]);

  const TitleScreen = () => {
    return (
      <>
        <div
          className='fullscreen'
          style={{ backgroundImage: `url(${titleScreen})` }}
        >
          <h1 className='jt --debug'>
            <span className='jt__row'>
              <span className='jt__text'>Cage Match</span>
            </span>
            <span className='jt__row jt__row--sibling' aria-hidden='true'>
              <span className='jt__text'>Cage Match</span>
            </span>
            <span className='jt__row jt__row--sibling' aria-hidden='true'>
              <span className='jt__text'>Cage Match</span>
            </span>
            <span className='jt__row jt__row--sibling' aria-hidden='true'>
              <span className='jt__text'>Cage Match</span>
            </span>
          </h1>
          <div className='delayed-display'>
            <div className='enter'>--- PRESS ENTER ---</div>
          </div>
        </div>
      </>
    );
  };
  const FailScreen = () => {
    return (
      <>
        <div className='fullscreen'>
          <h1 className='jt --debug'>
            <span className='jt__row'>
              <span className='jt__text'>GAME OVER</span>
            </span>
            <span className='jt__row jt__row--sibling' aria-hidden='true'>
              <span className='jt__text'>GAME OVER</span>
            </span>
            <span className='jt__row jt__row--sibling' aria-hidden='true'>
              <span className='jt__text'>GAME OVER</span>
            </span>
            <span className='jt__row jt__row--sibling' aria-hidden='true'>
              <span className='jt__text'>GAME OVER</span>
            </span>
          </h1>
        </div>
      </>
    );
  };
  const GameScreen = () => {
    // This seems kind of lame but this is how I reset screen
    return (
      <>
        <span></span>
      </>
    );
  };

  const YouWin = () => {
    return (
      <>
        <span>neat-o</span>
      </>
    );
  };

  const gameOver = async () => {
    updateCommand('cage6');
    clearBoard();
    setScreen(FailScreen);
    shame.play();
    await waitForKey(13);
    setScreen(GameScreen);
    setHearts(maxLives);
    init();
  };

  return (
    <div className='grid'>
      {screen}
      <div className='scoreBoard'>
        <div className='scoreWrap'>
          <h1>CAGEMATCH</h1>
          <span>❤ {hearts} </span>
        </div>
      </div>
      <div className='gameBoard' ref={main}></div>
    </div>
  );
}

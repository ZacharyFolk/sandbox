import { useContext, useEffect, useRef, useState } from 'react';
import './cagematch.css';
import { TerminalContext } from './../../context/TerminalContext';

export default function Cagematch() {
  const { updateCommand } = useContext(TerminalContext);
  let chosen = [];
  let matchedCards = [];
  const maxLives = 6;
  const [hearts, setHearts] = useState(maxLives);
  const main = useRef();

  // SOUNDS
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

  const clipArray = [throughtoyou, boredcage, bunny];
  const getRandoSound = () => {
    let num = Math.floor(Math.random() * clipArray.length);
    return clipArray[num];
  };
  // IMAGES
  let cardbacksrc = './cagematch_assets/images/cage10.jpg';
  let caged = './cagematch_assets/images/cage6.jpg';
  let loser = './cagematch_assets/images/cage9.jpg';
  let winner = './cagematch_assets/images/cage8.jpg';

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

  useEffect(() => {
    updateCommand('cage1'); // send for initial message in terminal
    init();
  }, []);

  const getAllCards = () => {
    return document.querySelectorAll('img');
  };
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

  // Initial deal
  const init = async () => {
    const grid = main.current;
    grid.innerHTML = '';
    await waitForKey();

    console.log('when go');

    // cagesings.play();
    // create recursive loop so can add a delay and simulate dealing cards
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
        setTimeout(dealCards, 300, arr, i + 1);
      }
    };
    // initial index is 0 to match the natural first key of the array
    dealCards(fullArray, 0);
  };

  function enableClicking() {
    // cards dealt start game
    updateCommand('cage2');

    let cards = getAllCards();

    // enable clicking
    for (const card of cards) {
      let match = card.getAttribute('data-match');
      console.log(match);
      if (!match) {
        card.setAttribute('style', 'pointer-events: auto');
      }
    }
  }

  function disableClicking() {
    let cards = getAllCards();

    // enable clicking
    for (const card of cards) {
      card.setAttribute('style', 'pointer-events: none');
    }
  }
  // Card clicked
  const flipCard = (card) => {
    flipsound.play();
    // TODO : Use this target
    let self = card.target;

    let cardId = self.getAttribute('data-id');
    let cardName = fullArray[cardId].name;
    let cardObj = { id: cardId, name: cardName };

    console.log('SELF', self);
    self.setAttribute('style', 'pointer-events: none');
    // SET NEW IMAGE
    self.setAttribute('src', fullArray[cardId].img);
    chosen.push(cardObj);

    if (chosen.length === 2) {
      disableClicking();
      setTimeout(checkForMatch.bind(this), 800);
    }
    // setChosen((x) => [...x, cardName]);
  };

  // Check choices for a match
  const checkForMatch = () => {
    // TODO : Better way?  Have to store this in own arrays to compare them
    //
    const cards = document.querySelectorAll('img');
    let chosenName1 = chosen[0].name;
    let chosenName2 = chosen[1].name;
    let chosenId1 = chosen[0].id;
    let chosenId2 = chosen[1].id;

    if (chosenName1 === chosenName2) {
      matchsound.play();
      // change image and remove pointer events : add new data-attribuute so enableClicking will skip these
      cards[chosenId1].setAttribute('src', caged);
      cards[chosenId1].setAttribute('style', 'pointer-events: none');
      cards[chosenId2].setAttribute('src', caged);
      cards[chosenId2].setAttribute('style', 'pointer-events: none');
      cards[chosenId1].setAttribute('data-match', true);
      cards[chosenId2].setAttribute('data-match', 'true');

      // remove fail point if match
      setHearts((z) => (z === maxLives ? z : z + 1));
    } else {
      cards[chosenId1].setAttribute('src', cardbacksrc);
      cards[chosenId2].setAttribute('src', cardbacksrc);

      misssound.play();
      setHearts((z) => z - 1);
    }

    // empty the array
    chosen = [];
    // allow clicking on everything again
    enableClicking();
  };

  // Functions based on score
  useEffect(() => {
    console.log('hearts', hearts);
    switch (hearts) {
      case 0:
        console.log('fail');
        shame.play();

        break;
      case 1:
        getRandoSound().play();

        break;

      default:
        break;
    }
  }, [hearts]);

  return (
    <div className='grid'>
      <div className='scoreBoard'>
        <h1>CAGEMATCH</h1>
        <span>❤ {hearts} </span>
      </div>
      <div className='gameBoard' ref={main}></div>
      {/* <div className='fullscreen'>
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
      </div> */}
    </div>
  );
}

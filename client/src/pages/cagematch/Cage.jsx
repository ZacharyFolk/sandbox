import { useContext, useEffect, useRef, useState } from 'react';
import './cagematch.css';
import { TerminalContext } from './../../context/TerminalContext';

export default function Cagematch(props) {
  const { updateCommand } = useContext(TerminalContext);
  console.log('props', props);

  const [initialScreen, setInitialScreen] = useState(false);
  let chosen = [];
  const [hearts, setHearts] = useState(3);
  const main = useRef();
  const scoreboard = useRef();

  // SOUNDS

  const matchsound = new Audio(
    './cagematch_assets/sounds/collect-point-01.wav'
  );
  const misssound = new Audio('./cagematch_assets/sounds/hit-01.wav');
  const dealsound = new Audio('./cagematch_assets/sounds/menu-navigate-03.wav');
  const cagethanksyou = new Audio('./cagematch_assets/sounds/cage-thanks.mp3');
  const boredcage = new Audio('./cagematch_assets/sounds/cage-bored.mp3');
  const declaration = new Audio(
    './cagematch_assets/sounds/cage-declaration.mp3'
  );

  // IMAGES

  let cardbacksrc = './cagematch_assets/images/cage10.jpg';
  let caged = './cagematch_assets/images/cage6.jpg';

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
  ];
  let cardArrayCopy = cardArray.map((x) => x);
  let fullArray = cardArray.concat(cardArrayCopy);
  fullArray.sort(() => 0.5 - Math.random());

  const checkForMatch = (card) => {
    console.log('CHECKING', chosen);
    const cards = document.querySelectorAll('img');
    console.log('cards', cards);
    let chosenName1 = chosen[0].name;
    let chosenName2 = chosen[1].name;
    let chosenId1 = chosen[0].id;
    let chosenId2 = chosen[1].id;

    console.log(chosenName1, chosenName2);

    if (chosenName1 === chosenName2) {
      console.log('match');
      cards[chosenId1].setAttribute('src', caged);
      cards[chosenId2].setAttribute('src', caged);
      matchsound.play();
      // remove fail point if match
      setHearts((z) => (z === 3 ? z : z + 1));
    } else {
      cards[chosenId1].setAttribute('src', cardbacksrc);
      cards[chosenId2].setAttribute('src', cardbacksrc);

      misssound.play();
      setHearts((z) => z - 1);
    }
    // update score

    // empty the array
    chosen = [];
    // allow clicking on everything again
    enableClicking();
  };

  useEffect(() => {
    console.log('hearts', hearts);
    switch (hearts) {
      case 0:
        declaration.play();
        console.log('fail');
        break;
      case 1:
        boredcage.play();
        break;

      default:
        break;
    }
  }, [hearts]);

  const flipCard = (card) => {
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
      setTimeout(checkForMatch.bind(this), 500);
    }
    // setChosen((x) => [...x, cardName]);
  };
  const getAllCards = () => {
    return document.querySelectorAll('img');
  };

  function enableClicking() {
    updateCommand('cage2');
    console.log('WHEN DO I RUN');
    let cards = getAllCards();
    // enable clicking
    for (const card of cards) {
      card.setAttribute('style', 'pointer-events: auto');
    }
  }

  const init = () => {
    const grid = main.current;
    grid.innerHTML = '';
    console.log(fullArray);

    // for (var i = 0; i < fullArray.length; i++) {
    //   const card = document.createElement('img');
    //   card.setAttribute('src', cardbacksrc);
    //   card.setAttribute('data-id', i);
    //   setTimeout(function () {
    //     grid.appendChild(card);
    //   }, 300);
    // }

    // create recursive loop so can add a delay and simulate dealing cards
    function dealCards(arr, i) {
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
    }
    // initial index is 0 to match the natural first key of the array

    dealCards(fullArray, 0);

    // setTimeout(function () {
    //   // dealsound.play();
    //   i++;
    //   if (i < fullArray.length) {
    //     //  deal();
    //   }
    // }, 200);
  };

  //   if (typeof window !== 'undefined') {
  //     // Don't need useEffect!  https://beta.reactjs.org/learn/you-might-not-need-an-effect
  //     init();
  //   }

  useEffect(() => {
    updateCommand('cage1');

    init();
  }, []);

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

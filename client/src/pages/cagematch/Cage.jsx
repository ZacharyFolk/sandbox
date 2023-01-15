import { useRef, useEffect, useState } from 'react';
import './cagematch.css';

export default function Cagematch(props) {
  console.log('props', props);

  const [initialScreen, setInitialScreen] = useState(false);
  let chosen = [];
  const [attempts, setAttempt] = useState(0);
  const main = useRef();
  const scoreboard = useRef();

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
    } else {
      console.log(cards[chosenId1]);
      cards[chosenId1].setAttribute('src', cardbacksrc);
      cards[chosenId2].setAttribute('src', cardbacksrc);
      console.log('no match');
    }
    // updaate score
    setAttempt((z) => z + 1);
    // empty the array
    chosen = [];
    // allow clicking on everything again
    enableClicking();
  };

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
    init();
    console.log('wtf', main.current);
  }, []);

  return (
    <div className='grid'>
      <div className='scoreBoard'>{attempts}</div>
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

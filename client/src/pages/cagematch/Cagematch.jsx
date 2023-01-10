import { useEffect, useState } from 'react';
import Game from './Game.jsx';
import './cagematch.css';
async function waitForKey() {
  return new Promise((resolve) => {
    const handle = () => {
      document.removeEventListener('keyup', handle);
      document.removeEventListener('click', handle);
      resolve();
    };
    document.addEventListener('keyup', handle);
    document.addEventListener('click', handle);
  });
}

export default function Cagematch() {
  const [deal, setDeal] = useState(false);
  useEffect(() => {
    async function init() {
      // console.log('start doing stuff');
      await waitForKey();
      console.log('pressed key');
      if (!deal) {
        let game = new Game({});
        game.start();
        setDeal(true);
      }
    }
    init();
  });

  return (
    <>
      <div className='grid'>
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
    </>
  );
}

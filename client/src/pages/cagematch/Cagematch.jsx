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

async function init() {
  // await waitForKey();
  //  const themesong = new Audio('./cagematch_assets/sounds/psykick.mp3');
  // themesong.play();
  await waitForKey();
  // themesong.pause();
  document.querySelector('.grid').innerHTML = '';
  let game = new Game({});
  game.start();
}

if (typeof window !== 'undefined') {
  // Don't need useEffect!  https://beta.reactjs.org/learn/you-might-not-need-an-effect
  init();
}
export default function Cagematch() {
  // useEffect(() => {
  //   async function init() {
  //     // console.log('start doing stuff');
  //     await waitForKey();
  //     console.log('pressed key');
  //     if (!deal) {
  //       let game = new Game({});
  //       game.start();
  //       setDeal(true); // was trying to make this work with React.StrictMode
  //       // this was no help
  //       // read more : https://stackoverflow.com/questions/72238175/why-useeffect-running-twice-and-how-to-handle-it-well-in-react
  //     }
  //   }
  //   init();
  // });

  return (
    <>
      <div className='grid'>
        <div className='fullscreen'>
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
      </div>
    </>
  );
}

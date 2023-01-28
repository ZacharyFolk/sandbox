import { useContext, useEffect } from 'react';
import { TerminalContext } from './../../context/TerminalContext';
import { Link } from 'react-router-dom';
import './games.css';
export default function Games() {
  const { updateCommand } = useContext(TerminalContext);
  const cagematch = './cagematch_assets/images/cage-preview.jpg';
  const triva = './images/trivia-preview.jpg';

  useEffect(() => {
    updateCommand('games');
  }, []);

  return (
    <>
      <div className='container'>
        <h1 className='games'>GAMES</h1>
        <div className='gamegrid'>
          <div className='game'>
            {/* <div className='title'>Cagematch</div> */}

            <img src={cagematch} alt='Title screen for cagematch' />

            <div className='description'>
              <Link to='/cagematch'>Play It! </Link>
            </div>
          </div>

          <div className='game'>
            {/* <div className='title'>Trivia Game</div> */}

            <img src={triva} alt='Title screen for trivia game' />

            <div className='description'>
              <Link to='/trivia'>Play It! </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

import { useContext, useEffect } from 'react';
import { TerminalContext } from './../../context/TerminalContext';
import { Link } from 'react-router-dom';

export default function Games() {
  const { updateCommand } = useContext(TerminalContext);
  const cagematch = './cagematch_assets/images/cage-preview.jpg';

  useEffect(() => {
    updateCommand('games');
    console.log('GAMES PAGE');
  }, []);

  return (
    <>
      <div className='container'>
        <h1 className='games'>Games</h1>
        <div className='gamegrid'>
          <div className='game'>
            {/* <div className='title'>Cagematch</div> */}

            <img src={cagematch} alt='Title screen for cagematch' />

            <div className='description'>
              <Link to='/cagematch'>Play It! </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

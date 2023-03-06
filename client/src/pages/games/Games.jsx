import { useContext, useEffect, useState } from 'react';
import { TerminalContext } from './../../context/TerminalContext';
import { Link } from 'react-router-dom';
import './games.css';
import Modal from '../../utils/Modal';

export default function Games() {
  const { updateCommand } = useContext(TerminalContext);
  const cagematch = './cagematch_assets/images/cage-preview.jpg';
  const triva = './images/trivia-preview.jpg';
  const storybot = './images/storybot-preview.jpg';
  const [modalContent, setModalContent] = useState(null);
  const [openModal, setOpenModal] = useState(null);
  // useEffect(() => {
  //   updateCommand('games');
  // }, []);

  const aboutCage = () => {
    return (
      <div className='description'>
        <p>
          This is a little matching game and an example of myself really rolling
          with a bad punny idea. It was a fun exercise working with arrays and
          React's state management.
        </p>
        <p className='game-link'>
          <Link to='/cagematch'>Play the game!</Link>
        </p>
      </div>
    );
  };
  const aboutJeopardy = () => {
    return (
      <div className='description'>
        <p>
          This uses the API:{' '}
          <a href='https://jservice.io/' rel='noreferrer' target='_blank'>
            jService
          </a>{' '}
          which has over 200,000 Trivia questions from decades of Jeopardy.
        </p>
        <p>
          This first version I built on a Saturday afternoon to work like the
          beloved game show if there was only one contestant.
        </p>
        <p>
          This was an interesting project and I learned about using fuzzy logic
          to check the typed answers match with the answer from the API.
          Currently set at 70% match it allows for spelling errors but there is
          still some luck involved in getting the match.
        </p>
        <p>
          This is a fun API and I plan on doing more with this project. Future
          updates will be to make it mobile freindly and add a leadereboard and
          final jeopardy where you can bet it all!
        </p>
        <p className='game-link'>
          <Link to='/trivia'>Play the game!</Link>
        </p>
      </div>
    );
  };
  const aboutStorybot = () => {
    return (
      <div className='description'>
        <p>
          This was a challenging one, I wanted to play around with the voice
          synthesizer built into our computers and have it read a story Mad Libs
          style. There are 21 different voices and controls to change the speed
          and pitch. You can make experiment with the settings and get some fun
          voices. To test it out it reads random tounge twisters. This does not
          work on phones at all, I got a little carried away with the UI.
          Simpler version for phones coming soon.
        </p>
        <p className='game-link'>
          <Link to='/storytime'>Play the game!</Link>
        </p>
      </div>
    );
  };
  function handleModalOpen(content) {
    setOpenModal(true);
    setModalContent(content);
  }

  function handleModalClose() {
    setModalContent(null);
    setOpenModal(false);
  }
  return (
    <>
      <div className='container'>
        <h1 className='games'>GAMES</h1>
        <p>
          Here are some projects I built for learning and practice. They are a
          little rough, and not great on phones, but hopefully provide a little
          fun. My goal is to make at least one a month for 2023. Check on the
          blog for more information about how they were built. Enjoy!
        </p>
        <div className='gamegrid'>
          <div className='game'>
            {/* <div className='title'>Cagematch</div> */}

            <img
              onClick={() => {
                handleModalOpen(aboutCage);
              }}
              src={cagematch}
              alt='Title screen for cagematch'
            />
          </div>
          <div className='game'>
            {/* <div className='title'>Trivia Game</div> */}

            <img
              onClick={() => {
                handleModalOpen(aboutJeopardy);
              }}
              src={triva}
              alt='Title screen for trivia game'
            />
          </div>{' '}
          <div className='game'>
            <img
              onClick={() => {
                handleModalOpen(aboutStorybot);
              }}
              src={storybot}
              alt='Title screen for storybot'
            />
          </div>
        </div>
      </div>
      {openModal && (
        <Modal open={true} onClose={handleModalClose}>
          {modalContent}
        </Modal>
      )}
    </>
  );
}

import { useContext, useEffect, useRef, useState } from 'react';

import { TerminalContext } from '../../context/TerminalContext';
import curses from 'profane-words';
import {
  About,
  CurseResponse,
  Deep,
  Directions,
  Egg,
  Games,
  Help,
  Monty,
  TheInfo,
  NoMatch,
  Projects,
} from './commands/index';

import Social from '../social/Social';
import Wordpress from './../wordpress/Wordpress';
import GetFortune from '../../commands/fortune';
import { FetchLatestPost } from '../posts/FetchLatestPost';
import { TerminalPosts } from '../posts/TerminalPosts';
import TerminalTetris from '../tetris/TerminalTetris';
import TerminalSnake from '../snake/TerminalSnake';
import Matrix from '../matrix/Matrix';
import Hacking from '../hacking/Hacking';
import FalloutGame from '../fallout/FalloutGame';
import CageMatch from '../cagematch/CageMatch';

export default function Terminal(props) {
  const { command, updateCommand, inputRef, clearInput, gameMode } =
    useContext(TerminalContext);
  const [enter, setEnter] = useState(false);

  const { output, setOutput, viewPrompt, power } = props;

  const handleKeys = (e) => {
    let code = e.keyCode;
    switch (code) {
      case 13:
        e.preventDefault();
        let typed = e.target.textContent.toLowerCase();
        //    e.target.innerHTML = '';
        clearInput();
        setOutput('');
        updateCommand(typed);
        setEnter(true);
        break;
      default:
      // console.log('something else');
    }
  };
  useEffect(() => {
    if (!command) return;

    if (curses.includes(command)) {
      return setOutput(CurseResponse);
    } else {
      switch (command) {
        case 'about':
        case 'zac':
          setOutput(About);
          break;
        case 'clear':
          setOutput('');
          break;
        case 'n':
        case 'north':
        case 'e':
        case 'east':
        case 'w':
        case 'west':
        case 's':
        case 'south':
        case 'ne':
        case 'up':
        case 'down':
        case 'nw':
        case 'se':
        case 'sw':
        case 'u':
        case 'd':
        case 'l':
        case 'look':
          setOutput(Directions);
          break;
        case 'deep':
        case 'deep thoughts':
        case 'deepthoughts':
        case 'thoughts':
          setOutput(Deep);
          break;
        case 'fortune':
          setOutput(<GetFortune />);
          break;
        case 'help':
        case '?':
        case 'command':
        case 'commands':
        case 'cmd':
          setOutput(Help);
          break;
        case 'contact':
        case 'hi':
        case 'hello':
        case 'howdy':
          setOutput(Social);
          break;
        case 'i':
        case 'gleick':
        case 'info':
        case 'information':
          setOutput(TheInfo);
          break;
        case 'latest':
          setOutput(<FetchLatestPost />);
          break;
        case 'posts':
        case 'allposts':
        case 'blog':
          setOutput(<TerminalPosts />);
          break;
        case 'matrix':
        case 'neo':
        case 'redpill':
          setOutput(<Matrix />);
          break;
        case 'hack':
        case 'hacking':
        case 'hackerman':
        case 'hackers':
          setOutput(<Hacking />);
          break;
        case 'password':
        case 'fallout':
        case 'robco':
          setOutput(<FalloutGame />);
          break;
        case 'cagematch':
        case 'cage':
        case 'cards':
        case 'match':
          setOutput(<CageMatch />);
          break;
        case 'tetris':
          setOutput(<TerminalTetris />);
          break;
        case 'snake':
          setOutput(<TerminalSnake />);
          break;
        case 'game':
        case 'games':
          setOutput(<Games />);
          break;
        case 'egg':
        case 'eggs':
          setOutput(<Egg />);
          break;
        case 'monty':
        case 'python':
        case 'spam':
          setOutput(<Monty />);
          break;
        case 'photo':
        case 'photos':
        case 'photography':
        case 'fp':
          setOutput(<Wordpress />);
          break;
        case 'project':
        case 'projects':
        case 'portfolio':
          setOutput(<Projects />);
          break;

        default:
          setOutput(NoMatch);
      }
    }
    setEnter(false);
    console.log('COMMAND CHANGED ', command);
  }, [command, enter, setOutput]);

  const monitorClickHandler = () => {
    // click anywhere to focus on the input (but not in game mode)
    if (gameMode) return;
    console.log(inputRef.current);
    inputRef.current && inputRef.current.focus();
  };
  return (
    <div
      onClick={monitorClickHandler}
      className={`terminal ${!power && 'terminal-off'} ${gameMode && 'game-mode'}`}
    >
      <div id="targetOutput" className={`new-scroll ${gameMode ? 'game-active' : ''}`}>
        {output} <div className="scanline"></div>
      </div>
      {viewPrompt && !gameMode && (
        <div className="input-container">
          <span
            className="terminal-input"
            contentEditable="true"
            suppressContentEditableWarning={true}
            onKeyDown={(e) => handleKeys(e)}
            ref={inputRef}
          ></span>
        </div>
      )}
    </div>
  );
}

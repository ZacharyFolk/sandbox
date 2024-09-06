import { useContext, useEffect, useRef, useState } from 'react';

import { TerminalContext } from '../../context/TerminalContext';
import curses from 'profane-words';
import {
  About,
  CurseResponse,
  Deep,
  Directions,
  Help,
  TheInfo,
  NoMatch,
  InitialText,
  Projects,
} from './Commands';

import Social from '../social/Social';
import Wordpress from './../wordpress/Wordpress';
import { Box } from '@mui/material';
import GetFortune from '../../commands/fortune';
import { FetchLatestPost } from '../posts/FetchLatestPost';
import Portfolio from '../projects/Portfolio';

export default function Terminal(props) {
  const { command, updateCommand, inputRef, clearInput } =
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
        case 'init':
          setOutput(InitialText);
          break;
        case 'latest':
        case 'blog':
          setOutput(<FetchLatestPost />);
          break;
        // case 'allposts':
        //   setOutput(<Blog />);
        //   break;
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
    // click anywhere to focus on the input
    console.log(inputRef.current);
    inputRef.current && inputRef.current.focus();
  };
  return (
    <Box
      sx={{ display: 'flex', flexDirection: 'column' }}
      onClick={monitorClickHandler}
      className={`new-scroll terminal ${!power && 'terminal-off'}`}
    >
      <div id="targetOutput">
        {' '}
        {output} <div className="scanline"></div>
      </div>
      {viewPrompt && (
        <span
          className="terminal-input"
          contentEditable="true"
          suppressContentEditableWarning={true}
          onKeyDown={(e) => handleKeys(e)}
          ref={inputRef}
        ></span>
      )}
    </Box>
  );
}

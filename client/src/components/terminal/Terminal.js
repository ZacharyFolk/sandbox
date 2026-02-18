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
  Hitchhiker,
  Help,
  History,
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
import HitchhikerGame from './commands/HitchhikerGame';
import Tralfamadore from './commands/Tralfamadore';
import Roguelike from './commands/Roguelike';
import Labyrinth from './commands/Labyrinth';
import ConwayLife from './commands/ConwayLife';
import WordleGame from './commands/WordleGame';
import HangmanGame from './commands/HangmanGame';

const HISTORY_KEY = 'folk_terminal_history';
const MAX_HISTORY = 200;

const loadHistory = () => {
  try {
    return JSON.parse(localStorage.getItem(HISTORY_KEY)) || [];
  } catch { return []; }
};

const saveHistory = (history) => {
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history.slice(-MAX_HISTORY)));
  } catch {}
};

export default function Terminal(props) {
  const { command, updateCommand, inputRef, updateInput, clearInput, gameMode, setScreensaver, setScreensaverType } =
    useContext(TerminalContext);
  const [enter, setEnter] = useState(false);
  const historyRef = useRef(loadHistory());
  const historyIndexRef = useRef(-1);
  const savedInputRef = useRef('');

  const { output, setOutput, viewPrompt, power } = props;

  const handleKeys = (e) => {
    let code = e.keyCode;
    switch (code) {
      case 13: {
        e.preventDefault();
        let typed = e.target.textContent.toLowerCase();
        if (typed.trim()) {
          historyRef.current.push(typed.trim());
          saveHistory(historyRef.current);
        }
        historyIndexRef.current = -1;
        savedInputRef.current = '';
        clearInput();
        setOutput('');
        updateCommand(typed);
        setEnter(true);
        break;
      }
      case 38: {
        // Up arrow — navigate backward through history
        e.preventDefault();
        const history = historyRef.current;
        if (!history.length) break;
        if (historyIndexRef.current === -1) {
          savedInputRef.current = e.target.textContent || '';
          historyIndexRef.current = history.length - 1;
        } else if (historyIndexRef.current > 0) {
          historyIndexRef.current--;
        }
        updateInput(history[historyIndexRef.current]);
        break;
      }
      case 40: {
        // Down arrow — navigate forward through history
        e.preventDefault();
        const history = historyRef.current;
        if (historyIndexRef.current === -1) break;
        if (historyIndexRef.current < history.length - 1) {
          historyIndexRef.current++;
          updateInput(history[historyIndexRef.current]);
        } else {
          historyIndexRef.current = -1;
          updateInput(savedInputRef.current);
        }
        break;
      }
      default:
        // Reset history browsing position on any other key
        if (historyIndexRef.current !== -1) {
          historyIndexRef.current = -1;
        }
    }
  };
  useEffect(() => {
    if (!command) return;

    // Screensaver picker: ss <name>
    if (command.startsWith('ss ') || command.startsWith('screensaver ')) {
      const name = command.split(' ').slice(1).join(' ').trim();
      if (name === 'help' || name === '?') {
        setOutput(
          <pre className="nasa-report">{`
╔══════════════════════════════════════════════════════════════╗
║           ██  SCREENSAVER — SUBSYSTEM GUIDE  ██              ║
║                  FOLK.CODES TERMINAL  MK-II                  ║
╠══════════════════════════════════════════════════════════════╣
║                                                              ║
║   USAGE:   ss <name>   or   screensaver <name>               ║
║                                                              ║
║   ┌──────────────────────────────────────────────────┐       ║
║   │  dvd ............ DVD LOGO BOUNCE                │       ║
║   │  stars .......... STARFIELD WARP                 │       ║
║   │  pipes .......... 3D PIPES                       │       ║
║   │  aquarium ....... FISH TANK                      │       ║
║   │  toasters ....... FLYING TOASTERS                │       ║
║   │  slideshow ...... FOLK PHOTOGRAPHY GALLERY       │       ║
║   └──────────────────────────────────────────────────┘       ║
║                                                              ║
║   ALIASES:  fish = aquarium,  photos/gallery = slideshow     ║
║             starfield = stars                                 ║
║                                                              ║
║   TYPE  ss  WITH NO ARGUMENT FOR RANDOM SCREENSAVER.         ║
║   PRESS ANY KEY OR CLICK TO DISMISS ACTIVE SCREENSAVER.      ║
║                                                              ║
║   *** SCREENSAVER SUBSYSTEM — NOMINAL ***                    ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝
`}</pre>
        );
        return;
      }
      const valid = ['dvd', 'stars', 'starfield', 'pipes', 'aquarium', 'fish', 'slideshow', 'photos', 'gallery', 'toasters', 'toast'];
      if (valid.includes(name)) {
        setScreensaverType(name);
        setScreensaver(true);
        return;
      }
    }

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
        case 'screensaver':
        case 'ss':
          setScreensaverType(null);
          setScreensaver(true);
          break;
        case 'hitchhiker':
        case 'hhgttg':
        case 'douglas':
        case 'adams':
          setOutput(<Hitchhiker />);
          break;
        case '42':
        case 'adventure':
        case 'hhg':
        case 'zaphod':
        case 'dont panic':
        case "don't panic":
        case 'text adventure':
          setOutput(<HitchhikerGame />);
          break;
        case 'egg':
        case 'eggs':
          setOutput(<Egg />);
          break;
        case 'pooteweet':
        case 'soitgoes':
        case 'tralfamadore':
        case 'unstuck':
        case 'vonnegut':
        case 'kilgore':
          setOutput(<Tralfamadore />);
          break;
        case 'rogue':
        case 'roguelike':
        case 'crawl':
        case 'delve':
        case 'descend':
          setOutput(<Roguelike />);
          break;
        case 'labyrinth':
        case 'maze':
        case 'wolfenstein':
        case '3d':
          setOutput(<Labyrinth />);
          break;
        case 'codeword':
        case 'wordle':
        case 'word':
        case 'guess':
          setOutput(<WordleGame />);
          break;
        case 'hangman':
        case 'hang':
        case 'gallows':
          setOutput(<HangmanGame />);
          break;
        case 'history':
          setOutput(<History history={historyRef.current} />);
          break;
        case 'life':
        case 'conway':
        case 'gol':
        case 'gameoflife':
          setOutput(<ConwayLife />);
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

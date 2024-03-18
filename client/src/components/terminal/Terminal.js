import { useContext, useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Context } from '../../context/Context';
import { TerminalContext } from '../../context/TerminalContext';
import curses from 'profane-words';
import {
  CageTips,
  CurseResponse,
  Deep,
  Directions,
  Games,
  Help,
  Hello,
  TheInfo,
  Jeopardy,
  NoMatch,
  InitialText,
} from './Commands';
import { Box } from '@mui/material';
import GetFortune from '../../commands/fortune';
export default function Terminal(props) {
  const { command, updateCommand } = useContext(TerminalContext);
  const [enter, setEnter] = useState(false);
  const inputRef = useRef();
  const { output, setOutput, viewPrompt, power } = props;

  const { user } = useContext(Context);
  // const [command, setCommand] = useState('');
  // const [output, setOutput] = useState(initialText);

  const navigate = useNavigate();
  function redirectAbout() {
    navigate('about');
  }

  // useEffect(() => {
  //   console.log('LOCATION CHANGED!');
  //   console.log(location.pathname);
  //   if (location.pathname === '/about') {
  //     setOutput('');
  //     setOutput(AboutLoaded);
  //     console.log('ABOUT PAGE!');
  //   } else {
  //     setOutput(initialText);
  //   }
  // }, [location]);
  // const AboutLoaded = () => {
  //   return (
  //     <Typist typingDelay={5}>
  //       <p>Initializing data retrieval for Zachary Folk....</p>
  //       <Typist.Delay ms={500} />
  //     </Typist>
  //   );
  // };

  const handleKeys = (e) => {
    // let len = this.keys.length;
    // this.setState({ number: Math.floor(Math.random() * len) });
    // new Audio(this.keys[this.state.number]).play();
    // console.log(e.keyCode);
    // console.log('from handleKeys');

    // console.log(this.props.parseIt);

    let code = e.keyCode;
    switch (code) {
      case 13:
        e.preventDefault();
        let typed = e.target.textContent.toLowerCase();
        e.target.innerHTML = '';
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
    }

    switch (command) {
      case 'home':
        navigate('/');
        break;
      case 'about':
        redirectAbout();
        break;
      case 'cage':
      case 'cagematch':
        navigate('cagematch');
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
      case 'games':
        setOutput(Games);
        break;
      case 'help':
      case '?':
      case 'contact':
      case 'command':
      case 'commands':
      case 'cmd':
        setOutput(Help);
        break;
      case 'hi':
      case 'hello':
      case 'howdy':
        setOutput(Hello);
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
      case 'login':
        navigate('/login/');
        break;
      case 'trivia':
      case 'jeopardy':
        navigate('/trivia');
        break;
      case 'trivia-intro':
        setOutput(Jeopardy);
        break;
      case 'madlibs':
      case 'story':
      case 'storytime':
      case 'storybot':
        navigate('/storytime');
        break;
      case 'cage1':
        setOutput(<CageTips num={0} />);
        break;
      case 'cage2':
        setOutput(<CageTips num={1} />);
        break;
      case 'cage3':
        setOutput(<CageTips num={2} />);
        break;
      case 'cage4':
        setOutput(<CageTips num={3} />);
        break;
      case 'cage5':
        setOutput(<CageTips num={4} />);
        break;
      case 'cage6':
        setOutput(<CageTips num={5} />);
        break;
      case 'cage7':
        setOutput(<CageTips num={6} />);
        break;
      default:
        setOutput(NoMatch);
    }
    setEnter(false);
    console.log('COMMAND CHANGED ', command);
  }, [command, enter]);

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
      <div id="targetOutput"> {output} </div>
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

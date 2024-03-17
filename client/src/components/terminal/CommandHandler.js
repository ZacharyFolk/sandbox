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
  Fortune,
} from './Commands';
import { useNavigate } from 'react-router-dom';

export const CommandHandler = (props) => {
  const navigate = useNavigate();

  const { command, setOutput, setEnter } = props;
  function redirectAbout() {
    navigate('about');
  }

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
      setOutput(Fortune);
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
};

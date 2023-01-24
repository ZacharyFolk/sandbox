import { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Context } from '../../context/Context';
import { TerminalContext } from '../../context/TerminalContext';
import curses from 'profane-words';
import {
  About,
  CageTips,
  CurseResponse,
  Directions,
  Help,
  Hello,
  TheInfo,
  Games,
  NoMatch,
} from './Commands';
export default function Terminal(props) {
  const { command, updateCommand } = useContext(TerminalContext);

  const { output, setOutput } = props;

  const { user } = useContext(Context);
  // const [command, setCommand] = useState('');
  // const [output, setOutput] = useState(initialText);

  const navigate = useNavigate();
  // function redirectAbout() {
  //   navigate('about');
  // }

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
        props.setOutput('');
        updateCommand(typed);
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
        window.location.replace('/');
        break;
      case 'about':
        setOutput(About);
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
      case 'gleick':
      case 'info':
      case 'information':
        setOutput(TheInfo);
      case 'login':
        window.location.replace('/login/');
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
    console.log('COMMAND CHANGED ', command);
  }, [command]);

  return (
    <>
      <div className='header'>
        <div className='header-container'>
          <div className='terminal'>
            <span
              className='terminal-input'
              contentEditable='true'
              suppressContentEditableWarning={true} // yea I know what I am doing 😜
              onKeyDown={(e) => handleKeys(e)}
            ></span>
          </div>

          <div className='tools'>
            <Link to='/'>
              <i className='fa-solid fa-house'></i>
            </Link>
            {/* <Link to='/about'>
              <i className='fa-solid fa-circle-question'></i>
            </Link> */}
            <Link to='/blog'>
              <i className='fa-solid fa-feather'></i>
            </Link>
            <Link to='/games'>
              <i className='fa-solid fa-dice'></i>
            </Link>
            {user && (
              <Link to='/write'>
                <i className='fa-solid fa-user-secret'></i>
              </Link>
            )}
          </div>
        </div>
      </div>
      <div className='terminalWindow'>
        <div id='targetOutput'>
          <div id='textContainer' className='new-scroll'>
            {output}
          </div>
        </div>
      </div>
    </>
  );
}

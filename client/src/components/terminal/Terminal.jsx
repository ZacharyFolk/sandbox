import { useContext, useState, useEffect, createRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Context } from '../../context/Context';

import { TerminalContext } from '../../context/TerminalContext';
import Typist from 'react-typist-component';
import { CageTips, Directions, Help, Look, NoMatch } from './Commands';
import Cagematch from '../cagematch/Cagematch';
export default function Terminal(props) {
  const location = useLocation();

  const { command, updateCommand } = useContext(TerminalContext);
  const initialText = () => {
    return (
      <Typist typingDelay={100}>
        <h1 className='main-heading'> **** ZACS WEBSITE BASIC V 0.1 ****</h1>
      </Typist>
    );
  };
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

  const About = () => {
    // TODO : Figure out how too get this to work in separate component
    // navigate function is just ignored in Commands.jsx, no errors, nothing
    // maybe could get it to run in a useEffect in there but I had no luck
    return (
      <Typist
        typingDelay={50}
        cursor={<span className='cursor'>|</span>}
        onTypingDone={redirectAbout}
      >
        <p>Accessing data for more information about Zac</p>
        <Typist.Delay ms={10} />
      </Typist>
    );
  };

  const Hello = () => {
    return <p>Oh hi! Thanks for stopping by.</p>;
  };

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
    switch (command) {
      case 'home':
        window.location.replace('/');
        break;
      case 'about':
      case 'zac':
        props.setOutput(About);
        break;
      case 'clear':
        props.setOutput('');
        break;
      case 'n':
      case 'e':
      case 'w':
      case 's':
      case 'ne':
      case 'nw':
      case 'se':
      case 'sw':
      case 'u':
      case 'd':
        props.setOutput(Directions);
        break;
      case 'help':
      case '?':
      case 'contact':
        props.setOutput(Help);
        break;
      case 'hi':
      case 'hello':
      case 'howdy':
        props.setOutput(Hello);
        break;
      case 'l':
      case 'look':
        props.setOutput(Look);
        break;
      case 'login':
        window.location.replace('/login/');
        break;
      case 'cage1':
        props.setOutput(<CageTips num={0} />);
        break;
      case 'cage2':
        props.setOutput(<CageTips num={1} />);
        break;
      case 'cage3':
        props.setOutput(<CageTips num={2} />);
        break;
      case 'cage4':
        props.setOutput(<CageTips num={3} />);
        break;
      case 'cage5':
        props.setOutput(<CageTips num={4} />);
        break;
      case 'cage6':
        props.setOutput(<CageTips num={5} />);
        break;
      case 'cage7':
        props.setOutput(<CageTips num={6} />);
        break;
      default:
        props.setOutput(NoMatch);
    }
    //  console.log('COMMAND CHANGED ', command);
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
            <Link to='/about'>
              <i className='fa-solid fa-circle-question'></i>
            </Link>
            {user && (
              <a href='/write'>
                <i className='fas fa-feather'></i>
              </a>
            )}
            {/* <i className='fas fa-terminal'></i> */}
          </div>
        </div>
      </div>
      <div className='terminalWindow'>
        <div id='targetOutput'>
          <div id='textContainer' className='new-scroll'>
            {props.output}
          </div>
        </div>
      </div>
    </>
  );
}

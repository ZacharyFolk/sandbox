import { useContext, useState, useEffect, createRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Context } from '../../context/Context';
import Typist from 'react-typist-component';
import { Help, Look } from './Commands';
import Cagematch from '../cagematch/Cagematch';
export default function Terminal() {
  const initialText = () => {
    //  cursor={<span className='cursor'>|</span>}
    return (
      <Typist typingDelay={100}>
        <h1 className='main-heading'> **** ZACS WEBSITE BASIC V 0.1 ****</h1>
      </Typist>
    );
  };
  const { user } = useContext(Context);
  const [command, setCommand] = useState('');
  const [output, setOutput] = useState(initialText);
  const target = createRef();
  const navigate = useNavigate();
  function redirectAbout() {
    navigate('about');
  }
  const About = () => {
    // TODO : Figure out how too get this to work in separate component
    // navigate function is just ignored in Commands.jsx, no errors, nothing
    // maybe could get it to run in a useEffect in there but I had no luck
    return (
      <Typist
        typingDelay={5}
        cursor={<span className='cursor'>|</span>}
        onTypingDone={redirectAbout}
      >
        <p>Loading . . . . . . . . .</p>
        <Typist.Delay ms={500} />
      </Typist>
    );
  };
  const NoMatch = () => {
    const nopeArray = [
      "I'm sorry, Dave. I'm, afraid I can't do that.",
      'Nope.',
      'That is not something I recognize.',
      'The longest word in the English language, according to the Guinness Book of World Records, is pneumonoultramicroscopicsilicovolcanoconiosis.',
      'The only continent without native reptiles or snakes is Antarctica.',
      "The world's largest snowflake on record was 15 inches wide and 8 inches thick.",
      'In ancient Rome, it was considered a sign of leadership to be born with a crooked nose.',
      'The first known contraceptive was crocodile dung, used by ancient Egyptians.',
      'A group of hedgehogs is called a prickle.',
      'A baby octopus is about the size of a flea when it is born.',
      'Giraffes can go for weeks without drinking water because they get most of their hydration from the plants they eat.',
      "The Great Barrier Reef, the world's largest coral reef system, can be seen from space.",
      'The shortest war in history was between Britain and Zanzibar on August 27, 1896. Zanzibar surrendered after 38 minutes.',
      'The tallest tree on record was a coast redwood in California that was 379.1 feet tall.',
      "The word 'queue' is the only word in the English language with five consecutive vowels.",
      'The lifespan of a single taste bud is about 10 days.',
      "The word 'queue' is the only word in the English language with five consecutive vowels.",
      'The longest wedding veil was over 7 miles long.',
      "The world's largest snowflake fell in Montana in 1887 and was 15 inches wide and 8 inches thick.",
    ];

    let num = Math.floor(Math.random() * nopeArray.length + 1);

    return (
      <Typist typingDelay={10}>
        <p>{nopeArray[num]}</p>
      </Typist>
    );
  };

  const Hello = () => {
    return (
      <Typist typingDelay={50} cursor={<span className='cursor'> | </span>}>
        <p>Oh hi! Thanks for stopping by.</p>
      </Typist>
    );
  };

  const Direction1 = () => {
    return (
      <Typist typingDelay={50} cursor={<span className='cursor'>|</span>}>
        This is a forest, with trees in all directions. To the east, there
        appears to be sunlight.
      </Typist>
    );
  };
  const Direction2 = () => {
    return (
      <Typist typingDelay={50} cursor={<span className='cursor'>|</span>}>
        You aare in a small clearing in a well marked forest path that extends
        to the east and west.
      </Typist>
    );
  };
  const Direction3 = () => {
    return (
      <Typist typingDelay={50} cursor={<span className='cursor'>|</span>}>
        It is pitch black. You are likely to be eaten by a grue.
      </Typist>
    );
  };
  const Direction4 = () => {
    return (
      <Typist typingDelay={50} cursor={<span className='cursor'>|</span>}>
        Yes! You did it! You found a chest full of infinite riches, saved the
        princess, and have rehabilitated to the dragon to be your best friend.
        Oh and invincibility armor. Now stop typing directions already!!
      </Typist>
    );
  };
  const DirArr = [Direction1, Direction2, Direction3];
  const getDirections = () => {
    let num = Math.floor(Math.random() * DirArr.length + 1);
    // instead of switch here could just do something like this?
    // let componentName = 'Direction' + num;
    switch (num) {
      case 1:
        setOutput(Direction1);
        break;
      case 2:
        setOutput(Direction2);
        break;
      case 3:
        setOutput(Direction3);
        break;
      case 4:
        setOutput(Direction4);
        break;
      default:
        setOutput('');
    }
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
        setOutput('');
        setCommand(typed);
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
        setOutput(About);
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
        getDirections();
        break;
      case 'help':
      case '?':
      case 'contact':
        setOutput(Help);
        break;
      case 'hi':
      case 'hello':
      case 'howdy':
        setOutput(Hello);
        break;
      case 'l':
      case 'look':
        setOutput(Look);
        break;
      case 'login':
        window.location.replace('/login/');
        break;
      default:
        setOutput(NoMatch);
    }
    setCommand('');
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
        <div id='targetOutput' ref={target}>
          <div id='textContainer' className='new-scroll'>
            {output}
          </div>
        </div>
      </div>
    </>
  );
}

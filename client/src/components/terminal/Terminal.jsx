import {
  useContext,
  useState,
  useEffect,
  createRef,
  createElement,
} from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Context } from '../../context/Context';
import Typist from 'react-typist-component';
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
  const MyComponent = () => {
    return (
      <Typist typingDelay={100} cursor={<span className='cursor'>|</span>}>
        This is a typo
        <br />
        <Typist.Backspace count={5} />
        <Typist.Delay ms={1500} />
        react component
        <Typist.Paste>
          <div>
            use
            <div>deeper div</div>
          </div>
        </Typist.Paste>
      </Typist>
    );
  };

  function redirectAbout() {
    navigate('about');
    // window.location.replace('/about/');
  }

  const NoMatch = () => {
    return (
      <Typist>
        <p>I'm sorry.. I can't do that.</p>
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

  const AboutType = () => {
    return (
      <Typist
        typingDelay={50}
        cursor={<span className='cursor'>|</span>}
        onTypingDone={redirectAbout}
      >
        Loading Zac's Bio . . . . .
        <Typist.Delay ms={500} />
      </Typist>
    );
  };

  const Help = () => {
    return (
      <Typist typingDelay={50} cursor={<span className='cursor'>|</span>}>
        I am here to help! Contact me and let me know what I can do for you.
        <br /> You can reach out to zacharyfolk@gmail.com or give me call @
        206.714.5203.
      </Typist>
    );
  };

  const Look = () => {
    return (
      <Typist typingDelay={50} cursor={<span className='cursor'>|</span>}>
        This is a path winding through a dimly lit forest. The path leads
        north-south here. One particularly large tree with some low branches
        stands at the edge of the path.
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
        Yes! You did it! You found a chest and it has like 5000 gold and the
        coolest sword that you have ever seen glowing with an unknown power. Oh
        and invincibility armor. Ok are you satisfied?W Now stop typing
        directions already!!
      </Typist>
    );
  };

  const DirArr = [Direction1, Direction2, Direction3];
  const getDirections = () => {
    let num = Math.floor(Math.random() * DirArr.length + 1);
    console.log(num);
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
      default:
        setOutput(initialText);
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

        //  e.target.setAttribute('contenteditable', false);
        // this.setState({ userinput: typed }, function () {
        //   let string = this.state.userinput;

        //   let command = string.toLowerCase();

        //   this.commander(command);
        // });
        // console.log(this.state.userinput); // Can not use immediately so why need callback ^
        console.log('pressed enter');
        setOutput('');
        setCommand(typed);
        console.log('typed: ', typed);

        break;
      default:
      // console.log('soomething else');
    }
  };

  useEffect(() => {
    switch (command) {
      case 'home':
        window.location.replace('/');
        break;
      case 'about':
      case 'zac':
        setOutput(AboutType);
        break;
      case 'n':
      case 'e':
      case 'w':
      case 's':
      case 'ne':
      case 'nw':
      case 'se':
      case 'sw':
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
      <div className='container'>
        <div id='targetOutput' className='new-scroll' ref={target}>
          {output}
        </div>
      </div>
    </>
  );
}

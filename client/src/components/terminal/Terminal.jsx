import { useContext, useState, useEffect, createRef } from 'react';
import { Link } from 'react-router-dom';
import { Context } from '../../context/Context';
import Typist from 'react-typist-component';
export default function Terminal() {
  const initialText = () => {
    //  cursor={<span className='cursor'>|</span>}
    return (
      <Typist typingDelay={100}>
        <h1 className='main-heading'> **** ZACS WEBSITE BASIC V 0.1 ****</h1>
        <br />
      </Typist>
    );
  };
  const { user } = useContext(Context);
  const [command, setCommand] = useState('');
  const [getOutput, setOutput] = useState(initialText);
  const target = createRef();

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
  const Help = () => {
    return (
      <Typist typingDelay={50} cursor={<span className='cursor'>|</span>}>
        I am here to help! Contact me and let me know what I can do for you.
        <br /> You can reach out to zacharyfolk@gmail.com or give me call @
        206.714.5203.
      </Typist>
    );
  };

  const handleKeys = (e) => {
    // let len = this.keys.length;
    // this.setState({ number: Math.floor(Math.random() * len) });
    // new Audio(this.keys[this.state.number]).play();
    console.log(e.keyCode);
    console.log('from handleKeys');

    // console.log(this.props.parseIt);

    let code = e.keyCode;
    switch (code) {
      case 13:
        e.preventDefault();
        let typed = e.target.textContent;
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

        break;
      default:
        console.log('soomething else');
    }
  };

  useEffect(() => {
    switch (command) {
      case 'home':
        window.location.replace('/');
        break;
      case 'about':
      case 'zac':
        // window.location.replace('/about/');

        setOutput(MyComponent);
        //  setOutput('<h1>Oh wow</h1>');
        break;
      case 'help':
      case '?':
      case 'contact':
        setOutput(Help);
        break;
      case 'login':
        window.location.replace('/login/');
        break;
      default:
        console.log('neat');
    }
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
          {getOutput}
        </div>
      </div>
    </>
  );
}

import { useContext, useState, useEffect, createRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Context } from '../../context/Context';
import Typist from 'react-typist-component';
// import { Directions, Help, Look, NoMatch } from './Commands';
import { TerminalContext } from '../../context/TerminalContext';
import Cagematch from '../cagematch/Cagematch';
export default function Terminal(props) {
  const location = useLocation();

  const initialText = () => {
    return (
      <Typist typingDelay={100}>
        <h1 className='main-heading'> **** ZACS WEBSITE BASIC V 0.1 ****</h1>
      </Typist>
    );
  };
  const { user } = useContext(Context);
  // const [command, setCommand] = useState('');
  // const [out, setOut] = useState(props.out);
  const { command, updateCommand, output, updateOutput, dispatch } =
    useContext(TerminalContext);

  // const { command, updateCommand, output, updateOutput } = props;

  const ouputEl = createRef();
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

  const Directions = () => {
    const directionsArray = [
      'You find yourself in a deep tropical forest, surrounded by towering trees and the sounds of exotic birds and animals. The air is thick with humidity and the scent of flowers and herbs.',
      'As you walk further into the forest, you come across the Crystal Caves of Naica. The entrance is hidden behind a curtain of vines, and as you push them aside, you are met with a breathtaking sight.',
      'You reach the edge of the cliff, in front of  you there are giant selenite crystals that jut out of the walls and ceiling, glinting in the dim light. Some of them are so large that you can barely wrap your arms around them.',
      'You continue your journey and come across the Rainbow Mountains of Zhangye Danxia. The multi-colored sandstone layers create a stunning rainbow effect that stretches as far as the eye can see. You stand in awe, wondering how such a natural wonder could exist.',
      'You come across the Great Blue Hole of Balzia. The deep blue water is almost hypnotic as it swirls around the massive underwater sinkhole. There is a tiny boat just outside the edge of the whirlpool.',
      "You decide to take a break and rest at the Wave, a sandstone rock formation with towering red and orange striped cliffs. As you sit and admire the view, you can't help but feel small in the face of such natural beauty.",
      'Continuing on your journey, you come across the Marble Caves of Chile Chico. The intricate marble caves can only be accessed by boat, and as you glide through the cool, clear water, you are struck by the beauty of the swirling patterns in the marble.',
      'You come across the Hang Son Doong Cave, the largest cave in the world.  The ceiling towers over 500 feet above you and the cave stretches on for nearly 5 miles. You feel like you have stepped into another world.',
      "As you enter the forest, the sun is completely blocked by the dense canopy of tall, dark trees and a quiet darkness surrounds you. The air is cool and still, and you can't shake the feeling of being watched.",
      'It is pitch black. You are likely to be eaten by a grue.',
      ' You are in a small clearing in a well marked forest path that extends to the east and west.',
      'This is a forest, with trees in all directions. To the east, there appears to be sunlight.',
      'A rabbit runs out as you round the corner and you notice a glint of silver in the grass behind the large tree. The tree is massive and the bark starts to resemble a face as the arm like branches move swiftly to block your path.',
    ];

    console.log(ouputEl);
    let num = Math.floor(Math.random() * directionsArray.length);

    return <p>{directionsArray[num]}</p>;
  };
  const Help = () => {
    return (
      <Typist>
        <p>
          Type <em>commands</em> to see some other things you can try. (Hint:
          There is no bad input, just maybe not the output you expected.)
        </p>
        <p>
          Type <em>about</em> to connect with me or click the ❔ in the upper
          right corner.
        </p>
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
  const NoMatch = () => {
    const nopeArray = [
      "I'm sorry, Dave. I'm, afraid I can't do that.",
      'Nope.',
      'That is not something I recognize.',
      'The oldest known color photograph was taken in 1861 by James Clerk Maxwell.',
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
      'The average person spends about 5 years of their life dreaming.',
      'The skin of a dolphin is about 10 times thicker than that of a human.',
      'The longest wedding veil was over 7 miles long.',
      'The lifespan of a single taste bud is about 10 days.',
      'The fingerprints of Koalas are so similar to humans that they have on occasions been confused at crime scenes.',
      "The world's largest snowflake fell in Montana in 1887 and was 15 inches wide and 8 inches thick.",
      'The shortest war in history was between Britain and Zanzibar on August 27, 1896. Zanzibar surrendered after 38 minutes.',
    ];
    let num = Math.floor(Math.random() * nopeArray.length);
    return (
      <Typist typingDelay={10}>
        <p>{nopeArray[num]}</p>
      </Typist>
    );
  };

  const Commands = () => {
    return (
      <Typist>
        <p>
          Available commands : home | about | help | games | cagematch | blog |
          contact
        </p>
      </Typist>
    );
  };
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
    return (
      <Typist typingDelay={50} cursor={<span className='cursor'> | </span>}>
        <p>Oh hi! Thanks for stopping by.</p>
      </Typist>
    );
  };

  const Test = () => {
    return <p>testing 1 2 3</p>;
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

        updateCommand(typed);
        break;
      default:
      // console.log('something else');
    }
  };

  useEffect(() => {
    updateOutput('');
    console.log('FROM TERMINAL WTF : ', command);
    switch (command) {
      case 'home':
        window.location.replace('/');
        break;
      case 'about':
      case 'zac':
        updateOutput(About);
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
        updateOutput(Directions);
        break;
      case 'help':
      case '?':
      case 'contact':
        updateOutput(Help);
        break;
      case 'hi':
      case 'hello':
      case 'howdy':
        updateOutput(Hello);
        break;
      case 'l':
      case 'look':
        updateOutput(Look);
        break;
      case 'login':
        window.location.replace('/login/');
        break;
      case 'test':
      case 'z':
        console.log('i am running when changesh');
        updateOutput('');
        updateOutput(Test);
        break;
      default:
        updateOutput(NoMatch);
    }
    dispatch({ type: 'NEW_COMMAND' });

    updateCommand('');
  }, [command]);

  useEffect(() => {
    console.log('Terminal - useEffect on output is changed.', output);
  }, [output]);

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
          <div id='textContainer' className='new-scroll' ref={ouputEl}>
            {output}
          </div>
        </div>
      </div>
    </>
  );
}

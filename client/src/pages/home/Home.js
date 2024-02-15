import { useContext, useEffect, useRef, useState } from 'react';
import './terminal.css';
import React from 'react';
import {
  AppBar,
  Box,
  Container,
  Divider,
  Drawer,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Paper,
  Toolbar,
  Typography,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import Typist from 'react-typist-component';
import Terminal from '../../components/terminal/Terminal';
import { TerminalContext } from '../../context/TerminalContext';
import { FetchLatestPost } from '../../components/posts/FetchLatestPost';
import Portfolio from '../../components/projects/Portfolio';

import { Link } from 'react-router-dom';
import { Header } from '../../components/Header';
const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

// const Prompt = (props) => {
// const [userInput, setUserInput ] = useState('');
// const { command, updateCommand } = useContext(TerminalContext);
// const [enter, setEnter] = useState(false);

// const handleKeys = (e) => {
//   // let len = this.keys.length;
//   // this.setState({ number: Math.floor(Math.random() * len) });
//   // new Audio(this.keys[this.state.number]).play();
//   // console.log(e.keyCode);
//   // console.log('from handleKeys');

//   // console.log(this.props.parseIt);

//   let code = e.keyCode;
//   switch (code) {
//     case 13:
//       e.preventDefault();
//       let typed = e.target.textContent.toLowerCase();
//       e.target.innerHTML = '';
//       props.setOutput('');
//       updateCommand(typed);
//       setEnter(true);
//       break;
//     default:
//     // console.log('something else');
//   }
// };

// return (
//   <div className='terminal' ref={inputRef}>
//             <span
//               className='terminal-input'
//               contentEditable='true'
//               suppressContentEditableWarning={true} // yea I know what I am doing 😜
//               onKeyDown={(e) => handleKeys(e)}
//             ></span>
//           </div>
// )
// }

const Intro = ({ setOutput, setViewPrompt, power }) => {
  const introEnd = () => {
    setViewPrompt(true);
  };
  const Welcome = () => {
    return (
      <>
        <Typist typinglDelay={10} onTypingDone={introEnd}>
          <p>
            Welcome to Zac's computer! So glad you stopped by I hope you find
            some fun. You can navigate like a somewhat normal website, or try
            using the computer, I am adding new things all the time. For the
            basics you can type help and see a few of the commands.
          </p>
        </Typist>
      </>
    );
  };
  const RandomCaluclations = () => {
    const [memory, setMemory] = useState(0);

    useEffect(() => {
      let isMounted = true; // Flag to check if the component is still mounted

      const interval = setInterval(() => {
        setMemory(
          (prevMemory) => prevMemory + Math.floor(Math.random() * 1000) + 1
        );
      }, 100);

      // Stop the animation after a certain duration (e.g., 3000 milliseconds)
      const timeoutId = setTimeout(() => {
        clearInterval(interval);

        // Check if the component is still mounted before updating the state
        if (isMounted && power) {
          setOutput(<Welcome />);
        }
      }, 3000);

      // Cleanup function
      return () => {
        isMounted = false; // Component is unmounting, update the flag
        clearInterval(interval);
        clearTimeout(timeoutId);
      };
    }, [power, setOutput]);

    return (
      <div className="memory-animation">
        <div className="animation">Calculating Memory: {memory} KB</div>
      </div>
    );
  };

  const intro2 = () => {
    setOutput('');
    setOutput(<RandomCaluclations />);
  };

  return (
    <>
      <Typist typinglDelay={1} onTypingDone={intro2}>
        <p>
          Starting Boot Process <br /> ....................
        </p>
      </Typist>
    </>
  );
};

const SwitchComponent = ({ power, setPower }) => {
  const switchclick = new Audio('./sounds/sound_click.mp3');

  const handleToggle = () => {
    switchclick.play();

    setPower((prevPower) => !prevPower);
  };

  return (
    <div className={`switch ${power ? 'on' : 'off'}`} onClick={handleToggle}>
      <input className="cb" type="checkbox" checked={power} readOnly />
      <div className="toggle">
        <div className="left">off</div>
        <div className="right">on</div>
      </div>
    </div>
  );
};

export default function Home() {
  const [command, setCommand] = useState('');
  const [viewPrompt, setViewPrompt] = useState(false);
  const [power, setPower] = useState(false);

  const [output, setOutput] = useState(null);

  useEffect(() => {
    power
      ? setOutput(
          <Intro
            setOutput={setOutput}
            setViewPrompt={setViewPrompt}
            power={power}
          />
        )
      : turnOff();
  }, [power]);
  const turnOff = () => {
    setOutput('');
    setViewPrompt(false);
  };

  return (
    <Container className="full-width-hack no-padding-hack">
      <Container className="main-grid ">
        <Box>
          <Grid container spacing={10}>
            <Grid item xs={12} lg={8}>
              <Box className="monitor">
                <div className="bezel">
                  <Terminal
                    command={command}
                    setCommand={setCommand}
                    output={output}
                    setOutput={setOutput}
                    viewPrompt={viewPrompt}
                    power={power}
                  />
                </div>
                {/* <div class="switch">
                <div class="switch-handle"></div>
              </div> */}

                <div className="controls">
                  <SwitchComponent power={power} setPower={setPower} />

                  <div className="light">
                    <div className={`led led-${power ? 'on' : 'off'}`}></div>
                  </div>
                </div>
              </Box>
            </Grid>
            <Grid item xs={12} lg={4}>
              <Box sx={{ width: '100%' }}>
                <Typography variant="h4" sx={{ mt: 6, fontFamily: 'VT323' }}>
                  Latest Post
                </Typography>
                <Divider />
                <FetchLatestPost />
              </Box>
            </Grid>
          </Grid>
        </Box>

        <Divider sx={{ mb: 4, mt: 2 }} />
        <Portfolio />
      </Container>
    </Container>
  );
}

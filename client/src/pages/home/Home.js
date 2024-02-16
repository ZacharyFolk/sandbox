import { useContext, useEffect, useRef, useState } from 'react';
import './terminal.css';
import React from 'react';
import { Box, Chip, Container, Divider, Grid, Typography } from '@mui/material';
import Typist from 'react-typist-component';
import Terminal from '../../components/terminal/Terminal';
import { TerminalContext } from '../../context/TerminalContext';
import { FetchLatestPost } from '../../components/posts/FetchLatestPost';
import Portfolio from '../../components/projects/Portfolio';

const HelpButtons = () => {
  const [selectedChip, setSelectedChip] = useState(null);
  const { command, updateCommand } = useContext(TerminalContext);

  const updatePrompt = () => {
    // run Typist in the prompt with the selectedChip
    // run that command
  };

  const handleClick = (value) => {
    setSelectedChip(value);
    console.log('Clicked on:', value);
    updateCommand(value);
    // Do stuff with the value
  };
  return (
    <div>
      <Chip
        label="Help"
        onClick={() => handleClick('help')}
        sx={{
          borderRadius: '4px', // Set the border radius
          '&:hover': {
            backgroundColor: 'rgba(0, 0, 0, 0.08)', // Custom hover background color
          },
          '&:active': {
            backgroundColor: 'rgba(0, 0, 0, 0.12)', // Custom active (click) background color
          },
        }}
      />

      <Chip label="Projects" onClick={() => handleClick('projects')} />
      <Chip label="About" onClick={() => handleClick('about')} />
      <Chip label="Blog" onClick={() => handleClick('blog')} />
      <Chip label="Contact" onClick={() => handleClick('contact')} />
      {selectedChip && <p>Selected chip: {selectedChip}</p>}
    </div>
  );
};
const Intro = ({ setOutput, setViewPrompt, power }) => {
  const introEnd = () => {
    setViewPrompt(true);
  };
  const Welcome = () => {
    return (
      <>
        <Typist typingDelay={1} onTypingDone={introEnd}>
          <p>Welcome! Here are some of the available commands :</p>
        </Typist>
        <Typist.Paste>
          <HelpButtons />
        </Typist.Paste>
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
      }, 10);

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
    //  setOutput(<RandomCaluclations />);
    setOutput(<Welcome />);
  };

  return (
    <>
      <Typist typingDelay={30} onTypingDone={intro2}>
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

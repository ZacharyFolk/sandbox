import { useContext, useEffect, useRef, useState } from 'react';
import React from 'react';
import { Box, Chip, Container, Divider, Grid, Typography } from '@mui/material';
import Cookies from 'js-cookie';

import Typist from 'react-typist-component';
import Terminal from '../../components/terminal/Terminal';
import { TerminalContext } from '../../context/TerminalContext';
import { FetchLatestPost } from '../../components/posts/FetchLatestPost';
import Portfolio from '../../components/projects/Portfolio';
import Wordpress from '../../components/wordpress/Wordpress';
const HelpButtons = () => {
  const [selectedChip, setSelectedChip] = useState(null);
  const { updateCommand, updateInput } = useContext(TerminalContext);

  const handleClick = (value) => {
    setSelectedChip(value);
    console.log('Clicked on:', value);
    updateCommand(value);
    updateInput(value);
    // Do stuff with the value
  };
  return (
    <div className="help-chips">
      <Chip label="Help" onClick={() => handleClick('help')} />
      <Chip label="Projects" onClick={() => handleClick('projects')} />
      <Chip label="About" onClick={() => handleClick('about')} />
      <Chip label="Blog" onClick={() => handleClick('blog')} />
      <Chip label="Contact" onClick={() => handleClick('contact')} />
      {selectedChip && <p>Selected chip: {selectedChip}</p>}
    </div>
  );
};

const RandomBoot = ({ onDone, powerRef }) => {
  const bootArray = [
    'Loading Terminal Z . . .',
    'Putting hamster in the wheel... ',
    'Transmitting bits and boops...',
    'Initiating the initial thing...',
    'Transmitting from a computer in my garage to this pretend computer to your computer... ',
  ];
  const message = bootArray[Math.floor(Math.random() * bootArray.length)];

  return (
    <Typist
      typingDelay={10}
      onTypingDone={() => {
        if (powerRef.current) onDone();
      }}
    >
      <p>{message}</p>
    </Typist>
  );
};

const Welcome = ({ onDone, powerRef }) => (
  <>
    <Typist
      typingDelay={10}
      onTypingDone={() => {
        if (powerRef.current) onDone();
      }}
    >
      <p>Welcome! Main commands :</p>
    </Typist>
    <Typist.Paste>
      <HelpButtons />
    </Typist.Paste>
  </>
);

const RandomCalculations = ({ onDone, powerRef }) => {
  console.log('Calculations');
  const [memory, setMemory] = useState(1000);

  useEffect(() => {
    let isMounted = true;

    const interval = setInterval(() => {
      setMemory(
        (prevMemory) => prevMemory + Math.floor(Math.random() * 1000) + 1
      );
    }, 100);

    const timeoutId = setTimeout(() => {
      clearInterval(interval);
      if (isMounted && powerRef.current) {
        onDone();
      }
    }, 3000);

    return () => {
      isMounted = false;
      clearInterval(interval);
      clearTimeout(timeoutId);
    };
  }, [onDone, powerRef]);

  return (
    <div className="memory-animation">
      <div className="animation">Important Looking Numbers: {memory} ZB</div>
    </div>
  );
};

const Intro = ({ setOutput, setViewPrompt, power }) => {
  const [hasRun, setHasRun] = useState(false);
  const timeouts = useRef([]);
  const powerRef = useRef(power);

  useEffect(() => {
    powerRef.current = power;

    if (power) {
      // Log the initial value of hasRun
      console.log('Initial hasRun:', hasRun);

      // Schedule a state update
      setHasRun(true);

      // Use a function to handle the side effects of state update properly
      const handleStateUpdate = () => {
        const intro2 = () => {
          const timeoutId = setTimeout(() => {
            if (powerRef.current) {
              setOutput('');
              setOutput(
                <RandomCalculations onDone={introEnd} powerRef={powerRef} />
              );
            }
          }, 2000);
          timeouts.current.push(timeoutId);
        };

        const introEnd = () => {
          const timeoutId = setTimeout(() => {
            if (powerRef.current) {
              setOutput(
                <Welcome
                  onDone={() => {
                    if (powerRef.current) setViewPrompt(true);
                  }}
                  powerRef={powerRef}
                />
              );
            }
          }, 2000);
          timeouts.current.push(timeoutId);
        };

        if (!hasRun) {
          console.log('Running intro2');
          setOutput(<RandomBoot onDone={intro2} powerRef={powerRef} />);
        } else {
          console.log('Running introEnd');
          setOutput(
            <Welcome
              onDone={() => {
                if (powerRef.current) setViewPrompt(true);
              }}
              powerRef={powerRef}
            />
          );
        }
      };

      // Delay the state-dependent logic to ensure state update has occurred
      setTimeout(handleStateUpdate, 0);
    }

    return () => {
      timeouts.current.forEach(clearTimeout);
      timeouts.current = [];
    };
  }, [power, hasRun, setOutput, setViewPrompt]);

  return null;
};

const SwitchComponent = ({ power, setPower }) => {
  const switchclick = new Audio('./sounds/sound_click.mp3');
  switchclick.volume = 0.1;

  const handleToggle = () => {
    switchclick.play();

    setPower((prevPower) => !prevPower);
  };

  useEffect(() => {
    Cookies.set('power', power);
  }, [power]);

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
  const [viewPrompt, setViewPrompt] = useState(false);
  const [power, setPower] = useState(() => {
    const cookiePower = Cookies.get('power');
    return cookiePower ? cookiePower === 'true' : false;
  });
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
          <Grid container spacing={8}>
            <Grid item xs={12}>
              <Box className="monitor">
                <div className="bezel">
                  <Terminal
                    output={output}
                    setOutput={setOutput}
                    viewPrompt={viewPrompt}
                    power={power}
                  />
                </div>
                <div className="controls">
                  <SwitchComponent power={power} setPower={setPower} />

                  <div className="light">
                    <div className={`led led-${power ? 'on' : 'off'}`}></div>
                  </div>
                </div>
              </Box>
            </Grid>
          </Grid>
        </Box>

        {/* <Divider sx={{ mb: 4, mt: 2 }} />
        <Typography variant="h4">Latest Projects</Typography>
        <Portfolio />

        <Divider /> */}

        {/* <Wordpress /> */}
      </Container>
    </Container>
  );
}

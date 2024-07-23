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
  const { command, updateCommand } = useContext(TerminalContext);

  const handleClick = (value) => {
    setSelectedChip(value);
    console.log('Clicked on:', value);
    updateCommand(value);
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

const RandomBoot = ({ onDone }) => {
  const bootArray = [
    'Loading Terminal Z . . .',
    'Putting hamster in the wheel... ',
    'Transmitting bits and boops...',
    'Initiating the initial thing...',
    'Transmitting from a computer in my garage to this pretend computer to your computer... ',
  ];
  const message = bootArray[Math.floor(Math.random() * bootArray.length)];

  return (
    <Typist typingDelay={10} onTypingDone={onDone}>
      <p>{message}</p>
    </Typist>
  );
};

const Welcome = ({ onDone }) => (
  <>
    <Typist typingDelay={10} onTypingDone={onDone}>
      <p>Welcome! Main commands :</p>
    </Typist>
    <Typist.Paste>
      <HelpButtons />
    </Typist.Paste>
  </>
);

const RandomCalculations = ({ onDone }) => {
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
      if (isMounted) {
        onDone();
      }
    }, 3000);

    return () => {
      isMounted = false;
      clearInterval(interval);
      clearTimeout(timeoutId);
    };
  }, [onDone]);

  return (
    <div className="memory-animation">
      <div className="animation">Important Looking Numbers: {memory} ZB</div>
    </div>
  );
};

const Intro = ({ setOutput, setViewPrompt, power }) => {
  const [hasRun, setHasRun] = useState(false);

  useEffect(() => {
    if (power) {
      if (!hasRun) {
        setHasRun(true);

        const intro2 = () => {
          if (power) {
            setTimeout(() => {
              setOutput('');
              setOutput(<RandomCalculations onDone={introEnd} />);
            }, 2000);
          }
        };

        const introEnd = () => {
          if (power) {
            setTimeout(() => {
              setOutput(<Welcome onDone={() => setViewPrompt(true)} />);
            }, 2000);
          }
        };

        setOutput(<RandomBoot onDone={intro2} />);
      } else {
        console.log('hasRun', hasRun);
      }
    }
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

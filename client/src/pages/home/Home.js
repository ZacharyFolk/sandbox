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
const Intro = ({ setOutput, setViewPrompt, power }) => {
  const [hasRun, setHasRun] = useState(false);

  useEffect(() => {
    if (power && !hasRun) {
      setHasRun(true);

      const introEnd = () => {
        setViewPrompt(true);
      };

      const Welcome = () => {
        return (
          <>
            <Typist typingDelay={10} onTypingDone={introEnd}>
              <p>Welcome! Main commands :</p>
            </Typist>
            <Typist.Paste>
              <HelpButtons />
            </Typist.Paste>
          </>
        );
      };

      const RandomCalculations = () => {
        const [memory, setMemory] = useState(1000);

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
            <div className="animation">
              Important Looking Numbers: {memory} ZB
            </div>
          </div>
        );
      };

      const intro2 = () => {
        setOutput('');
        setOutput(<RandomCalculations />);
      };

      setOutput(
        <>
          <Typist typingDelay={20} onTypingDone={intro2}>
            <p>
              Loading some monkey business
              <br /> ....................
              <br /> .........................
            </p>
          </Typist>
        </>
      );
    }
  }, [power, setOutput, setViewPrompt, hasRun]);

  return null; // Return null to render nothing
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
                <Typography variant="h4">Latest Post</Typography>
                <Divider />
                <FetchLatestPost />
              </Box>
            </Grid>
          </Grid>
        </Box>

        <Divider sx={{ mb: 4, mt: 2 }} />
        <Typography variant="h4">Latest Projects</Typography>
        <Portfolio />

        <Divider />

        {/* <Wordpress /> */}
      </Container>
    </Container>
  );
}

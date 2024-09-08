import { useEffect, useState } from 'react';
import React from 'react';
import { Box, Container, Grid } from '@mui/material';
import Cookies from 'js-cookie';
import Terminal from '../../components/terminal/Terminal';
import SwitchComponent from '../../components/terminal/Switch';
import Intro from '../../components/terminal/Boot';

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
      </Container>
    </Container>
  );
}

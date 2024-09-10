import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Typist from 'react-typist-component';
import { Welcome } from './Commands';
import { TerminalContext } from '../../context/TerminalContext';
import { useContext } from 'react';
import Cookies from 'js-cookie';

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

const RandomCalculations = ({ onDone, powerRef }) => {
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
  const location = useLocation(); // Get the current location
  const query = new URLSearchParams(location.search);
  const command = query.get('command');
  const { updateInput } = useContext(TerminalContext);

  useEffect(() => {
    powerRef.current = power;
    if (power) {
      if (command) {
        // If a command is present in url, ensure the prompt is shown
        setViewPrompt(true);
        updateInput(command);
      } else {
        // Ensure the prompt appears once the intro is complete
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

        // Schedule the intro state updates
        const handleStateUpdate = () => {
          const intro2 = () => {
            const timeoutId = setTimeout(() => {
              if (powerRef.current) {
                setOutput(
                  <RandomCalculations onDone={introEnd} powerRef={powerRef} />
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
            introEnd();
          }
        };

        // Run the state update handler to kick off the intro sequence
        setTimeout(handleStateUpdate, 0);
        setHasRun(true);
      }
    }

    return () => {
      timeouts.current.forEach(clearTimeout);
      timeouts.current = [];
    };
  }, [power, hasRun, setOutput, setViewPrompt, command]);

  return null;
};

export default Intro;

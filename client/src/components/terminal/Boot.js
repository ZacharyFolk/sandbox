import { useEffect, useRef, useState } from 'react';

import Typist from 'react-typist-component';
import { Welcome } from './Commands';

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

export default Intro;

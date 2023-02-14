import React, {
  useEffect,
  createRef,
  useCallback,
  useRef,
  useState,
} from 'react';
import ReactSlider from 'react-slider';
import './story.css';
import say from '../../utils/speak';
import Knob from '../../utils/UI';
const stories = [
  {
    title: '',
    inputs: [],
    template: null,
  },
  {
    title: 'A real title that is this long.',
    inputs: ['s1', 'noun', 'verb', 'verb', 'adjective', 'noun'],
    template: `The {{1}} {{2}} was {{3}} the {{4}} {{5}}. Suddenly, they {{6}}.`,
  },

  {
    title: 'A real title that is actually  quite a bit longer.',
    inputs: ['s2', 'noun', 'verb', 'verb', 'adjective', 'noun'],
    template: `The {{adjective1}} {{noun1}} {{verb1}} the {{noun2}}. Then they {{verb2}}.`,
  },
  {
    title: 'A real title that.',
    inputs: ['s1', 'noun', 'verb', 'verb', 'adjective', 'noun'],
    template: `The {{1}} {{2}} was {{3}} the {{4}} {{5}}. Suddenly, they {{6}}.`,
  },
  {
    title: 'A real title that is actually.',
    inputs: ['s2', 'noun', 'verb', 'verb', 'adjective', 'noun'],
    template: `The {{adjective1}} {{noun1}} {{verb1}} the {{noun2}}. Then they {{verb2}}.`,
  },
];

// const Visualization = ({ text, pitch, rate, volume, voice }) => {
//   const [analyser, setAnalyser] = useState(null);
//   const canvasRef = useRef(null);
//   // useEffect(() => {
//   //   const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
//   //   const source = audioCtx.createMediaElementSource(new Audio());
//   //   const analyser = audioCtx.createAnalyser();
//   //   setAnalyser(analyser);
//   //   source.connect(analyser);
//   //   analyser.connect(audioCtx.destination);
//   //   let lang = say(text, pitch, rate, volume, voice);
//   // }, [text, pitch, rate, volume, voice]);
//   useEffect(() => {
//     if (!analyser) return;
//     const canvas = canvasRef.current;
//     const canvasCtx = canvas.getContext('2d');
//     const WIDTH = canvas.width;
//     const HEIGHT = canvas.height;
//     const bufferLength = analyser.frequencyBinCount;
//     const dataArray = new Uint8Array(bufferLength);
//     const draw = () => {
//       requestAnimationFrame(draw);
//       analyser.getByteFrequencyData(dataArray);
//       canvasCtx.fillStyle = 'rgb(0, 0, 0)';
//       canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);
//       const barWidth = (WIDTH / bufferLength) * 2.5;
//       let barHeight;
//       let x = 0;
//       for (let i = 0; i < bufferLength; i++) {
//         barHeight = dataArray[i];
//         canvasCtx.fillStyle = `rgb(${barHeight + 100},50,50)`;
//         canvasCtx.fillRect(x, HEIGHT - barHeight / 2, barWidth, barHeight / 2);
//         x += barWidth + 1;
//       }
//     };
//     draw();
//   }, [analyser]);
//   return <canvas ref={canvasRef} width={500} height={100} />;
// };

const CircleVisualization = () => {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let radius = 100;
    let maxRadius = 50;
    let maxTimeout = 100;
    let x = canvas.width / 2;
    let y = canvas.height / 2;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = 10; i <= 50; i += 10) {
        ctx.beginPath();
        ctx.strokeStyle = '#33ee55';
        ctx.lineWidth = 1;
        ctx.arc(x, y, i, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.closePath();
      }
      ctx.beginPath();
      ctx.lineWidth = 2;
      ctx.strokeStyle = '#33ee55';
      ctx.arc(x, y, radius, 0, 2 * Math.PI);
      ctx.stroke();
      ctx.closePath();
      let rando = Math.floor(Math.random() * maxRadius);
      radius = rando;

      let randoTime = Math.floor(Math.random() * maxTimeout);

      setTimeout(() => {
        requestAnimationFrame(animate);
      }, randoTime);
    };
    animate();
  }, []);

  return (
    <canvas
      ref={canvasRef}
      width={150}
      height={150}
      style={{ border: '1px solid black' }}
    />
  );
};

const CircleStopped = () => {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let startTime = null;
    let x = canvas.width / 2;
    let y = canvas.height / 2;

    const animate = (timestamp) => {
      if (!startTime) {
        startTime = timestamp;
      }
      const elapsed = timestamp - startTime;
      const progress = elapsed / 9000;
      const radius = 1 + (20 * (1 + Math.sin(progress * Math.PI * 2))) / 2;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = 10; i <= 50; i += 10) {
        ctx.beginPath();
        ctx.strokeStyle = '#33ee55';
        ctx.lineWidth = 1;
        ctx.arc(x, y, i, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.closePath();
      }

      ctx.beginPath();
      ctx.strokeStyle = '#33ee55';
      ctx.lineWidth = 2;
      ctx.arc(x, y, radius, 0, 2 * Math.PI);
      ctx.stroke();
      ctx.closePath();

      requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      width={150}
      height={150}
      style={{ border: '1px solid black' }}
    />
  );
};

function StoryBot() {
  const [isActivated, setActivated] = useState(false);
  const [selectedStory, setSelectedStory] = useState(stories[0]);
  const [storyTitle, setStoryTitle] = useState('');
  const [inputLabel, setInputLabel] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [inputValue, setInputValue] = useState('');
  const [userInputs, setUserInput] = useState([]);
  const [finalStory, setFinalStory] = useState('');
  const [volume, setVolume] = useState(0);
  const [decimalVolume, setDecimalVolume] = useState(0);
  const [showVolume, setShowVolume] = useState(false);

  const [pitch, setPitch] = useState(50);
  const [decimalPitch, setDecimalPitch] = useState(1);
  const [pitchDesc, setPitchDesc] = useState('');
  const [rate, setRate] = useState(100);
  const [decimalRate, setDecimalRate] = useState(1);
  const [rateDesc, setRateDesc] = useState('');
  const [voice, setVoice] = useState(0);
  const [locale, setLocale] = useState('');
  const [showViz, setShowViz] = useState(false);
  const [speech, setSpeech] = useState('');
  const inputRef = createRef();
  const botRef = createRef();
  const tongueTwisters = [
    'She sells sea shells by the sea shore',
    'How can a clam cram in a clean cream can?',
    'Peter Piper picked a peck of pickled peppers',
    'Red lorry, yellow lorry',
    'How much wood would a woodchuck chuck, if a woodchuck could chuck wood?',
    'Fuzzy Wuzzy was a bear, Fuzzy Wuzzy had no hair',
    'The seething sea ceaseth and thus the seething sea sufficeth us',
    'I saw Susie sitting in a shoe shine shop',
    'A proper copper coffee pot',
    'I scream, you scream, we all scream for ice cream!',
    'Round the rugged rocks the ragged rascal ran',
    "The sixth sick sheik's sixth sheep is sick",
    'A proper copper coffee pot',
    "I wish to wish the wish you wish to wish, but if you wish the wish the witch wishes, I won't wish the wish you wish to wish",
    'How can a clam cram in a clean cream can?',
    'If Stu chews shoes, should Stu choose the shoes he chews?',
    'I scream, you scream, we all scream for ice cream!',
    'Black bug bit a big black bear. But where is the big black bear that the black bug bit?',
    'The knickers I have got have got no buttons. But buttons I have got, to put on knickers I have not got',
    'How much pot, could a pot roast roast, if a pot roast could roast pot?',
  ];
  let twistIndex = Math.floor(Math.random() * tongueTwisters.length);
  const handleSubmit = (event) => {
    event.preventDefault();
    inputRef.current.classList.add('teleport');

    if (currentIndex === selectedStory.inputs.length) {
      createStory();
    } else {
      setUserInput((userInputs) => [...userInputs, inputValue]);
      setInputValue('');
      setCurrentIndex(currentIndex + 1);
      processWords();
    }
  };

  const processWords = () => {
    setTimeout(() => {
      console.log(inputRef.current);
    }, 3000);
  };
  const createStory = () => {
    const inputObject = userInputs.reduce((acc, value, index) => {
      acc[index + 1] = value;
      return acc;
    }, {});

    let parsedStory = selectedStory.template;
    for (const key in inputObject) {
      parsedStory = parsedStory.replace(`{{${key}}}`, inputObject[key]);
    }

    setFinalStory(parsedStory);
  };

  // Change Pitch set it for UX and decimal value for say()
  const changePitch = (value) => {
    setPitch(value);
    setDecimalPitch((value * 2) / 100);
  };

  useEffect(() => {
    if (pitch >= 0 && pitch <= 10) {
      setPitchDesc('drunk');
    } else if (pitch > 10 && pitch <= 20) {
      setPitchDesc('deep');
    } else if (pitch > 20 && pitch <= 30) {
      setPitchDesc('baritone');
    } else if (pitch > 30 && pitch <= 40) {
      setPitchDesc('tenor');
    } else if (pitch > 40 && pitch <= 50) {
      setPitchDesc('mellow');
    } else if (pitch > 50 && pitch <= 60) {
      setPitchDesc('warm');
    } else if (pitch > 60 && pitch <= 70) {
      setPitchDesc('soprano');
    } else if (pitch > 70 && pitch <= 80) {
      setPitchDesc('treble');
    } else if (pitch > 80 && pitch <= 90) {
      setPitchDesc('falsetto');
    } else if (pitch > 90 && pitch <= 100) {
      setPitchDesc('ouch');
    }
  }, [pitch]);

  // Change Volume set it for UX and decimal value for say()
  const changeVolume = (value) => {
    setVolume(value);
    setDecimalVolume(value / 100);
  };

  // Change Rate set it for UX and decimal value for say()
  const changeRate = (value) => {
    setRate(value);
    setDecimalRate((value * 2) / 100);
    console.log(decimalRate);
  };

  useEffect(() => {
    if (rate >= 0 && rate <= 10) {
      setRateDesc('comatose');
    } else if (rate > 10 && rate <= 20) {
      setRateDesc('drowsy');
    } else if (rate > 20 && rate <= 30) {
      setRateDesc('exhausted');
    } else if (rate > 30 && rate <= 40) {
      setRateDesc('lazy');
    } else if (rate > 40 && rate <= 50) {
      setRateDesc('calm');
    } else if (rate > 50 && rate <= 60) {
      setRateDesc('moderate');
    } else if (rate > 60 && rate <= 70) {
      setRateDesc('energetic');
    } else if (rate > 70 && rate <= 80) {
      setRateDesc('eager');
    } else if (rate > 80 && rate <= 90) {
      setRateDesc('hyper');
    } else if (rate > 90 && rate <= 100) {
      setRateDesc('spazzed');
    }
  }, [rate]);

  // Change Voice and fetch voice title and set that
  const changeVoice = (value) => {
    console.log('wtf', value);
    setVoice(value);
  };

  // Test sound settings
  const playTest = async ({ words }) => {
    setShowViz(true);
    if (!words) words = tongueTwisters[twistIndex];
    console.log('WORDS ===========>', words);
    let speech = say(words, decimalPitch, decimalRate, decimalVolume, voice);

    if (speech) {
      speech.addEventListener('end', (event) => {
        setShowViz(false);
        console.log(
          `Utterance has finished being spoken after ${event.elapsedTime} seconds.`
        );
      });
      setLocale(speech.voice);
    }
  };

  const playThis = (string) => {
    let speech = say(string, decimalPitch, decimalRate, decimalVolume, voice);

    if (speech) {
      setActivated(true);
      setShowViz(true);
      setSpeech(string);
      speech.addEventListener('end', (event) => {
        setShowViz(false);
        console.log(
          `Utterance has finished being spoken after ${event.elapsedTime} seconds.`
        );
      });
      setLocale(speech.voice);
    }
  };
  const WordConveyor = ({ userInputs, storyTitle }) => {
    return (
      <div className='conveyor'>
        <div className='words'>
          {userInputs.map((word, i) => (
            <span key={i}>{word}</span>
          ))}
        </div>
      </div>
    );
  };

  // STORY COMPLETE
  useEffect(() => {
    console.log('from useEffect ', finalStory);
    // say(finalStory, 0.1, 1, 0.3, 20);
    playThis(finalStory);
  }, [finalStory]);

  // ON LOAD
  useEffect(() => {
    // say('hello', 1, 1, 0.3, 20);
  }, []);

  // FOR DYNAMIC PREFIX TO WORD TYPE
  useEffect(() => {
    let wordType = selectedStory.inputs[currentIndex];
    let prefix = wordType === 'adjective' ? 'An ' : 'A ';

    setInputLabel(prefix + wordType);
  }, [selectedStory, currentIndex]);

  // To hide/show the volume bar
  useEffect(() => {
    setShowVolume(true);
    setTimeout(() => {
      setShowVolume(false);
    }, 3000);
  }, [volume]);

  return (
    <>
      <div className='madlib'>
        {/* <WordConveyor userInputs={userInputs} storyTitle={storyTitle} /> */}
        <div className='main-contain'>
          <div className='left-panel'>
            <div className='panel-container'>
              <div className='story-controls'>
                <div className='control-panel'>
                  <div
                    className={`metal-closed  ${
                      currentIndex < selectedStory.inputs.length
                        ? 'metal-open'
                        : ''
                    }`}
                  >
                    WORDS
                  </div>

                  <form onSubmit={handleSubmit}>
                    <div className='add-word-button'>
                      <span className='helper-container'>
                        <span className='helper-wrap'>
                          <label>
                            Enter a {selectedStory.inputs[currentIndex]}
                            {inputLabel}
                          </label>
                        </span>
                      </span>
                      <input
                        ref={inputRef}
                        type='text'
                        className=''
                        value={inputValue}
                        required
                        placeholder={selectedStory.inputs[currentIndex]}
                        onChange={(e) => setInputValue(e.target.value)}
                      />
                      <button className='addWord' type='submit'>
                        <i class='fa-solid fa-right-to-bracket'></i>
                      </button>
                    </div>
                  </form>
                  {currentIndex !== 0 &&
                    currentIndex === selectedStory.inputs.length && (
                      <>
                        {console.log(currentIndex)}
                        <button onClick={createStory}>Create the Story</button>
                      </>
                    )}
                </div>
              </div>
              <>{finalStory}</>
              <div className='voice-controls'>
                <div className='slide-container'>
                  <label>Tone </label>
                  <div className='pitch-slide'>
                    <ReactSlider
                      className='customSlider'
                      trackClassName='customSlider-track'
                      thumbClassName='customSlider-thumb'
                      markClassName='customSlider-mark'
                      marks={10} // or array of values or single number for increments
                      min={0}
                      max={100}
                      value={pitch}
                      onChange={changePitch}
                    />
                  </div>
                </div>
                <div className='slide-container'>
                  <label>Energy </label>
                  <div className='rate-slide'>
                    <ReactSlider
                      className='customSlider'
                      trackClassName='customSlider-track'
                      thumbClassName='customSlider-thumb'
                      markClassName='customSlider-mark'
                      marks={10} // or array of values or single number for increments
                      min={0}
                      max={100}
                      value={rate}
                      onChange={changeRate}
                    />
                  </div>
                </div>

                <div className='slide-container'>
                  <label>Voice </label>
                  <div className='voice-chooser'>
                    <button
                      onClick={() => {
                        changeVoice(voice - 1);
                      }}
                    >
                      &#5130;
                    </button>
                    <input
                      type='number'
                      value={voice}
                      onChange={changeVoice}
                      min={0}
                      max={21}
                    />
                    <button
                      className='testVoice'
                      onClick={() => changeVoice(voice + 1)}
                    >
                      &#5125;
                    </button>
                  </div>
                </div>

                <div className='row'>
                  <button
                    className='test-button'
                    onClick={() => playThis(tongueTwisters[twistIndex])}
                  >
                    <span>Test</span> <i className='fa-solid fa-bullhorn'></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className='monitor-wrapper'>
            <div className='monitor'>
              <div className='monitor-main'>
                <div className='monitor-left'>
                  <div className='voiceOptions'>
                    <ul>
                      <li>
                        <label>Tone: </label>
                        <span className='someNumb'>{pitch}</span>
                        <span className='bar-container'>
                          <span
                            className='bar'
                            style={{ width: `${pitch}%` }}
                          />
                          <span className='bar-text'>{pitchDesc}</span>
                        </span>
                      </li>
                      <li>
                        <label>Energy: </label>
                        <span className='someNumb'> {rate}</span>
                        <span className='bar-container'>
                          <span className='bar' style={{ width: `${rate}%` }} />
                          <span className='bar-text'> {rateDesc}</span>
                        </span>
                      </li>
                      <li>Location: </li>
                      <li>Voice: {voice}</li>
                    </ul>
                    <div className='voiceContainer'>
                      <div className='circletalk'>
                        {showViz ? <CircleVisualization /> : <CircleStopped />}
                      </div>
                    </div>
                  </div>
                </div>
                {/* Terminal Right */}
                <div className='monitor-right'>
                  {selectedStory && (
                    <ul className='button-list new-scroll'>
                      {stories.map((story) => (
                        <li
                          key={story.title}
                          onClick={(e) => {
                            setSelectedStory(story);
                            setStoryTitle(e.target.innerText);
                          }}
                          className={selectedStory === story ? 'active' : ''}
                        >
                          {story.title}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
              {/* Terminal Footer */}
              <div className='monitorFooter'>
                <div
                  className={`volume-display ${showVolume ? 'show' : 'hide'}`}
                >
                  Volume:
                  <div
                    className='volume-bars'
                    style={{ maxWidth: 800, width: `${10 * volume}px` }}
                  >
                    {Array.from({ length: volume / 2 }).map((_, i) => (
                      <div key={i} class='volume-bar'></div>
                    ))}
                  </div>
                </div>

                <div className='speechOutput'> TESTING 123 {speech}</div>
              </div>
            </div>
            <div className='machine-name'>
              <div className='storybot-logo'>
                <i
                  className={`fa-solid fa-robot ${
                    isActivated ? 'activated-bot' : ''
                  }`}
                  ref={botRef}
                ></i>
                <span>StoryBot</span>
              </div>
              <div className='knobs-container'>
                <div className='volume-knob'>
                  <Knob
                    size={100}
                    numTicks={25}
                    degrees={260}
                    min={1}
                    max={100}
                    value={volume}
                    // color={true}
                    onChange={changeVolume}
                  />
                </div>

                <div className='power-switch'>
                  <input type='checkbox' id='switch' name='switch' />
                  <label for='switch' class='switch'></label>
                </div>
              </div>
              {/* <div className='gears-container'>
                <div className='gear-rotate-left gear-stop'></div>
              </div> */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default StoryBot;

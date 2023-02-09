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
const stories = [
  {
    title: 'Select the Title',
    inputs: [],
    template: null,
  },
  {
    title: 'Story 1',
    inputs: ['adjective', 'noun', 'verb', 'verb', 'adjective', 'noun'],
    template: `The {{1}} {{2}} was {{3}} the {{4}} {{5}}. Suddenly, they {{6}}.`,
  },
  {
    title: 'Story 2',
    inputs: ['adjective', 'noun', 'verb', 'verb', 'adjective', 'noun'],
    template: `The {{adjective1}} {{noun1}} {{verb1}} the {{noun2}}. Then they {{verb2}}.`,
  },
];

const RenderCanvas = ({ dataArray, analyser }) => {
  let pixelRatio, sizeOnScreen, segmentWidth;

  const canvasRef = React.useRef(null);
  const bufferLength = dataArray.length;
  const pixelRatioRef = React.useRef(0);
  const sizeOnScreenRef = React.useRef({});
  React.useEffect(() => {
    const canvas = canvasRef.current;
    const c = canvas.getContext('2d');

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    pixelRatioRef.current = window.devicePixelRatio;
    sizeOnScreenRef.current = canvas.getBoundingClientRect();
    canvas.width = sizeOnScreenRef.current.width * pixelRatioRef.current;
    canvas.height = sizeOnScreenRef.current.height * pixelRatioRef.current;
    canvas.style.width = canvas.width / pixelRatioRef.current + 'px';
    canvas.style.height = canvas.height / pixelRatioRef.current + 'px';

    c.fillStyle = '#181818';
    c.fillRect(0, 0, canvas.width, canvas.height);
    c.strokeStyle = '#33ee55';
    c.beginPath();

    c.moveTo(0, canvas.height / 2);
    c.lineTo(canvas.width, canvas.height / 2);
    c.stroke();

    const draw = () => {
      analyser.getByteTimeDomainData(dataArray);
      segmentWidth = canvas.width / analyser.frequencyBinCount;
      c.fillRect(0, 0, canvas.width, canvas.height);
      c.beginPath();
      c.moveTo(-100, canvas.height / 2);

      for (let i = 1; i < analyser.frequencyBinCount; i += 1) {
        let x = i * segmentWidth;
        let v = dataArray[i] / 128.0;
        let y = (v * canvas.height) / 2;
        c.lineTo(x, y);
      }

      c.lineTo(canvas.width + 100, canvas.height / 2);
      c.stroke();
      requestAnimationFrame(draw);
    };
    // draw();
  }, [dataArray]);

  return <canvas ref={canvasRef} />;
};
function StoryBot() {
  const [selectedStory, setSelectedStory] = useState(stories[0]);
  const [storyTitle, setStoryTitle] = useState('');
  const [inputLabel, setInputLabel] = useState('');

  const [currentIndex, setCurrentIndex] = useState(0);
  const [inputValue, setInputValue] = useState('');
  const [userInputs, setUserInput] = useState([]);
  const [finalStory, setFinalStory] = useState('');
  const [volume, setVolume] = useState(0);
  const [decimalVolume, setDecimalVolume] = useState(0);

  const [pitch, setPitch] = useState(1);
  const [decimalPitch, setDecimalPitch] = useState(1);
  const [rate, setRate] = useState(1);
  const [decimalRate, setDecimalRate] = useState(1);

  const [voice, setVoice] = useState(0);
  const [dataArray, setDataArray] = React.useState(null);
  const [analyser, setAnalyser] = useState(null);
  const ac = new AudioContext();

  const audioCtx = new AudioContext();

  const inputRef = createRef();

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

    console.log(userInputs);
    console.log(parsedStory);
    setFinalStory(parsedStory);
  };

  // Change Pitch set it for UX and decimal value for say()
  const changePitch = (value) => {
    setPitch(value);
    setDecimalPitch((value * 2) / 100);

    console.log('decpitch', decimalPitch);
  };
  // Change Volume set it for UX and decimal value for say()
  const changeVolume = (value) => {
    setVolume(value);
    setDecimalVolume(value / 100);
  };

  // Change Rate set it for UX and decimal value for say()
  const changeRate = (value) => {
    setRate(value);
    setDecimalRate((value * 10) / 100);

    console.log('decimalRate', decimalRate);
  };
  // Change Voice and fetch voice title and set that
  const changeVoice = (value) => {
    setVoice(value);
  };

  const canvasRef = useRef(null);
  const scriptProcessorRef = useRef(null);

  // Takes text and speaks it and creates visualization
  const handleSpeak = useCallback((text, pitch, rate, volume, voice) => {
    if (volume === 0) return;
    console.log('Starting audio processing');

    const audioCtx = new AudioContext();
    console.log('Audio context created:', audioCtx);

    const scriptProcessor = audioCtx.createScriptProcessor(2048, 1, 1);
    console.log('Script processor created:', scriptProcessor);

    scriptProcessorRef.current = scriptProcessor;

    const source = audioCtx.createBufferSource();
    console.log('Buffer source created:', source);

    source.connect(scriptProcessor);
    scriptProcessor.connect(audioCtx.destination);
    const analyser = audioCtx.createAnalyser();
    console.log('Analyser created:', analyser);

    source.connect(analyser);
    analyser.connect(scriptProcessor);

    analyser.fftSize = 2048;
    const bufferLength = analyser.frequencyBinCount;
    console.log('Buffer length:', bufferLength);

    const dataArray = new Uint8Array(bufferLength);
    console.log('Data array created:', dataArray);
    analyser.getByteFrequencyData(dataArray);
    console.log('Frequency data obtained:', dataArray);
    source.start();
    console.log('Starting audio source');
    setDataArray(dataArray);

    say(text, pitch, rate, volume, voice);
  }, []);

  useEffect(() => {
    if (!scriptProcessorRef.current) return;

    const canvas = canvasRef.current;
    const c = canvas.getContext('2d');

    const audioCtx = new AudioContext();
    const analyser = audioCtx.createAnalyser();

    setAnalyser(analyser);
    scriptProcessorRef.current.connect(analyser);
    analyser.fftSize = 2048;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    function renderFrame() {
      requestAnimationFrame(renderFrame);

      analyser.getByteTimeDomainData(dataArray);

      c.fillStyle = '#181818';
      c.fillRect(0, 0, canvas.width, canvas.height);

      c.lineWidth = 2;
      c.strokeStyle = '#33ee55';

      c.beginPath();

      const sliceWidth = (canvas.width * 1.0) / bufferLength;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const v = dataArray[i] / 128.0;
        const y = (v * canvas.height) / 2;

        if (i === 0) {
          c.moveTo(x, y);
        } else {
          c.lineTo(x, y);
        }

        x += sliceWidth;
      }

      c.lineTo(canvas.width, canvas.height / 2);
      c.stroke();
    }

    renderFrame();
  }, []);

  // Test sound settings
  const playTest = () => {
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
    let num = Math.floor(Math.random() * tongueTwisters.length);
    // console.log(tongueTwisters[num]);
    // const source = audioCtx.createMediaStreamSource(tongueTwisters[num]);
    // // source.connect(analyser);
    // // analyser.fftSize = 2048;
    // // const bufferLength = analyser.frequencyBinCount;
    // // const dataArray = new Uint8Array(bufferLength);

    handleSpeak(
      tongueTwisters[num],
      decimalPitch,
      decimalRate,
      decimalVolume,
      voice
    );
  };

  // const Canvas = () => {
  //   let pixelRatio, sizeOnScreen, segmentWidth;
  //   const canvasRef = useRef(null);
  //   // use this to access raw audio data from speech commands
  //   const scriptProcessorRef = useRef(null);
  //   const handleSpeak = useCallback((text, pitch, rate, volume, voice) => {
  //     if (volume === 0) return;

  //     const audioCtx = new AudioContext();
  //     const scriptProcessor = audioCtx.createScriptProcessor(2048, 1, 1);
  //     scriptProcessorRef.current = scriptProcessor;

  //     const source = audioCtx.createBufferSource();
  //     source.connect(scriptProcessor);
  //     scriptProcessor.connect(audioCtx.destination);

  //     source.start();

  //     say(text, pitch, rate, volume, voice);
  //   }, []);

  //   useEffect(() => {
  //     if (!scriptProcessorRef.current) return;

  //     const canvas = canvasRef.current;
  //     const c = canvas.getContext('2d');

  //     const audioCtx = new AudioContext();
  //     const analyser = audioCtx.createAnalyser();

  //     scriptProcessorRef.current.connect(analyser);
  //     analyser.fftSize = 2048;
  //     const bufferLength = analyser.frequencyBinCount;
  //     const dataArray = new Uint8Array(bufferLength);

  //     function renderFrame() {
  //       requestAnimationFrame(renderFrame);

  //       analyser.getByteTimeDomainData(dataArray);

  //       c.fillStyle = '#181818';
  //       c.fillRect(0, 0, canvas.width, canvas.height);

  //       c.lineWidth = 2;
  //       c.strokeStyle = '#33ee55';

  //       c.beginPath();

  //       const sliceWidth = (canvas.width * 1.0) / bufferLength;
  //       let x = 0;

  //       for (let i = 0; i < bufferLength; i++) {
  //         const v = dataArray[i] / 128.0;
  //         const y = (v * canvas.height) / 2;

  //         if (i === 0) {
  //           c.moveTo(x, y);
  //         } else {
  //           c.lineTo(x, y);
  //         }

  //         x += sliceWidth;
  //       }

  //       c.lineTo(canvas.width, canvas.height / 2);
  //       c.stroke();
  //     }

  //     renderFrame();
  //   }, []);
  //   useEffect(() => {
  //     const canvas = canvasRef.current;
  //     const c = canvas.getContext('2d');

  //     canvas.width = window.innerWidth;
  //     canvas.height = window.innerHeight;
  //     pixelRatio = window.devicePixelRatio;
  //     sizeOnScreen = canvas.getBoundingClientRect();
  //     canvas.width = sizeOnScreen.width * pixelRatio;
  //     canvas.height = sizeOnScreen.height * pixelRatio;
  //     canvas.style.width = canvas.width / pixelRatio + 'px';
  //     canvas.style.height = canvas.height / pixelRatio + 'px';

  //     c.fillStyle = '#181818';
  //     c.fillRect(0, 0, canvas.width, canvas.height);
  //     c.strokeStyle = '#33ee55';
  //     c.beginPath();
  //     c.moveTo(0, canvas.height / 2);
  //     c.lineTo(canvas.width, canvas.height / 2);
  //     c.stroke();
  //   }, []);

  //   return <canvas id='canvas' ref={canvasRef} />;
  // };

  const WordConveyor = ({ userInputs, storyTitle }) => {
    return (
      <div className='conveyor'>
        <div className='words'>
          {userInputs.map((word, i) => (
            <span key={i}>{word}</span>
          ))}
          <span className='storyTitle'>{storyTitle}</span>
        </div>
        <div className='gears-container'>
          <div className='gear-rotate'></div>
          <div className='gear-rotate'></div>
          <div className='gear-rotate'></div>
          <div className='gear-rotate'></div>
        </div>
      </div>
    );
  };

  // const handleChange = (value) => {
  //   setValue(value);
  // };
  // const readStory = () => {
  //   console.log('Now we can do stuff!' + finalStory);
  //   createStory();
  // };

  // STORY COMPLETE
  useEffect(() => {
    console.log('from useEffect ', finalStory);
    // say(finalStory, 0.1, 1, 0.3, 20);
  }, [finalStory]);

  // ON LOAD
  useEffect(() => {
    // say('hello', 1, 1, 0.3, 20);
  }, []);

  useEffect(() => {
    console.log('i run');
    let wordType = selectedStory.inputs[currentIndex];
    let prefix = wordType === 'adjective' ? 'An ' : 'A ';
    // switch (wordType) {
    //   case 'adjective':
    //     prefix = 'An';
    //     break;
    //   default:
    //     prefix = 'look at me';
    //     break;
    // }
    setInputLabel(prefix + wordType);
  }, [selectedStory, currentIndex]);
  return (
    <>
      <div className='madlib'>
        <WordConveyor userInputs={userInputs} storyTitle={storyTitle} />
        <div className='machine-name'>Story Bot 3000</div>
        <div className='story-controls'>
          {selectedStory && (
            <div className='custom-select'>
              <select
                onChange={(e) => {
                  setSelectedStory(
                    stories.find((story) => story.title === e.target.value)
                  );
                  setStoryTitle(e.target.value);
                }}
              >
                {stories.map((story) => (
                  <option key={story.title}>{story.title}</option>
                ))}
              </select>
            </div>
          )}
          {currentIndex < selectedStory.inputs.length && (
            <form onSubmit={handleSubmit}>
              <div>
                <>
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
                  <button type='submit'>Add Word</button>
                </>
              </div>
            </form>
          )}

          {currentIndex !== 0 &&
            currentIndex === selectedStory.inputs.length && (
              <>
                {console.log(currentIndex)}
                <button onClick={createStory}>Create the Story</button>
              </>
            )}
        </div>
        <>{finalStory}</>
      </div>
      <div className='voice-controls'>
        <div className='pitch-slide'>
          <ReactSlider
            className='customSlider'
            trackClassName='customSlider-track'
            thumbClassName='customSlider-thumb'
            markClassName='customSlider-mark'
            marks={20} // or array of values or single number for increments
            min={0}
            max={100}
            value={pitch}
            onChange={changePitch}
          />
        </div>

        <div className='rate-slide'>
          <ReactSlider
            className='customSlider'
            trackClassName='customSlider-track'
            thumbClassName='customSlider-thumb'
            markClassName='customSlider-mark'
            marks={20} // or array of values or single number for increments
            min={0}
            max={100}
            value={rate}
            onChange={changeRate}
          />
        </div>
        <div className='voice-slide'>
          <ReactSlider
            className='customSlider'
            trackClassName='customSlider-track'
            thumbClassName='customSlider-thumb'
            markClassName='customSlider-mark'
            marks={20} // or array of values or single number for increments
            min={0}
            max={21}
            value={voice}
            onChange={changeVoice}
          />
        </div>
        <div className='volume-slide'>
          <ReactSlider
            className='customSlider'
            trackClassName='customSlider-track'
            thumbClassName='customSlider-thumb'
            markClassName='customSlider-mark'
            marks={20} // or array of values or single number for increments
            min={0}
            max={100}
            value={volume}
            onChange={changeVolume}
          />
        </div>
      </div>
      <div className='monitor'>
        <div className='voiceOptions'>
          <ul>
            <li>Pitch: {pitch}</li>
            <li>Volume: {volume}</li>
            <li>Rate: {rate}</li> <li>Voice: {voice}</li>
          </ul>
        </div>
      </div>
      <div className='row'>{/* <Canvas /> */}</div>
      <div className='row'>
        <button onClick={playTest}>Test Voice</button>
      </div>
      {dataArray && <RenderCanvas dataArray={dataArray} />}
    </>
  );
}

export default StoryBot;

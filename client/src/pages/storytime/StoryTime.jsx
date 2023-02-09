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
    let minRadius = 10;
    let maxRadius = 100;
    let maxTimeout = 100;
    let x = canvas.width / 2;
    let y = canvas.height / 2;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.beginPath();
      ctx.fillStyle = '#181818';
      ctx.strokeStyle = '#33ee55';
      ctx.arc(x, y, radius, 0, 2 * Math.PI);
      ctx.fill();
      ctx.stroke();
      ctx.closePath();
      let rando = Math.floor(Math.random() * maxRadius);

      radius = rando;

      let randoTime = Math.floor(Math.random() * maxTimeout);

      // if (radius > maxRadius) {
      //   radius = maxRadius;
      // }
      // if (radius < minRadius) {
      //   radius = minRadius;
      // }

      setTimeout(() => {
        requestAnimationFrame(animate);
      }, randoTime);
    };
    animate();
  }, []);

  return (
    <canvas
      ref={canvasRef}
      width={300}
      height={300}
      style={{ border: '1px solid black' }}
    />
  );
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
  const [locale, setLocale] = useState('');
  const [showViz, setShowViz] = useState(false);
  const inputRef = createRef();
  const osciRef = createRef();
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
  // Change Volume set it for UX and decimal value for say()
  const changeVolume = (value) => {
    setVolume(value);
    setDecimalVolume(value / 100);
  };

  // Change Rate set it for UX and decimal value for say()
  const changeRate = (value) => {
    setRate(value);
    setDecimalRate((value * 10) / 100);
  };
  // Change Voice and fetch voice title and set that
  const changeVoice = (value) => {
    setVoice(value);
  };

  // Test sound settings
  const playTest = async () => {
    setShowViz(true);
    let speech = say(
      tongueTwisters[twistIndex],
      decimalPitch,
      decimalRate,
      decimalVolume,
      voice
    );
    speech.addEventListener('end', (event) => {
      setShowViz(false);
      console.log(
        `Utterance has finished being spoken after ${event.elapsedTime} seconds.`
      );
    });
    setLocale(speech.voice);

    // setShowViz(true);

    // console.log(lang.lang);
  };

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
    let wordType = selectedStory.inputs[currentIndex];
    let prefix = wordType === 'adjective' ? 'An ' : 'A ';

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
            <li>Rate: {rate}</li>
            <li>Voice: {voice}</li>
            <li>Volume: {volume}</li>
          </ul>
        </div>
      </div>

      <div className='row'>
        <button onClick={playTest}>Test Voice</button>
      </div>
      {showViz && <CircleVisualization />}
    </>
  );
}

export default StoryBot;

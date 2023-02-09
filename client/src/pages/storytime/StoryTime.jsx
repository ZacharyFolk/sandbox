import React, { useEffect, createRef, useState } from 'react';
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
function StoryBot() {
  const [selectedStory, setSelectedStory] = useState(stories[0]);
  const [storyTitle, setStoryTitle] = useState('');
  const [inputLabel, setInputLabel] = useState('');

  const [currentIndex, setCurrentIndex] = useState(0);
  const [inputValue, setInputValue] = useState('');
  const [userInputs, setUserInput] = useState([]);
  const [finalStory, setFinalStory] = useState('');

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

  const handleChange = (e) => {
    e.preventDefault();
  };

  const readStory = () => {
    console.log('Now we can do stuff!' + finalStory);
    createStory();
  };
  useEffect(() => {
    console.log('from useEffect ', finalStory);
    // say(finalStory, 0.1, 1, 0.3, 20);
  }, [finalStory]);

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

        {currentIndex !== 0 && currentIndex === selectedStory.inputs.length && (
          <>
            {console.log(currentIndex)}
            <button onClick={createStory}>Create the Story</button>
          </>
        )}
      </div>
      <>{finalStory}</>
    </div>
  );
}

export default StoryBot;

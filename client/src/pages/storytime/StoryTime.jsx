import React, { useEffect, useState } from 'react';
import './story.css';
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
function MadLibs() {
  const [selectedStory, setSelectedStory] = useState(stories[0]);
  const [storyTitle, setStoryTitle] = useState('');

  const [currentIndex, setCurrentIndex] = useState(0);
  const [inputValue, setInputValue] = useState('');
  const [userInputs, setUserInput] = useState([]);
  const [finalStory, setFinalStory] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();

    if (currentIndex === selectedStory.inputs.length) {
      createStory();
    } else {
      setUserInput((userInputs) => [...userInputs, inputValue]);
      setInputValue('');
      setCurrentIndex(currentIndex + 1);
    }
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
      <>
        {userInputs.map((word, i) => (
          <span key={i}>{word}</span>
        ))}
        <span className='storyTitle'>{storyTitle}</span>
      </>
    );
  };

  const handleChange = (e) => {
    e.preventDefault();
  };

  useEffect(() => {
    console.log('from useEffect ', finalStory);
  }, [finalStory]);

  return (
    <div className='madlib'>
      <WordConveyor userInputs={userInputs} storyTitle={storyTitle} />

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

      <form onSubmit={handleSubmit}>
        <div>
          {currentIndex < selectedStory.inputs.length && (
            <>
              <label>Enter a {selectedStory.inputs[currentIndex]}</label>
              <input
                type='text'
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
              />
              <button type='submit'>Submit</button>
            </>
          )}
          {currentIndex !== 0 &&
            currentIndex === selectedStory.inputs.length && (
              <>
                {console.log(currentIndex)}
                <button>Create the Story</button>
              </>
            )}
        </div>
      </form>

      <>{finalStory}</>
    </div>
  );
}

export default MadLibs;

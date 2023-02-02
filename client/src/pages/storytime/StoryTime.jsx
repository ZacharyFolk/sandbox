import React, { useState, useEffect } from 'react';

const stories = [
  {
    title: 'Story 1',
    inputs: [
      { type: 'adjective', placeholder: 'Adjective 1' },
      { type: 'noun', placeholder: 'Noun 1' },
      { type: 'verb', placeholder: 'Verb 1' },
      { type: 'adjective', placeholder: 'Adjective 2' },
      { type: 'noun', placeholder: 'Noun 2' },
      { type: 'verb', placeholder: 'Verb 2' },
    ],
    template: `The {{adjective1}} {{noun1}} was {{verb1}} the {{adjective2}} {{noun2}}. Suddenly, they {{verb2}}.`,
  },
  {
    title: 'Story 2',
    inputs: [
      { type: 'adjective', placeholder: 'Adjective 1' },
      { type: 'noun', placeholder: 'Noun 1' },
      { type: 'verb', placeholder: 'Verb 1' },
      { type: 'noun', placeholder: 'Noun 2' },
      { type: 'verb', placeholder: 'Verb 2' },
    ],
    template: `The {{adjective1}} {{noun1}} {{verb1}} the {{noun2}}. Then they {{verb2}}.`,
  },
];

function MadLibs() {
  const [selectedStory, setSelectedStory] = useState(stories[0]);
  const [currentInput, setCurrentInput] = useState(0);
  const [inputValues, setInputValues] = useState({});
  const [madLibStory, setMadLibStory] = useState('');

  useEffect(() => {
    if (currentInput === selectedStory.inputs.length) {
      let story = selectedStory.template;
      Object.entries(inputValues).forEach(([key, value]) => {
        story = story.replace(`{{${key}}}`, value);
      });
      setMadLibStory(story);
    }
  }, [currentInput, inputValues, selectedStory]);

  const handleInputChange = (event) => {
    setInputValues({ ...inputValues, [event.target.name]: event.target.value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setCurrentInput(currentInput + 1);
  };

  if (currentInput < selectedStory.inputs.length) {
    return (
      <div>
        <select
          onChange={(e) =>
            setSelectedStory(
              stories.find((story) => story.title === e.target.value)
            )
          }
        >
          {stories.map((story) => (
            <option key={story.title}>{story.title}</option>
          ))}
        </select>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor={selectedStory.inputs[currentInput].type}>
              {selectedStory.inputs[currentInput].placeholder}
            </label>
            <input
              type='text'
              id={selectedStory.inputs[currentInput].type}
              name={selectedStory.inputs[currentInput].type}
              onChange={handleInputChange}
            />
          </div>
          <button type='submit'>Submit</button>
        </form>
      </div>
    );
  }
  return <p>{madLibStory}</p>;
}

export default MadLibs;

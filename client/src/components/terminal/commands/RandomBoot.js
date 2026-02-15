import Typist from 'react-typist-component';

const bootArray = [
  'Loading Terminal Z . . .',
  'Putting hamster in the wheel... ',
  'Beep beep boop...',
  'Initiating the initial init...',
  'Transmitting from a computer in my garage to this pretend computer to your computer... ',
];

const RandomBoot = ({ onDone }) => {
  const num = Math.floor(Math.random() * bootArray.length);
  return (
    <Typist typingDelay={10} finishDelay={1000} onTypingDone={onDone}>
      <p>{bootArray[num]}</p>
    </Typist>
  );
};

export default RandomBoot;

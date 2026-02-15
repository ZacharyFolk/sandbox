import Typist from 'react-typist-component';
import { useState, useEffect, useRef } from 'react';

const images = [
  '/images/monty/monty-1.gif',
  '/images/monty/monty-2.gif',
  '/images/monty/monty-3.gif',
  '/images/monty/monty-4.gif',
  '/images/monty/monty-5.gif',
  '/images/monty/monty-6.gif',
  '/images/monty/monty-7.gif',
  '/images/monty/monty-8.gif',
  '/images/monty/monty-9.gif',
  '/images/monty/monty-10.gif',
  '/images/monty/monty-11.gif',
  '/images/monty/monty-12.gif',
];

const Monty = () => {
  const [showImage, setShowImage] = useState(false);
  const src = useRef(images[Math.floor(Math.random() * images.length)]).current;
  const audioRef = useRef(new Audio('/sounds/monty/intermission-music.mp3'));

  useEffect(() => {
    if (!showImage) return;
    const audio = audioRef.current;
    audio.play().catch(() => {});
    return () => { audio.pause(); audio.currentTime = 0; };
  }, [showImage]);

  return (
    <div className="monty-box">
      <Typist typingDelay={65} onTypingDone={() => setTimeout(() => setShowImage(true), 1000)}>
        <p className="monty-tagline">And now for something completely different.</p>
      </Typist>
      {showImage && (
        <img src={src} alt="Monty Python" className="monty-gif" />
      )}
    </div>
  );
};

export default Monty;

import { useRef } from 'react';

const images = [
  '/images/hhgttg/hhgttg-1.gif',
  '/images/hhgttg/hhgttg-2.gif',
  '/images/hhgttg/hhgttg-3.gif',
  '/images/hhgttg/hhgttg-4.gif',
];

const Hitchhiker = () => {
  const src = useRef(images[Math.floor(Math.random() * images.length)]).current;

  return (
    <img src={src} alt="Hitchhiker's Guide to the Galaxy" className="hhgttg-img" />
  );
};

export default Hitchhiker;

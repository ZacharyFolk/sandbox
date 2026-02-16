import { useRef } from 'react';
import DVDScreensaver from './DVDScreensaver';
import StarfieldScreensaver from './StarfieldScreensaver';
import PipesScreensaver from './PipesScreensaver';
import AquariumScreensaver from './AquariumScreensaver';

const SCREENSAVERS = [
  DVDScreensaver,
  StarfieldScreensaver,
  PipesScreensaver,
  AquariumScreensaver,
];

export default function Screensaver() {
  const Chosen = useRef(
    SCREENSAVERS[Math.floor(Math.random() * SCREENSAVERS.length)]
  ).current;
  return <Chosen />;
}

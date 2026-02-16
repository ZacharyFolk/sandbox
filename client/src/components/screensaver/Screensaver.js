import { useRef, useContext } from 'react';
import { TerminalContext } from '../../context/TerminalContext';
import DVDScreensaver from './DVDScreensaver';
import StarfieldScreensaver from './StarfieldScreensaver';
import PipesScreensaver from './PipesScreensaver';
import AquariumScreensaver from './AquariumScreensaver';

const ALL = [DVDScreensaver, StarfieldScreensaver, PipesScreensaver, AquariumScreensaver];

const BY_NAME = {
  dvd: DVDScreensaver,
  stars: StarfieldScreensaver,
  starfield: StarfieldScreensaver,
  pipes: PipesScreensaver,
  aquarium: AquariumScreensaver,
  fish: AquariumScreensaver,
};

export default function Screensaver() {
  const { screensaverType } = useContext(TerminalContext);
  const Random = useRef(ALL[Math.floor(Math.random() * ALL.length)]).current;
  const Chosen = (screensaverType && BY_NAME[screensaverType]) || Random;
  return <Chosen />;
}

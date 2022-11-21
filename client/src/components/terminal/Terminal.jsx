import { React, useEffect } from 'react';
import { Routes, Route, Outlet, Link } from 'react-router-dom';
import { useSound } from 'use-sound';
// import { terminalInput } from '../../js/io';
import key1 from './../../sounds/key1.mp3';
import key2 from './../../sounds/key2.mp3';
import key3 from './../../sounds/key3.mp3';
import key4 from './../../sounds/key4.mp3';

export default function Terminal() {
  //  const [playSound] = useSound(sound);
  const keys = [key1, key2, key3, key4];

  const [getSound] = useSound(keys[2]);
  async function keyPressed(e) {
    let len = keys.length;
    let rando = Math.floor(Math.random() * len + 1);
    console.log(rando);
    getSound();
    // playSound();
  }

  return (
    <div className='header'>
      <div className='terminal'>
        <span
          onKeyDown={(e) => keyPressed(e)}
          className='terminal-input'
          contentEditable='true'
        ></span>
      </div>
      <div className='tools'>
        <Link to='/'>LINK</Link>
        <Link to='/about'>
          <i className='fas fa-camera'></i>
        </Link>
        <i className='fas fa-terminal'></i>
        <i className='fas fa-record-vinyl'></i>
      </div>
    </div>
  );
}

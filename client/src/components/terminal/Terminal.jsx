import { React, Component, useEffect } from 'react';
import { Routes, Route, Outlet, Link } from 'react-router-dom';
import { useSound } from 'use-sound';
// import { terminalInput } from '../../js/io';
import key1 from './../../sounds/key1.mp3';
import key2 from './../../sounds/key2.mp3';
import key3 from './../../sounds/key3.mp3';
import key4 from './../../sounds/key4.mp3';

class Terminal extends Component {
  constructor(props) {
    super(props);
    this.keys = [key1, key2, key3, key4];
    this.state = {
      number: 0,
    };
    this.rando = this.rando.bind(this);
  }

  playAudio = () => {
    let thing = './../../sounds/key2.mp3';
    console.log(this.state.number);
    new Audio(this.keys[this.state.number]).play();
  };
  rando = (e) => {
    // console.log('key pressed');
    // console.log(e.keyCode);
    let len = this.keys.length;
    this.setState({ number: Math.floor(Math.random() * len) });
    this.playAudio();
  };

  //  const [playSound] = useSound(sound);
  // const keys = [key1, key2, key3, key4];

  // const [getSound] = useSound(keys[2]);
  // async function keyPressed(e) {
  //   let len = keys.length;
  //   let rando = Math.floor(Math.random() * len + 1);
  //   console.log(rando);
  //   getSound();
  //   // playSound();
  // }
  render() {
    return (
      <div className='header'>
        <div className='terminal'>
          <span
            onKeyDown={(e) => this.rando(e)}
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
}

export default Terminal;

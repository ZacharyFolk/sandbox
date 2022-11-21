import { React, Component, useEffect } from 'react';
import { Routes, Route, Outlet, Link } from 'react-router-dom';

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
  }

  handleKeys = (e) => {
    let len = this.keys.length;
    this.setState({ number: Math.floor(Math.random() * len) });
    new Audio(this.keys[this.state.number]).play();
  };

  render() {
    return (
      <div className='header'>
        <div className='terminal'>
          <span
            onKeyDown={(e) => this.handleKeys(e)}
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

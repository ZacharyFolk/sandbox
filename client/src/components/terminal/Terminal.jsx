import { React, Component, useEffect } from 'react';
import {
  Routes,
  Route,
  Outlet,
  Link,
  Navigate,
  useNavigate,
} from 'react-router-dom';

import key1 from './../../sounds/key1.mp3';
import key2 from './../../sounds/key2.mp3';
import key3 from './../../sounds/key3.mp3';
import key4 from './../../sounds/key4.mp3';

class Terminal extends Component {
  constructor(props) {
    super(props);
    console.log('from constructor');
    console.log(props.parseIt);
    this.keys = [key1, key2, key3, key4];
    this.state = {
      number: 0,
      input: '',
    };
    this.cleanInput = this.cleanInput.bind();
    this.commander = this.commander.bind();
  }

  handleKeys = (e) => {
    let len = this.keys.length;
    this.setState({ number: Math.floor(Math.random() * len) });
    new Audio(this.keys[this.state.number]).play();
    console.log(e.keyCode);
    console.log('from handleKeys');

    console.log(this.props.parseIt);

    let code = e.keyCode;
    switch (code) {
      case 13:
        e.preventDefault();
        let typed = e.target.textContent;
        e.target.innerHTML = '';
        //  e.target.setAttribute('contenteditable', false);
        this.setState({ input: typed }, function () {
          let string = this.state.input;

          let command = string.toLowerCase();
          this.props.parseIt(command);
          // this.commander(command);
        });
        // console.log(this.state.input); // Can not use immediately so why need callback ^
        console.log('pressed enter');
        break;
      default:
        console.log('soomething else');
    }
  };

  commander = (command) => {
    // move to parent
    console.log(command);
    switch (command) {
      case 'about':
        break;
      default:
        console.log('what do?');
    }
  };

  cleanInput = () => {};
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

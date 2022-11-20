import React from 'react';
import { Routes, Route, Outlet, Link } from 'react-router-dom';
export default function Terminal() {
  return (
    <div className='header'>
      <div className='terminal'>Terminal</div>
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

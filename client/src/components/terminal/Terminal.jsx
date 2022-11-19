import React from 'react';
import { Routes, Route, Outlet, Link } from 'react-router-dom';
export default function Terminal() {
  return (
    <div className='header'>
      <div class='terminal'>Terminal</div>
      <div class='tools'>
        <Link to='/'>LINK</Link>
        <Link to='/about'>
          <i class='fas fa-camera'></i>
        </Link>
        <i class='fas fa-terminal'></i>
        <i class='fas fa-record-vinyl'></i>
      </div>
    </div>
  );
}

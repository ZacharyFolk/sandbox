import * as React from 'react';
import { useState, useEffect, Component } from 'react';
import { Routes, Route, Outlet, Link, useNavigate } from 'react-router-dom';
import Terminal from './components/terminal/Terminal';
import Register from './pages/register/Register';
import Home from './pages/home/Home';
import About from './pages/about/About';
import Single from './pages/single/Single';
import './main.css';
import './animation.css';

export default function App() {
  const user = false;
  const test = true;
  // const [value, parseIt] = setPath();

  // function setPath() {
  //   let navigate = useNavigate();
  //   console.log('run setPath');
  //   navigate('about');
  // }
  return (
    <div id='crt'>
      <div className='scanline'></div>

      {/* Routes nest inside one another. Nested route paths build upon
            parent route paths, and nested route elements render inside
            parent route elements. See the note about <Outlet> below. */}
      <Routes>
        <Route path='/' element={<Layout />}>
          <Route index element={<Home />} />
          <Route path='/about' element={<About />} />
          <Route path='register' element={user ? <Home /> : <Register />} />
          <Route path='/post/:postId' element={<Single />} />

          {/* Using path="*"" means "match anything", so this route
                acts like a catch-all for URLs that we don't have explicit
                routes for. */}
          <Route path='*' element={<NoMatch />} />
        </Route>
      </Routes>
    </div>
  );
}

function Layout() {
  return (
    <div>
      {/* A "layout route" is a good place to put markup you want to
          share across all the pages on your site, like navigation. */}
      <Terminal />
      {/* 
      <nav>
        <ul>
          <li>
            <Link to='/'>Home</Link>
          </li>
          <li>
            <Link to='/about'>About</Link>
          </li>

          <li>
            <Link to='/nothing-here'>Nothing Here</Link>
          </li>
        </ul>
      </nav>

      <hr /> */}

      {/* An <Outlet> renders whatever child route is currently active,
          so you can think about this <Outlet> as a placeholder for
          the child routes we defined above. */}
      <Outlet />
    </div>
  );
}

function NoMatch() {
  return (
    <div>
      <h2>Nothing to see here!</h2>
      <p>
        <Link to='/'>Go to the home page</Link>
      </p>
    </div>
  );
}

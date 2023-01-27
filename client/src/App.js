import * as React from 'react';
import { useContext, useState } from 'react';
import { Routes, Route, Outlet, Link } from 'react-router-dom';
import Terminal from './components/terminal/Terminal';
import Register from './pages/register/Register';
import Login from './pages/login/Login';
import Home from './pages/home/Home';
import About from './pages/about/About';
import Blog from './pages/blog/Blog';
import Single from './pages/single/Single';
import Write from './pages/write/Write';
import Settings from './pages/settings/Settings';
import Cagematch from './pages/cagematch/Cage';
import Games from './pages/games/Games';
import Trivia from './pages/trivia/Trivia';
import { Context } from './context/Context';
import './main.css';
import './animation.css';
import './prism/prism.css';
import Favicon from 'react-favicon';
import blinky from './blinky';
import { InitialText } from './components/terminal/Commands';
export default function App() {
  const { user } = useContext(Context);
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
          <Route path='/about' element={<About />} />{' '}
          <Route path='/blog' element={<Blog />} />
          {/* <Route path='/register' element={user ? <Home /> : <Register />} /> */}
          <Route path='/games' element={<Games />} />
          <Route path='/cagematch' element={<Cagematch />} />
          <Route path='/trivia' element={<Trivia />} />
          <Route path='/login' element={user ? <Home /> : <Login />} />
          <Route path='/write' element={user ? <Write /> : <Home />} />
          <Route path='/post/:postId' element={<Single />} />
          <Route path='/settings' element={user ? <Settings /> : <Home />} />
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
  // TODO : Look at using Context API for these commands instead of props
  const [command, setCommand] = useState('');
  const [output, setOutput] = useState(InitialText);

  return (
    <div>
      {/* A "layout route" is a good place to put markup you want to
          share across all the pages on your site, like navigation. */}
      <Favicon url={blinky} animationDelay={500} iconSize={16} />
      <Terminal
        command={command}
        setCommand={setCommand}
        output={output}
        setOutput={setOutput}
      />

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

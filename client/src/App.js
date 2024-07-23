import * as React from 'react';
import { useContext } from 'react';
import { Routes, Route, Outlet, Link } from 'react-router-dom';
import Login from './pages/login/Login';
import Home from './pages/home/Home';
import About from './pages/about/About';
import Contact from './pages/contact/Contact';
import Blog from './pages/blog/Blog';
import Single from './pages/single/Single';
import Write from './pages/write/Write';
import Settings from './pages/settings/Settings';
import Trivia from './pages/trivia/Trivia';
import Archives from './pages/archives/Archives';
import { Context } from './context/Context';
// import './main.css';
import './animation.css';
import './prism/prism.css';
import Favicon from 'react-favicon';
import blinky from './blinky';

// import StoryTime from './pages/storytime/StoryTime';
import { Container } from '@mui/material';
import { Header } from './components/Header';
export default function App() {
  const { user } = useContext(Context);

  return (
    <Container className="full-width-hack no-padding-hack">
      {/* Routes nest inside one another. Nested route paths build upon
            parent route paths, and nested route elements render inside
            parent route elements. See the note about <Outlet> below. */}
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/blog" element={<Blog />} />,
          <Route path="/archives/:archiveId" element={<Archives />} />
          {/* <Route path='/register' element={user ? <Home /> : <Register />} /> */}
          <Route path="/contact" element={<Contact />} />
          <Route path="/trivia" element={<Trivia />} />{' '}
          {/* <Route path="/storytime" element={<StoryTime />} /> */}
          <Route path="/login" element={user ? <Home /> : <Login />} />
          <Route path="/write" element={user ? <Write /> : <Home />} />
          <Route path="/post/:postId" element={<Single />} />
          <Route path="/settings" element={user ? <Settings /> : <Home />} />
          {/* Using path="*"" means "match anything", so this route
                acts like a catch-all for URLs that we don't have explicit
                routes for. */}
          <Route path="*" element={<NoMatch />} />
        </Route>
      </Routes>
    </Container>
  );
}

function Layout() {
  return (
    <>
      {/* A "layout route" is a good place to put markup you want to
          share across all the pages on your site, like navigation. */}
      <Favicon url={blinky} animationDelay={500} iconSize={16} />
      {/* <Terminal
        command={command}
        setCommand={setCommand}
        output={output}
        setOutput={setOutput}
      /> */}

      {/* An <Outlet> renders whatever child route is currently active,
          so you can think about this <Outlet> as a placeholder for
          the child routes we defined above. */}
      {/* <Header /> */}
      <Outlet />
    </>
  );
}

function NoMatch() {
  return (
    <div>
      <h2>Nothing to see here!</h2>
      <p>
        <Link to="/">Go to the home page</Link>
      </p>
    </div>
  );
}

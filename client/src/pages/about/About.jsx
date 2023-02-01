import { TerminalContext } from '../../context/TerminalContext';

import selfie from './../../images/matrix-me-small.jpg';
import { SocialIcon } from 'react-social-icons';
import Typist from 'react-typist-component';
import Git from './../../components/git/Git';
import Discogs from './../../components/discogs/Discogs';
import { useContext, useEffect } from 'react';
import GitIssues from '../../components/git/GitIssues';
import Updates from '../../components/updates/Updates';
export default function About() {
  // const { command, updateCommand } = useContext(TerminalContext);
  // useEffect(() => {
  //   updateCommand('about');
  // }, []);

  return (
    <>
      <div className='container about-page-container'>
        <div className='row'>
          <div className='col about-col'>
            <p>
              Welcome to my website, where you'll find my work as a front-end
              developer and photographer, Zachary Folk. I built this site using
              the MERN stack, connecting with various APIs to create dynamic
              content. On the home page, you'll find my digital business card
              featuring my recent activity on GitHub, updates from my WordPress
              photography site, folkphotography.com, and my record collection on
              Discogs.com. The APIs also connect to a MongoDB instance, serving
              as the database for this blog and other features on the website.
            </p>

            <p>
              I find learning to be fun, especially in programming, as the
              limits of your imagination are only constrained by the technology
              available to us. I am currently having a lot of fun experimenting
              with APIs and utilizing the state and hooks of building a React
              app. Games are a great way to learn more about data storage and
              interactivity, and I've added a tab for my game projects, with
              more in the works. Alongside my projects, I plan to write
              tutorials and create short videos to explain how they were built
              and hopefully help others on their coding journey.
            </p>

            <p>
              The terminal in the header is fully interactive and built to
              respond to user input. I see it as the simplest form of AI, as
              it's essentially a complex switch statement. It was a fun
              experiment, and I hope it's fun for any users that stumble upon
              this site. Go ahead and type something and see what happens!
            </p>
          </div>
          <div className='about-sidebar'>
            <Updates />

            <GitIssues />
          </div>
        </div>
      </div>
    </>
  );
}

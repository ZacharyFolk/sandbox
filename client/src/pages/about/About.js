import { TerminalContext } from '../../context/TerminalContext';

import selfie from './../../images/matrix-me-small.jpg';
import { SocialIcon } from 'react-social-icons';
import Typist from 'react-typist-component';
import Git from '../../components/git/Git';
import Discogs from '../../components/discogs/Discogs';
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
      <div className="container about-page-container">
        <div className="row">
          <div className="col about-col">
            <h2 className="about-heading">About this website</h2>
            <p>
              Welcome to my website, you can find out more about my work as a
              front-end developer and explore some of my experiments and
              projects. The terminal in the header is fully interactive and is
              accepting more kinds of input all the time. Type something and see
              what happens!
            </p>
            <p>
              I built this site using the MERN stack and connecting with
              numerous APIs to create the content. On the home page, you'll find
              my digital business card featuring recent activity on GitHub,
              updates from my photography site, and my record collection on
              Discogs.com. The APIs also connect to a MongoDB instance, serving
              as the database for this blog and other features on the website.
            </p>
            <p>
              I love programming, and I am having a lot of fun experimenting
              with APIs and React. Games are a great way to learn and I've added
              a tab for my these little projects, with a lot more in the works.
              I am writing tutorials and creating short videos to explain how
              they were built and hopefully help others on their coding journey!
            </p>
          </div>
          <div className="about-sidebar">
            <Updates />

            <GitIssues />
          </div>
        </div>
      </div>
    </>
  );
}

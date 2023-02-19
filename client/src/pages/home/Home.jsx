import selfie from './../../images/matrix-me-small.jpg';
import Typist from 'react-typist-component';
import Git from './../../components/git/Git';
import GitIssues from './../../components/git/GitIssues';
import Wordpress from './../../components/wordpress/Wordpress';
import Discogs from './../../components/discogs/Discogs';
import { useContext, useEffect } from 'react';
import { TerminalContext } from '../../context/TerminalContext';
import Social from '../../components/social/Social';

export default function Home() {
  // const { command, updateCommand } = useContext(TerminalContext);
  //   useEffect(() => {
  //     updateCommand('about');
  //   }, []);
  const { updateCommand } = useContext(TerminalContext);
  useEffect(() => {
    updateCommand('init');
  }, []);

  return (
    <>
      <div className='container'>
        <div className='row centered'>
          <div className='col selfie-container'>
            <img src={selfie} alt='me' />
            <Social />
          </div>
          <div className='col personal-data'>
            <Typist typingDelay={20}>
              <div className='my-info'>
                <h3>Personal data: </h3>
                <p>
                  Name: Zachary Folk
                  <br />
                  Location: Seattle, Washington, USA
                </p>
              </div>
              <h3>Experience: </h3>
              <p>
                HTML, CSS, javaScript, PHP, mySQL, Analytics, SEO, Node,
                Wordpress, Magento, React, Git, Jira, SEO, Accessibility,
                Performance
              </p>
              <h3>Hobbies: </h3>
              <p>
                photography, biking, guitar, gardening, kayaking, hiking,
                birding, drawing
              </p>

              <Typist.Paste>
                <div className='resume-link'>
                  <a target='_blank' href='resumes/2023-resume-compressed.pdf'>
                    ⬇ Download Latest Résumé ⬇
                  </a>
                </div>
              </Typist.Paste>
            </Typist>
          </div>
        </div>

        <div className='row centered'>
          <div className='col about-container'>
            <div className='github-chart'>
              <img
                src='https://ghchart.rshah.org/zacharyfolk'
                alt='Name Your Github chart'
              />
            </div>
            <h2>
              <i className='fab fa-github-alt'></i> Latest Commits from Github
            </h2>
            <Git />
          </div>
        </div>

        <div className='row'>
          <div className='col  about-container'>
            <h2>
              <i className='fas fa-camera-retro'></i> Latest posts from
              folkphotography
            </h2>
            <Wordpress />
          </div>
        </div>

        <div className='row pad-bottom'>
          <div className='col about-container'>
            <h2>
              <i className='fas fa-record-vinyl'></i> My Record Collection from
              Discogs
            </h2>
            <Discogs />
          </div>
        </div>
      </div>
    </>
  );
}

import { React, useState, useEffect } from 'react';
import axios from 'axios';
import selfie from './../../images/matrix-me-small.jpg';
import { SocialIcon } from 'react-social-icons';
import Typist from 'react-typist-component';
export default function About() {
  return (
    <>
      <div className='container'>
        <div className='row'>
          <div className='col'>
            <Typist typingDelay={50} cursor={<span className='cursor'>|</span>}>
              <div className='my-info'>
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

              <Typist.Delay ms={1500} />
              <h3>Hobbies: </h3>
              <p>
                photography, biking, guitar, gardening, kayaking, hiking,
                birding, drawing
              </p>

              {/* <Typist.Paste>
              <div>
                use
                <div>deeper div</div>
              </div>
            </Typist.Paste> */}
            </Typist>
          </div>

          <div className='col'>
            <img src={selfie} alt='me' />
            <div className='social-container'>
              <SocialIcon
                bgColor='#5bf870'
                url='https://www.linkedin.com/in/zacharyfolk/'
              />
              <SocialIcon
                bgColor='#5bf870'
                url='https://www.instagram.com/zachary_folk/'
              />
              <SocialIcon
                bgColor='#5bf870'
                url='https://github.com/ZacharyFolk'
              />
              <SocialIcon
                title='Folk Photography on Facebook'
                target={'_blank'}
                bgColor='#5bf870'
                url='https://www.facebook.com/zacharyfolkphotography/'
              />
              <SocialIcon
                bgColor='#5bf870'
                url='https://twitter.com/FolkPhotograph1'
              />
              <SocialIcon
                bgColor='#5bf870'
                url='https://stackoverflow.com/users/82330/zac'
              />
            </div>
          </div>
          <div className='col'>
            <Typist typingDelay={10} cursor={<span className='cursor'>|</span>}>
              <h3>About this website</h3>
              <p>
                This website is a sandbox for me. A place where I experimnent
                and learn, mostly from the endless resources on the internet.
                Check out my blog for more information on that.
              </p>
              <Typist.Delay ms={2000} />

              <p>
                If you are interested in working togeterher please contact me
                through whatever appropriate social media or you can use the
                contact form here if you have a particular project in mind.
              </p>
            </Typist>
          </div>
        </div>
      </div>
      <div className='row'>
        <div className='col'>
          <div className='git-container'>
            <Git />
          </div>
        </div>
      </div>
    </>
  );
}

function Git() {
  const [commits, setCommits] = useState([]);

  const url = 'http://localhost:9999/github_api/commit/ZacharyFolk/simplefolk';
  // const url = 'https://api.github.com/repos/ZacharyFolk/simplefolk/commits';
  const localcommits = sessionStorage.getItem('latest-commits');

  useEffect(() => {
    const fetchCommits = async () => {
      // const res = await fetch(url, {
      //   method: 'GET',
      //   headers: headers,
      // });

      if (!localcommits) {
        const res = await axios.get(url);
        const result = await res.data;
        console.log('REQUEST MADE');
        // console.log(result);
        sessionStorage.setItem('latest-commits', JSON.stringify(result));
        setCommits(result);
      }

      // storing commits to stop spamming the API

      setCommits(JSON.parse(localcommits));
      localcommits ? console.log('yes') : console.log('no');
      console.log('COMMITS');
      console.log(commits);

      //   console.log(res);

      const latestCommits = [];
      // res.data.forEach((obj) => {
      //   let commit = {
      //     url: obj.html_url,
      //     data: obj.commit.author.date,
      //     mssg: obj.commit.message,
      //   };
      //   latestCommits.push(commit);
      // });
      // console.log(latestCommits);
    };
    fetchCommits();
  }, []);

  return (
    <>
      <div className='container'>
        <Commits commits={commits} />
      </div>
    </>
  );
}

function Commits({ commits }) {
  console.log('HEY WHAT THIS?');
  console.log(commits);
  commits.map((p, i) => <Commit key={i} commit={p} />);
}
function Commit({ commit }) {
  console.log('======================');
  console.log(commit);
}

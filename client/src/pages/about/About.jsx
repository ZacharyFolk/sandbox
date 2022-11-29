import selfie from './../../images/matrix-me-small.jpg';
import { SocialIcon } from 'react-social-icons';
import Typist from 'react-typist-component';
import Git from './../../components/git/Git';
import Discogs from './../../components/discogs/Discogs';
export default function About() {
  return (
    <>
      <div className='container'>
        <div className='row'>
          <div className='col selfie-container'>
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
          <div className='col personal-data'>
            <Typist typingDelay={50} cursor={<span className='cursor'>|</span>}>
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
        </div>
        <div className='row'>
          <div className='col github-container'>
            <h2>
              <i class='fab fa-github-alt'></i> Latest Commits from Github
            </h2>
            <Git />
          </div>
        </div>
        <div className='row'>
          <div className='col discogs-container'>
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

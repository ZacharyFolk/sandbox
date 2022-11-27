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
          <div className='col about-container'>
            <h3>About this website</h3>
            <p>
              This website is a sandbox for me. A place where I experimnent and
              learn, mostly from the endless resources on the internet. Check
              out my blog for more information on that.
            </p>
            <Typist.Delay ms={2000} />

            <p>
              If you are interested in working togeterher please contact me
              through whatever appropriate social media or you can use the
              contact form here if you have a particular project in mind.
            </p>
          </div>

          <div className='col self-container'>
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
          <div className='col data-container'>
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
          <div className='col'>
            <div className='git-container'>
              <Git />
            </div>
          </div>
        </div>
      </div>
      <div className='row'>
        <div className='git-container'>
          <Git />
        </div>
      </div>
      <div className='row'>
        <div className='discogs-container'>
          <Discogs />
        </div>
      </div>
    </>
  );
}

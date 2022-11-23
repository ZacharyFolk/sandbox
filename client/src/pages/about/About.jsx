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
              <div class='my-info'>
                <p>
                  Name: Zachary Folk
                  <br />
                  Location: Seattle, Washington, USA
                </p>
              </div>
              <h3>Experience: </h3>
              <ul>
                <li>HTML, CSS, javaScript, PHP,</li>
                <li>mySQL, Analytics, SEO, Node</li>
                <li>Wordpress, Magento, React, SEO</li>
                <li>Accessibility, Performance</li>
              </ul>
              <Typist.Delay ms={1500} />
              <h3>Hobbies: </h3>
              <ul>
                <li>photography, biking, guitar,</li>
                <li>gardening, kayaking, hiking,</li>
                <li>birding, drawing</li>
              </ul>

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
                This website is a sandbox for me to experimnent and stay on top
                of the rapidly changing fronend landscape of web development. I
                am having fun with this project and experimnenting but hopefully
                keeping it asccessible and free of errors too.
              </p>
              <p>
                If you are interested in working togeterher please contact me
                through whatever appropriate social media or you can use the
                contact form here if you have a particular project in mind.
              </p>
            </Typist>
          </div>
        </div>
      </div>
    </>
  );
}

import selfie from './../../images/matrix-me-small.jpg';
import Typewriter from 'typewriter-effect';
import { ReactDOM } from 'react';
import { SocialIcon } from 'react-social-icons';
export default function About() {
  return (
    <>
      <div className='about-container'>
        <div className='about-col-1'>
          {/* <Typewriter
            onInit={(typewriter) => {
              typewriter
                .typeString('Hello World!')
                .callFunction(() => {
                  console.log('String typed out!');
                })
                .pauseFor(2500)
                .deleteAll()
                .callFunction(() => {
                  console.log('All strings were deleted');
                })
                .start();
            }}
          /> */}
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Sed,
          distinctio incidunt porro voluptates exercitationem excepturi sequi
          soluta autem harum iure deleniti nihil. Numquam nobis vero eveniet,
          esse earum unde laborum! Lorem ipsum dolor sit amet consectetur
          adipisicing elit. A corporis voluptates ad voluptate blanditiis
          architecto placeat beatae voluptatem, nobis soluta vitae maiores neque
          quas facilis expedita omnis vel reprehenderit veritatis?
        </div>
        <div className='about-col-2'>
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
      </div>
    </>
  );
}

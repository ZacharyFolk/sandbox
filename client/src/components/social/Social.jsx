import { SocialIcon } from 'react-social-icons';
import Typist from 'react-typist-component';

const SocialButtons = () => {
  return (
    <div className="main-social-container">
      <SocialIcon
        title="Zachary Folk on LinkedIn"
        bgColor="#5bf870"
        target={'_blank'}
        url="https://www.linkedin.com/in/zacharyfolk/"
      />
      <SocialIcon
        title="My Instagram"
        bgColor="#5bf870"
        target={'_blank'}
        url="https://www.instagram.com/zachary_folk/"
      />
      <SocialIcon
        title="My Github account"
        bgColor="#5bf870"
        target={'_blank'}
        url="https://github.com/ZacharyFolk"
      />
      <SocialIcon
        title="Folk Photography on Facebook"
        target={'_blank'}
        bgColor="#5bf870"
        url="https://www.facebook.com/zacharyfolkphotography/"
      />
      <SocialIcon
        title="My very unused twitter account"
        bgColor="#5bf870"
        target={'_blank'}
        url="https://twitter.com/FolkPhotograph1"
      />
      <SocialIcon
        title="Before A.I. there was StackOverflow"
        bgColor="#5bf870"
        target={'_blank'}
        url="https://stackoverflow.com/users/82330/zac"
      />
    </div>
  );
};

const Social = () => {
  return (
    <>
      <Typist typingDelay={10}>
        <p>
          Would you like to work together or have any questions? <br />
          <br />I would love to hear from you!
          <br />
          <br />
          {'\u2709'}{' '}
          <a href="mailto:folkcodes@gmail.com">folkcodes@gmail.com</a>
          <br />
          {'\u260E'} <a href="tel:207-714-5203">206.714.5203</a>
          <br />
          {'\u274F'}{' '}
          <a href="/resumes/Zachary Folk-resume-092024-v2.pdf" target="_blank">
            Latest Resume
          </a>{' '}
          <br /> <br /> <br />
        </p>

        <Typist.Paste>
          <SocialButtons />
        </Typist.Paste>
      </Typist>
    </>
  );
};
export default Social;

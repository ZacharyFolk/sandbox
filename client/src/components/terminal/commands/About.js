import Typist from 'react-typist-component';

const About = () => {
  return (
    <>
      <Typist typingDelay={10}>
        <h2 className="main-heading"> **** Folk Codes V 2.0.0 ****</h2>
        <p>
          This started out as a simple digital business card and grew into this
          complex project that includes a complete blog and this "artificial
          intelligence" I wrote, well really it is a huge switch statement that
          I am forever adding little secret commands to amuse myself.
        </p>
        <p>
          There is a full blog interface with a secret login only for me where I
          use TinyMCE CMS and I ramble on about random things, mostly about
          React and coding projects.
        </p>

        <Typist.Paste>
          <img
            src="/images/matrix-me-small.jpg"
            alt="Zachary Folk"
            className="about-selfie"
          />
        </Typist.Paste>

        <p>
          My name is Zachary Folk and I am a developer with a home base near
          Seattle. As much as I enjoy the machines and making pointless apps, I
          am often out in the woods or the middle of the country somewhere.
          Along with computers and music, photography is a lifelong passion for
          me and you can see some of my latest work by typing photos.
        </p>
        <p>
          This domain also houses many of the random experimental apps that I
          build. You can see a list of them by typing projects and most are
          available to play with.
        </p>
        <p>
          If you want to work together or just say hi, type contact to find out
          all the ways to reach out. Thanks for visiting!
        </p>
      </Typist>
    </>
  );
};

export default About;

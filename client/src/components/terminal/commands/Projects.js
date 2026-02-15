import Typist from 'react-typist-component';

const Projects = () => {
  return (
    <Typist typingDelay={10}>
      <p>
        I have been building a lot of random things lately with React like this
        website and it's CMS system. You can see some of my public repos on
        GitHub where I work on a handful of pet projects.
      </p>
      <Typist.Paste>
        <div className="git-cons">
          <img
            src="https://ghchart.rshah.org/zacharyfolk"
            alt="github contributions"
          />{' '}
        </div>
      </Typist.Paste>
      <p>
        Some of these projects are utterly pointless and silly but they were a
        good learning experiences and hopefully provide a minute of random fun
        for others.
      </p>
      <p>
        <a
          href="https://cagematch.folk.codes"
          target="_blank"
          rel="noreferrer"
          className="external-link"
        >
          CAGEMATCH
        </a>{' '}
        <Typist.Paste>
          <img
            src="images/screenshot-cagematch.jpg"
            alt="Cagematch card game"
            className="ss-left"
          />
        </Typist.Paste>
        is a simple matching game with a high score database. It has power-ups
        if you get multiple matches in a row.
      </p>
      <p>It has an abundance of Nicolas Cage. </p>
      <p>
        There is{' '}
        <a
          href="https://folk.codes/post/64023d8da42174866a50a545"
          target="_blank"
          rel="noreferrer"
          className="external-link"
        >
          a blog post
        </a>{' '}
        that tells more about how I made it.
      </p>
      <hr />
      <p>
        <a
          href="https://wutuknow.folk.codes"
          target="_blank"
          rel="noreferrer"
          className="external-link"
        >
          Wutuknow?
        </a>{' '}
        - For this project I created a database and an API to deal with a giant
        json file of over 200,000 Jeopardy questions.
      </p>
      <Typist.Paste>
        <img
          src="images/screenshot-wutuknow.jpg"
          alt="Cagematch card game"
          className="ss-right"
        />
      </Typist.Paste>
      <p>
        The game keeps score of correct answers and has 3 rounds like the show.
      </p>
      <p>
        I learned a lot of things building this like the levenshtein distance
        equation and that I am really bad at Jeopardy.
      </p>
      <p>
        If you play, I apologize if your correct answers are rejected, it uses
        some fuzzy math for the "judges" and often gets it wrong. Have fun!
      </p>
      <hr />
      <p>
        <Typist.Paste>
          <img
            src="images/screenshot-disco.jpg"
            alt="My Disco"
            className="ss-left"
          />
        </Typist.Paste>
        <a
          href="https://disco.folk.codes"
          target="_blank"
          rel="noreferrer"
          className="external-link"
        >
          My Disco
        </a>{' '}
        As a record appreciator and a fan of the Discogs API I decided to try
        building my own app. It is a work in progress but does a number of
        things with your record data.
      </p>

      <p>
        It allows to sort by year, quick search, and charts of your genres.
        Using YouTube it creates a playlist of songs from the record. It also
        has a feature to create images from a random collage of your record
        collection.
      </p>
      <hr />
      <p>
        <a
          href="https://wise-api.folk.codes/api-docs/"
          target="_blank"
          rel="noreferrer"
          className="external-link"
        >
          Wise API
        </a>{' '}
        is a simple collection of quotes from many wise people. It is part of
        another mindfulness app I have been working on for a while. Stay
        tuned...
      </p>
      <p>
        Here is an example request :
        <pre>
          <code class="language-bash">
            curl 'https://wise-api.folk.codes/api/quotes/random'
          </code>
        </pre>
      </p>
      <hr />
      <p>
        <a
          href="https://github.com/ZacharyFolk/simplefolk"
          target="_blank"
          rel="noreferrer"
          className="external-link"
        >
          Simple Folk
        </a>{' '}
        is a project decades in the making that I use for{' '}
        <a
          href="https://folkphotography.com"
          target="_blank"
          rel="noreferrer"
          className="external-link"
        >
          my photography site
        </a>
        . It has now evolved into a very unique WordPress theme. If you have
        photos and want to test it out please reach out, I would love to get
        some feedback on using it.
      </p>

      <p>
        I also build useful things once in a while. Mainly for clients that need
        e-commerce applications or content sites.{' '}
        <a href="/?command=contact">Contact me</a> if you would like to work
        together!
      </p>
    </Typist>
  );
};

export default Projects;

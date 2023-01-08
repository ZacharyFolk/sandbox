import { useEffect } from 'react';
import Typist from 'react-typist-component';
import { useNavigate, Navigate } from 'react-router-dom';

const About = () => {
  const navigate = useNavigate();
  function Redirect() {
    // This never runs :
    // useEffect(() => {
    //   console.log('within effect');
    //   navigate('/about');
    // });
    // This also does nothing
    // return <Navigate to={'about'} />;
    //  Gross but works
    // if (typeof window !== 'undefined') {
    //   window.location.replace('/about');
    // }
  }
  return (
    <Typist
      typingDelay={10}
      cursor={<span className='cursor'>|</span>}
      // Error after moving this to own component :  Do not call Hooks inside other built-in Hooks. You can only call Hooks at the top level of your React function.
      // https://reactjs.org/link/rules-of-hooks
      onTypingDone={navigate('about')}
      // onTypingDone={Redirect}
    >
      <p>Initializing digital resume . . . </p>
      <p>Fetching latest commits from GitHub . . . </p>
      <p>Fetching Zac's record collection from Discogs . . .</p>
      <Typist.Delay ms={500} />
    </Typist>
  );
};

const Help = () => {
  return (
    <Typist typingDelay={25} cursor={<span className='cursor'>|</span>}>
      <p>
        Type <em>commands</em> to see some other things you can try. (Hint:
        There is no bad input, just maybe not the output you expected.)
      </p>
      <p>
        Type <em>about</em> to connect with me or click the ❔ in the upper
        right corner.
      </p>
    </Typist>
  );
};
const Look = () => {
  return (
    <Typist typingDelay={50} cursor={<span className='cursor'>|</span>}>
      This is a path winding through a dimly lit forest. The path leads
      north-south here. One particularly large tree with some low branches
      stands at the edge of the path.
    </Typist>
  );
};

export { Help, Look };

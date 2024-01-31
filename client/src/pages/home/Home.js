import { useContext, useEffect, useRef, useState } from 'react';
import './terminal.css';
import React from 'react';
import {
  AppBar,
  Box,
  Container,
  Grid,
  IconButton,
  Paper,
  Toolbar,
  Typography,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import Typist from 'react-typist-component';
import MenuIcon from '@mui/icons-material/Menu';
import Terminal from '../../components/terminal/Terminal';
import { TerminalContext } from '../../context/TerminalContext';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

// const Prompt = (props) => {
// const [userInput, setUserInput ] = useState('');
// const { command, updateCommand } = useContext(TerminalContext);
// const [enter, setEnter] = useState(false);

// const handleKeys = (e) => {
//   // let len = this.keys.length;
//   // this.setState({ number: Math.floor(Math.random() * len) });
//   // new Audio(this.keys[this.state.number]).play();
//   // console.log(e.keyCode);
//   // console.log('from handleKeys');

//   // console.log(this.props.parseIt);

//   let code = e.keyCode;
//   switch (code) {
//     case 13:
//       e.preventDefault();
//       let typed = e.target.textContent.toLowerCase();
//       e.target.innerHTML = '';
//       props.setOutput('');
//       updateCommand(typed);
//       setEnter(true);
//       break;
//     default:
//     // console.log('something else');
//   }
// };

// return (
//   <div className='terminal' ref={inputRef}>
//             <span
//               className='terminal-input'
//               contentEditable='true'
//               suppressContentEditableWarning={true} // yea I know what I am doing 😜
//               onKeyDown={(e) => handleKeys(e)}
//             ></span>
//           </div>
// )
// }
const Intro = () => {
  const introFinished = () => {
    console.log('Intro finsished');
  };

  return (
    <Typist typingDelay={100} onTypingDone={introFinished}>
      <p>Login : Guest</p>
      <p>Searching for cookies... </p>
    </Typist>
  );
};

export default function Home() {
  const [command, setCommand] = useState('');
  const [viewPrompt, setViewPrompt] = useState(false);

  const [output, setOutput] = useState(null);
  useEffect(() => {
    setOutput(Intro);
  }, []);

  return (
    <Container className="full-width-hack no-padding-hack">
      <AppBar position="sticky">
        <Toolbar sx={{ width: '100%' }}>
          <IconButton size="large" edge="start" sx={{ marginRight: 2 }}>
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Container className="main-grid">
        <Box sx={{ mt: 20, maxWidth: '100%' }}>
          <Grid container spacing={10}>
            <Grid item xs={12} lg={8}>
              <Box className="monitor">
                <div class="bezel">
                  <Terminal
                    command={command}
                    setCommand={setCommand}
                    output={output}
                    setOutput={setOutput}
                  />
                </div>
                {/* <div class="switch">
                <div class="switch-handle"></div>
              </div> */}
              </Box>
            </Grid>
            <Grid item>
              <Box>
                <Typography>Hey stuff</Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </Container>
  );
}

import { typeSound } from './../sounds/index';

async function terminalInput() {
  const onKeyDown = (event) => {
    typeSound();
  };

  // Create input
  let terminal = document.querySelector('.terminal');
  let input = document.createElement('span');
  input.setAttribute('class', 'terminal-input');
  input.setAttribute('contenteditable', true);
  input.addEventListener('keydown', onKeyDown);
  terminal.innerHTML = '';
  terminal.appendChild(input);
  input.focus();
}
export { terminalInput };

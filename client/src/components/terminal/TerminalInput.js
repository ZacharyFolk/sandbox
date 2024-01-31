import { useRef } from "react";





export  const TerminalInput = (props) => {

    const inputRef = useRef();

//  onClick={() => inputRef.current.focus()}
    
    const handleKeys = (e) => {
        // let len = this.keys.length;
        // this.setState({ number: Math.floor(Math.random() * len) });
        // new Audio(this.keys[this.state.number]).play();
        // console.log(e.keyCode);
        // console.log('from handleKeys');
    
        // console.log(this.props.parseIt);
    
        let code = e.keyCode;
        switch (code) {
          case 13:
            e.preventDefault();
            let typed = e.target.textContent.toLowerCase();
            e.target.innerHTML = '';
            props.setOutput('');
            props.updateCommand(typed);
            props.setEnter(true);
            break;
          default:
          // console.log('something else');
        }
      };
    return (

        <div className='terminal' ref={inputRef}>
            <span
              className='terminal-input'
              contentEditable='true'
              suppressContentEditableWarning={true} // yea I know what I am doing 😜
              onKeyDown={(e) => handleKeys(e)}
            ></span>
          </div>
    )
}
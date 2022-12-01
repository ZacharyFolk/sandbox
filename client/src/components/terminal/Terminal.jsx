import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { Context } from '../../context/Context';
export default function Terminal() {
  const { user } = useContext(Context);
  return (
    <div className='header'>
      <div className='terminal'>
        <span className='terminal-input' contentEditable='true'></span>
      </div>
      <div className='tools'>
        <Link to='/'>
          <i className='fa-solid fa-house'></i>
        </Link>
        <Link to='/about'>
          <i className='fa-solid fa-circle-question'></i>
        </Link>
        {user && <i className='fas fa-terminal'></i>}
        {/* <i className='fas fa-terminal'></i> */}
      </div>
    </div>
  );
}

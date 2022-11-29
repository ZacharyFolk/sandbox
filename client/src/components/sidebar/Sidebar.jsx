import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

export default function Sidebar() {
  const [cats, setCats] = useState([]);

  useEffect(() => {
    const getCats = async () => {
      const res = await axios.get('/categories');
      setCats(res.data);
    };
    getCats();
  }, []);
  return (
    <div className='sidebar'>
      <div className='sidebarItem'>
        <div className='sidebarTitle'>About Me</div>
        <p>
          Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quis
          delectus dolores, mollitia, aperiam rem quisquam vero cumque
          quibusdam, obcaecati et velit nihil? Porro nesciunt nulla est,
          accusantium fugiat cumque necessitatibus.
        </p>
      </div>
      <div className='sidebarItem'>
        <div className='sidebarTitle'>Categories</div>
        <ul className='sidebarList'>
          {cats.map((c, i) => (
            <li key={i} className='sidebarListItem'>
              <Link to={`/?cat=${c.name}`}> {c.name}</Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

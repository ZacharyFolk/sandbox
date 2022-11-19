import React from 'react';

export default function Sidebar() {
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
          <li>javaScript</li>
          <li>musings</li>
          <li>poolitics</li>
        </ul>
      </div>
    </div>
  );
}

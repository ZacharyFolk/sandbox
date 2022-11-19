import React from 'react';

export default function Post() {
  return (
    <div className='post'>
      <img src='https://placekitten.com/200/300' alt='' className='postImg' />
      <div className='postInfo'>
        <div className='postCats'>
          <span className='postCat'>javaScript</span>
          <span className='postCat'>react</span>
        </div>
        <span className='postTitle'>Lorem ipsum dolor sit ame</span>
        <hr />
        <span className='postDate'>1 hour ago</span>
      </div>
    </div>
  );
}

import React from 'react';
import Post from '../post/Post';

export default function Posts({ posts }) {
  return (
    <>
      <div className='post-wrapper'>
        <h2>Latest Posts</h2>
        <div className='posts-container new-scroll'>
          {posts.map((p, i) => (
            <Post key={i} post={p} />
          ))}
        </div>
      </div>
    </>
  );
}

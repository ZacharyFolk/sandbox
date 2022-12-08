import React from 'react';
import Post from '../post/Post';
import Typist from 'react-typist-component';

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

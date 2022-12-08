import React from 'react';
import Post from '../post/Post';
import Typist from 'react-typist-component';

export default function Posts({ posts }) {
  return (
    <div className='posts-container new-scroll'>
      <h2>Latest Posts</h2>
      {posts.map((p, i) => (
        <Post key={i} post={p} />
      ))}
    </div>
  );
}

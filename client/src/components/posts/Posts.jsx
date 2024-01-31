import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import fetchCategories from './../../utils/Category';
import Post from '../post/Post';

export default function Posts({ posts }) {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const getCats = async () => {
      let cats = await fetchCategories();
      setCategories(cats);
    };
    getCats();
  }, []);
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
      <div className='sidebar'>
        <div className='category-list'>
          <h2>Categories</h2>
          <ul>
            {categories.map((category) => (
              <li key={category._id}>
                <Link to={`/archives/${category._id}`}>{category.name}</Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}

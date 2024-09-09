import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import fetchCategories from '../../utils/Category';
import Post from '../post/Post';

import { CategoriesAccordion } from './CategoriesAccordion';

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
    <div className="posts-container">
      <div className="main-content">
        <div className="posts-section">
          <h2>Random musings</h2>
          <div className="post-list new-scroll">
            {posts.map((p, i) => (
              <Post key={i} post={p} />
            ))}
          </div>
        </div>
      </div>

      <div className="sidebar">
        <CategoriesAccordion categories={categories} />
      </div>
    </div>
  );
}

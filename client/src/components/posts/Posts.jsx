import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

import Post from '../post/Post';

export default function Posts({ posts }) {
  const [categories, setCategories] = useState([]);
  const axiosInstance = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
  });
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axiosInstance.get('/categories');
        setCategories(data);
      } catch (error) {
        console.log(error.message);
      }
    };
    fetchCategories();
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

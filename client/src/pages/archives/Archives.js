import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation, Link } from 'react-router-dom';
import Post from '../../components/post/Post';
import fetchCategories from '../../utils/Category';

export default function Archives(props) {
  const [posts, setPosts] = useState([]);
  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const location = useLocation();
  const axiosInstance = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
  });
  const categoryId = location.pathname.split('/')[2];

  useEffect(() => {
    const getCats = async () => {
      let cats = await fetchCategories();
      setCategories(cats);
    };
    getCats();
  }, []);
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axiosInstance.get(`/categories/${categoryId}`);
        setPosts(response.data.posts);
        setCategory(response.data.category.name);
      } catch (error) {
        console.error(error);
      }
    };
    fetchPosts();
  }, [categoryId]);

  return (
    <div className="container main blog">
      <div className="post-wrapper">
        <div className="posts-container">
          <h2>Posts for Category: {category}</h2>
          <ul>
            {posts.map((p, i) => (
              <Post key={i} post={p} />
            ))}
          </ul>
        </div>
      </div>
      <div className="sidebar">
        <div className="category-list">
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
    </div>
  );
}

import { React, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Posts from '../../components/posts/Posts';
import Prism from 'prismjs';
import axios from 'axios';
const axiosInstance = axios.create({ baseURL: process.env.REACT_APP_API_URL });

export default function Blog() {
  const [posts, setPosts] = useState([]);
  // const { search } = useLocation();
  // to use search params for categories, see: api/routes/posts // GET ALL POSTS
  // note it added as dependency for useEffect

  useEffect(() => {
    const fetchPosts = async () => {
      const res = await axiosInstance.get('/posts');
      setPosts(res.data);
    };
    fetchPosts();
  }, []);

  useEffect(() => {
    Prism.highlightAll();
  }, []);
  return (
    <>
      <div className='container main blog'>
        <Posts posts={posts} />
      </div>
    </>
  );
}

import { React, useState, useEffect } from 'react';
import Posts from '../../components/posts/Posts';
import Prism from 'prismjs';
import axios from 'axios';
const axiosInstance = axios.create({ baseURL: process.env.REACT_APP_API_URL });

export default function Blog() {
  const [posts, setPosts] = useState([]);
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
  return <Posts posts={posts} />;
}

import { React, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import './home.css';
import Posts from '../../components/posts/Posts';
import Sidebar from '../../components/sidebar/Sidebar';
import axios from 'axios';
export default function Home() {
  const [posts, setPosts] = useState([]);
  const { search } = useLocation();
  // to use search params for categories, see: api/routes/posts // GET ALL POSTS
  // note it added as dependency for useEffect

  useEffect(() => {
    const fetchPosts = async () => {
      const res = await axios.get('/posts' + search);
      setPosts(res.data);
    };
    fetchPosts();
  }, [search]);

  return (
    <>
      <div className='container main'>
        <Posts posts={posts} />
        <Sidebar />
      </div>
    </>
  );
}

import { React, useState, useEffect } from 'react';
import './home.css';
import Posts from '../../components/posts/Posts';
import Sidebar from '../../components/sidebar/Sidebar';
import axios from 'axios';
export default function Home() {
  const [posts, setPosts] = useState([]);

  console.log('home');
  console.log(posts);
  useEffect(() => {
    const fetchPosts = async () => {
      const res = await axios.get('/posts');
      setPosts(res.data);
    };
    fetchPosts();
  }, []);

  return (
    <>
      <div className='container'>
        <Posts posts={posts} />
        <Sidebar />
      </div>
    </>
  );
}

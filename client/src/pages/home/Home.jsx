import { React, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Posts from '../../components/posts/Posts';

import axios from 'axios';
const axiosInstance = axios.create({ baseURL: process.env.REACT_APP_API_URL });

export default function Home() {
  const [posts, setPosts] = useState([]);
  const { search } = useLocation();
  // to use search params for categories, see: api/routes/posts // GET ALL POSTS
  // note it added as dependency for useEffect

  useEffect(() => {
    const fetchPosts = async () => {
      const res = await axiosInstance.get('/posts' + search);
      setPosts(res.data);
    };
    fetchPosts();
  }, [search]);

  return (
    <>
      <div className='container main'>
        <p className='welcome'>
          {/* TODO: Make this a config to store in the db - #4 */}
          Hello! Welcome to the website of Zachary Folk, a developer and
          photographer living in Seattle. Here you can find out more about me,
          read my random musings and tutorials on the blog, or try finding
          easter eggs by typing random stuff into the terminal! Please contact
          me if you are interested in working together or if you have any
          questions. Thanks for visiting! Cheers!
        </p>
        <Posts posts={posts} />
        {/* <div className='col site-summary'>
          <p>Hi!</p>
          <p>
            Thanks for visiting my website. This is a sandbox for me to
            experiment with web development and share some of my ramblings and
            thoughts about technology in my blog.
          </p>
          <p>
            You can try and type commands at the terminal prompt and see what
            happens! This is a project of love and a place you can find out more
            about me and my work. If you are interested in working together or
            just want to say hey then reach out!
          </p>
          <p>
            You can also check out my photography at{' '}
            <a href='https://folkphotography.com' target='_blank'>
              Folk Photography
            </a>
          </p>
        </div> */}
      </div>
    </>
  );
}

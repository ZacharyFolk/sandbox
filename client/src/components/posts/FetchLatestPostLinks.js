import { useContext, useEffect, useState } from 'react';
import DOMPurify from 'dompurify';
import { Box, List, ListItemButton, Typography } from '@mui/material';
import moment from 'moment';
import { Link } from 'react-router-dom';

import axios from 'axios';

const axiosInstance = axios.create({ baseURL: process.env.REACT_APP_API_URL });

const LinkList = ({ post, key }) => {
  if (!post) {
    return null; // Add a check to handle the case when post is not available yet
  }

  console.log(post);
  console.log(post._id);
  console.log(post.title);
  let theLink = `/post/${post._id}`;
  console.log('what link ', theLink);
  return (
    <Box>
      <List>
        <ListItemButton component={Link} to={theLink}>
          {post.title}
        </ListItemButton>
      </List>
    </Box>
  );
};

export const FetchLatestPostLinks = () => {
  const [posts, setPosts] = useState(null);

  useEffect(() => {
    const getLinks = async () => {
      try {
        const response = await axiosInstance.get('/posts/');
        const posts = response.data;
        setPosts(posts);
      } catch (error) {
        console.error('Error fetching latest post:', error);
      }
    };

    getLinks();
  }, []);

  return (
    <Box>{posts && posts.map((p) => <LinkList key={p._id} post={p} />)}</Box>
  );
};

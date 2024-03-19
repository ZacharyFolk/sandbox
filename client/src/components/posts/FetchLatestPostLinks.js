import { useContext, useEffect, useState } from 'react';
import DOMPurify from 'dompurify';
import {
  Box,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from '@mui/material';
import moment from 'moment';
import { Link } from 'react-router-dom';

import axios from 'axios';

const axiosInstance = axios.create({ baseURL: process.env.REACT_APP_API_URL });

const LinkList = ({ post }) => {
  if (!post) {
    return null; // Add a check to handle the case when post is not available yet
  }
  let theLink = `/post/${post._id}`;
  console.log('what link ', theLink);
  return (
    <Box>
      <List className="post-list">
        <ListItemButton component={Link} to={theLink}>
          <ListItemIcon> &gt;</ListItemIcon>
          <ListItemText primary={post.title} />
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

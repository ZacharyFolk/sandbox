import { useContext, useEffect, useState } from 'react';
import DOMPurify from 'dompurify';
import { Box, Typography } from '@mui/material';
import moment from 'moment';
import { Link } from 'react-router-dom';

import axios from 'axios';

const axiosInstance = axios.create({ baseURL: process.env.REACT_APP_API_URL });

const HomePost = ({ post }) => {
  const [excerpt, setExcerpt] = useState('');
  const [featuredImage, setFeaturedImage] = useState('');

  useEffect(() => {
    if (post && post.desc) {
      console.log(post.desc);
      let excerpt = post.desc;
      let featuredImageUrl = '';

      // Find the first image tag in the post description
      const match = excerpt.match(/<img.*?src=['"](.*?)['"]/);
      if (match && match[1]) {
        featuredImageUrl = match[1];
      }

      if (excerpt.length > 450) {
        excerpt = excerpt.substring(0, 350) + '...';
      }
      setExcerpt(excerpt);
      setFeaturedImage(featuredImageUrl);
    }
  }, [post]);

  if (!post) {
    return null; // Add a check to handle the case when post is not available yet
  }

  return (
    <Box>
      <Typography variant="h4" className="post-title" sx={{ mt: 2 }}>
        {post.title}
      </Typography>
      <Typography className="post-date" sx={{ mb: 2 }}>
        {new Date(post.createdAt).toLocaleString()}
      </Typography>
      {featuredImage && (
        <div className="featured-img-container">
          <img className="featured-img" src={featuredImage} alt="" />
        </div>
      )}
      <Typography
        variant="body1"
        component="div"
        dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(excerpt) }}
      />
      <Link to={`/post/${post._id}`} className="full-post">
        Read the full post &gt;
      </Link>
    </Box>
  );
};

export const FetchLatestPost = () => {
  const [latestPost, setLatestPost] = useState(null);

  useEffect(() => {
    const fetchLatestPost = async () => {
      console.log('Fetching latest post... ');
      try {
        const response = await axiosInstance.get('/posts/latest');
        const fetchedLatestPost = response.data;
        setLatestPost(fetchedLatestPost);
        console.log(fetchedLatestPost);
      } catch (error) {
        console.error('Error fetching latest post:', error);
      }
    };

    fetchLatestPost();
  }, []);
  return (
    <Box>
      <HomePost post={latestPost} />
    </Box>
  );
};

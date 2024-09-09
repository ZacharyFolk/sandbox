import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const axiosInstance = axios.create({ baseURL: process.env.REACT_APP_API_URL });

const LinkList = ({ post }) => {
  if (!post) {
    return null; // Add a check to handle the case when post is not available yet
  }
  let theLink = `/post/${post._id}`;
  return (
    <div className="link-list-item">
      <ul className="post-list">
        <li>
          <Link to={theLink}>
            <span className="list-item-icon">&gt;</span> {post.title}
          </Link>
        </li>
      </ul>
    </div>
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
    <div className="post-links-container">
      {posts && posts.map((p) => <LinkList key={p._id} post={p} />)}
    </div>
  );
};

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import DOMPurify from 'dompurify';

const axiosInstance = axios.create({ baseURL: process.env.REACT_APP_API_URL });

const TerminalPostItem = ({ post }) => {
  const [excerpt, setExcerpt] = useState('');

  useEffect(() => {
    if (post && post.desc) {
      let text = post.desc;
      // Strip images for cleaner terminal display
      text = text.replace(/<img[^>]*>/g, '');
      if (text.length > 250) {
        text = text.substring(0, 250) + '...';
      }
      setExcerpt(text);
    }
  }, [post]);

  return (
    <div className="terminal-post-item">
      <h3 className="terminal-post-title">{post.title}</h3>
      <p className="terminal-post-date">
        {new Date(post.createdAt).toLocaleString()}
      </p>
      <div
        className="terminal-post-excerpt"
        dangerouslySetInnerHTML={{
          __html: DOMPurify.sanitize(excerpt),
        }}
      />
      <Link to={`/post/${post._id}`} className="terminal-post-link">
        Read full post →
      </Link>
    </div>
  );
};

export const TerminalPosts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await axiosInstance.get('/posts');
        setPosts(res.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching posts:', err);
        setError('Failed to load posts');
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  if (loading) {
    return <p>Loading posts...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="terminal-posts-container new-scroll">
      <h2>📝 Blog Posts</h2>
      <p className="terminal-posts-intro">
        Random musings about code, life, and everything in between.
      </p>
      <hr />
      {posts.length === 0 ? (
        <p>No posts found.</p>
      ) : (
        posts.map((post) => <TerminalPostItem key={post._id} post={post} />)
      )}
    </div>
  );
};

export default TerminalPosts;

import axios from 'axios';
import { useContext, useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Context } from '../../context/Context';
export default function SinglePost() {
  const location = useLocation();
  // get the id for the post from pathname
  const postid = location.pathname.split('/')[2];
  const [post, setPost] = useState({});
  const PF = 'http://localhost:9999/images/'; // Public Folder of API server
  const { user } = useContext(Context);
  useEffect(() => {
    const getPost = async () => {
      const res = await axios.get('/posts/' + postid);
      setPost(res.data);
    };
    getPost();
  }, []);
  return (
    <div className='singlePost'>
      <div className='singlePostWrapper'>
        {post.photo && (
          <img src={PF + post.photo} alt='' className='singlePostImg' />
        )}

        <h1 className='singlePostTitle'>
          {post.title}
          {post.username === user?.username && ( // this syntax checks that post author matches logged in user and ? prevents error if user null
            <div className='singlePostEdit'>
              <i className='singlePostIcon far fa-edit'></i>
              <i className='singlePostIcon far fa-trash-alt'></i>
            </div>
          )}
        </h1>
        <div className='singlePostInfo'>
          <span className='singlePostAuthor'>
            Author:
            <Link to={`/?user=${post.username}`}>
              <b>{post.username}</b>
            </Link>
          </span>
          <span className='singlePostDate'>
            {new Date(post.createdAt).toDateString()}
          </span>
        </div>
        {post.description}
      </div>
    </div>
  );
}

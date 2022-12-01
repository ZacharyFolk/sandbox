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
  const content = post.description;
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [updateMode, setUpdateMode] = useState(false);

  const handleDelete = async () => {
    console.log('clicked delete');
    try {
      // from posts API  :  if (post.username === req.body.username), can send as data directly with delete method
      await axios.delete(`/posts/${post._id}`, {
        data: { username: user.username },
      });
      window.location.replace('/');
    } catch (error) {}
  };

  const handleUpdate = async () => {
    try {
      await axios.put(`/posts/${post._id}`, {
        username: user.username,
        title,
        desc,
      });

      // window.location.reload();
      setUpdateMode(false);
    } catch (error) {}
  };

  useEffect(() => {
    const getPost = async () => {
      const res = await axios.get('/posts/' + postid);
      setPost(res.data);
      setTitle(res.data.title);
      setDesc(res.data.desc);
    };
    getPost();
  }, [postid]);
  return (
    <div className='singlePost'>
      <div className='singlePostWrapper'>
        {post.photo && (
          <img src={PF + post.photo} alt='' className='singlePostImg' />
        )}
        {updateMode ? (
          <input
            type='text'
            value={title}
            autoFocus
            onChange={(e) => setTitle(e.target.value)}
          />
        ) : (
          <h1 className='singlePostTitle'>
            {title}
            {post.username === user?.username && ( // this syntax checks that post author matches logged in user and ? prevents error if user null
              <div className='singlePostEdit'>
                <i
                  className='singlePostIcon far fa-edit'
                  onClick={() => setUpdateMode(true)}
                ></i>
                <i
                  className='singlePostIcon far fa-trash-alt'
                  onClick={handleDelete}
                ></i>
              </div>
            )}
          </h1>
        )}
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
        {updateMode ? (
          <textarea
            className='singlePostDescInput'
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
          />
        ) : (
          <div
            className='content'
            dangerouslySetInnerHTML={{ __html: desc }} // should use DOMPurify?
          />
        )}
        {updateMode && (
          <button className='singlePostButton' onClick={handleUpdate}>
            Update
          </button>
        )}
      </div>
    </div>
  );
}

// example for sanitizing the data

// import DOMPurify from 'dompurify'

//   const data = `lorem <b onmouseover="alert('mouseover');">ipsum</b>`
//   const sanitizedData = () => ({
//     __html: DOMPurify.sanitize(data)
//   })

//   return (
//     <div
//       dangerouslySetInnerHTML={sanitizedData()}
//     />

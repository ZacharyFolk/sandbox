import axios from 'axios';
import { useContext, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Context } from '../../context/Context';
import useAxiosJWT from '../../utils/tokens';
import Tiny from '../tiny/Tiny';
import Prism from 'prismjs';
export default function SinglePost() {
  const location = useLocation();
  // get the id for the post from pathname
  const postid = location.pathname.split('/')[2];
  const [post, setPost] = useState({});
  const PF = 'http://localhost:9999/images/'; // Public Folder of API server
  const { user } = useContext(Context);
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [updateMode, setUpdateMode] = useState(false);
  const [draft, setDraft] = useState(false);
  const [categories, setCategories] = useState([]);
  const [allCategories, setAllCategories] = useState([]);
  const axiosInstance = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
  });
  const axiosJWT = useAxiosJWT();

  useEffect(() => {
    axiosInstance
      .get('/categories')
      .then((res) => setAllCategories(res.data))
      .catch((err) => console.log(err));
    console.log(allCategories);
  }, []);
  const handleDelete = async () => {
    try {
      // from posts API  :  if (post.username === req.body.username), can send as data directly with delete method

      await axiosJWT.delete(`/posts/${post._id}`, {
        headers: { Authorization: 'Bearer ' + user.accessToken },
        data: { username: user.username },
      });

      window.location.replace('/');
    } catch (error) {
      console.log('Delete did not work', 'Error: ', error);
    }
  };

  const handleUpdate = async () => {
    try {
      await axiosJWT.put(`/posts/${post._id}`, {
        username: user.username,
        title,
        desc,
        draft,
        categories: categories.map((c) => c._id),
      });
      window.location.reload();
      setUpdateMode(false);
    } catch (error) {
      console.log('Problem updating, error: ', error);
    }
  };
  const handleSelectCategory = (e) => {
    const selectedCategory = allCategories.find(
      (c) => c._id === e.target.value
    );
    setCategories([...categories, selectedCategory]);
  };

  useEffect(() => {
    const getPost = async () => {
      const res = await axiosInstance.get('/posts/' + postid);
      setPost(res.data);
      setTitle(res.data.title);
      setDesc(res.data.desc);
    };
    getPost();
  }, [postid]);
  useEffect(() => {
    Prism.highlightAll();
  }, [desc]);

  if (!post) {
    return <div>Nothing here</div>;
  }
  return (
    <div className='container'>
      <div className='post-wrapper'>
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
          {/* <span className='singlePostAuthor'>
            Author:
            <Link to={`/?user=${post.username}`}>
              <b>{post.username}</b>
            </Link>
          </span> */}
          <span className='singlePostDate'>
            {new Date(post.createdAt).toDateString()}
          </span>
        </div>
        {updateMode ? (
          <>
            <Tiny setDesc={setDesc} desc={desc} />

            <div className='button-container'>
              <div className='draft-container'>
                <label>Draft</label>
                <input
                  type='checkbox'
                  checked={draft}
                  onChange={(e) => setDraft(e.target.checked)}
                />
              </div>
              <div className='cat-chooser'>
                <label>Categories</label>
                <select multiple onChange={handleSelectCategory}>
                  {allCategories.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>{' '}
              <button className='singlePostButton' onClick={handleUpdate}>
                Update
              </button>
            </div>
          </>
        ) : (
          <div
            className='content'
            dangerouslySetInnerHTML={{ __html: desc }} // should use DOMPurify?
          />
        )}
      </div>
    </div>
  );
}

// dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(post.desc) }}
// DOMPurify removes too much, if use want to configure
// https://github.com/cure53/DOMPurify/tree/main/demos#what-is-this

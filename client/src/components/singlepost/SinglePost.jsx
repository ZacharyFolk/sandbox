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
  const [categories, setCategories] = useState(new Set());
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
        categories: [...categories],
      });
      //     window.location.reload();
      setUpdateMode(false);
    } catch (error) {
      console.log('Problem updating, error: ', error);
    }
  };

  const handleSelectCategory = (e) => {
    const selectedCategoryId = e.target.value;
    setCategories((prevCategories) => {
      const newCategories = new Set(prevCategories);
      newCategories.add(selectedCategoryId);
      return newCategories;
    });
  };
  useEffect(() => {
    const getPost = async () => {
      const res = await axiosInstance.get('/posts/' + postid);
      setPost(res.data);
      setTitle(res.data.title);
      setDesc(res.data.desc);
      setDraft(res.data.draft);
      let postCatsArray = res.data.categories;
      postCatsArray.forEach((element) => {
        categories.add(element);
      });
    };
    getPost();
  }, []);

  useEffect(() => {
    Prism.highlightAll();
  }, [desc]);

  // This is prob unnecessary as post object fixed to only included selected cats
  // useEffect(() => {
  //   const getPostsCats = async () => {
  //     const res = await axiosInstance.get('/posts/cats/' + postid);
  //     console.log('Selected Categories : ', res.data);

  //     console.log(typeof res.data);
  //   };

  //   getPostsCats();
  // }, [categories]);

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
                {allCategories.map((category) => (
                  <div key={category._id}>
                    <input
                      type='checkbox'
                      id={category._id}
                      value={category._id}
                      checked={categories.has(category._id)}
                      onChange={handleSelectCategory}
                    />
                    <label htmlFor={category._id}>{category.name}</label>
                  </div>
                ))}
              </div>
              <button className='singlePostButton' onClick={handleUpdate}>
                Update
              </button>
            </div>
          </>
        ) : (
          <div className='content' dangerouslySetInnerHTML={{ __html: desc }} />
        )}
      </div>
    </div>
  );
}

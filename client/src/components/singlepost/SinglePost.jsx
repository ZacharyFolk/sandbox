import axios from 'axios';
import { useContext, useEffect, useState, useRef } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Context } from '../../context/Context';
import jwt_decode from 'jwt-decode';
import { Editor } from '@tinymce/tinymce-react';
import Prism from 'prismjs';
export default function SinglePost() {
  const location = useLocation();
  // get the id for the post from pathname
  const postid = location.pathname.split('/')[2];
  const [post, setPost] = useState({});
  const PF = 'http://localhost:9999/images/'; // Public Folder of API server
  const { user } = useContext(Context);
  const [theRefreshToken, setRefreshToken] = useState('');
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [updateMode, setUpdateMode] = useState(false);
  const axiosInstance = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
  });
  const editorRef = useRef(null);

  const refreshToken = async () => {
    console.log(
      '============ USER TOKENS BEFORE HITTING REFRESH ==============='
    );
    console.log('access', user.accessToken);
    console.log('refresh', user.refreshToken);

    try {
      const res = await axiosInstance.post('/auth/refresh', {
        token: user.refreshToken,
      });

      setRefreshToken(res.data.refreshToken);

      console.log('IN USER OBJECT: ', user.refreshToken);

      console.log('IN STATE :', theRefreshToken);
      user.accessToken = res.data.accessToken;
      user.refreshToken = res.data.refreshToken;
      user.email = 'derpity@doo';
      return res.data;
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async () => {
    console.log('clicked delete');
    console.log('user from Context: ', user);
    try {
      // from posts API  :  if (post.username === req.body.username), can send as data directly with delete method

      await axiosJWT.delete(`/posts/${post._id}`, {
        headers: { Authorization: 'Bearer ' + user.accessToken },
        data: { username: user.username },
      });

      console.log('DELETE WORKED');
      window.location.replace('/');
    } catch (error) {
      console.log('Delete dd not work', 'Error: ', error);
    }
  };

  const handleUpdate = async () => {
    console.log(post);
    try {
      await axiosJWT.put(`/posts/${post._id}`, {
        username: user.username,
        title,
        desc,
      });

      // window.location.reload();
      setUpdateMode(false);
    } catch (error) {
      console.log('Problem updating, error: ', error.response.data);
    }
  };

  const axiosJWT = axios.create({ baseURL: process.env.REACT_APP_API_URL });
  axiosJWT.interceptors.request.use(
    async (config) => {
      console.log('INTERCEPTED');
      let currentDate = new Date();
      const decodedToken = jwt_decode(user.accessToken);
      console.log(
        '!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!   INTERECEPTED user before REFRESH : ',
        user
      );

      if (decodedToken.exp * 1000 < currentDate.getTime()) {
        const data = await refreshToken();
        console.log(
          '!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!   INTERECEPTED user returning from REFRESH : ',
          user
        );
        console.log(
          'THIS IS WHAT IS SUBMITTED IN HEADER FROM INTERCEPTOR : ',
          data
        );
        config.headers['Authorization'] = 'Bearer ' + data.accessToken;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
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
  }, []);

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
          <div className='tinyContainer'>
            <Editor
              apiKey={process.env.REACT_APP_TINY_API}
              onInit={(evt, editor) => (editorRef.current = editor)}
              value={desc}
              onEditorChange={(newValue, editor) => setDesc(newValue)}
              init={{
                height: 500,
                menubar: false,
                plugins:
                  'anchor lists advlist emoticons autolink autoresize code',
                selector: 'textarea',
                width: '100%',
                // skin: 'oxide-dark',
                // content_css: 'dark',
                toolbar:
                  'undo redo | formatselect | ' +
                  'bold italic backcolor | alignleft aligncenter ' +
                  'alignright alignjustify | bullist numlist outdent indent | ' +
                  'code removeformat | anchor emoticons restoredraft',
                codesample_global_prismjs: true,
              }}
            />
          </div>
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

// dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(post.desc) }}
// DOMPurify removes too much, if use want to configure
// https://github.com/cure53/DOMPurify/tree/main/demos#what-is-this

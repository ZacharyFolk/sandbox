import { useContext, useState } from 'react';
import axios from 'axios';
import { Context } from '../../context/Context';
import jwt_decode from 'jwt-decode';

export default function Write() {
  const [title, setTitle] = useState('');
  const [desc, sestDesc] = useState('');
  const [file, setFile] = useState(null);
  const { user } = useContext(Context);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newPost = {
      username: user.username,
      title,
      desc,
    };
    if (file) {
      const data = new FormData();
      const filename = Date.now() + file.name; // something to prevent images with same name
      data.append('name', filename);
      data.append('file', file);
      newPost.photo = filename;

      try {
        await axios.post('/upload', data);
      } catch (error) {}
    }
    try {
      const res = await axiosJWT.post('/posts', newPost);
      console.log(res.data_id);
      window.location.replace('/post/' + res.data._id);
    } catch (error) {}
  };
  const refreshToken = async () => {
    console.log(user.accessToken);

    console.log('RUNNING REFRESH TOKEN FUNCTION');
    try {
      const res = await axios.post('/auth/refresh', {
        token: user.refreshToken,
      });
      user.accessToken = res.data.accessToken;
      user.refreshToken = res.data.refreshToken;

      return res.data;
    } catch (error) {
      console.log(error);
    }
  };
  const axiosJWT = axios.create();

  // 🐛 this seems to only work after the initial expiry?

  axiosJWT.interceptors.request.use(
    async (config) => {
      console.log('INTERCEPTED');
      let currentDate = new Date();
      const decodedToken = jwt_decode(user.accessToken);
      console.log(decodedToken);
      if (decodedToken.exp * 1000 < currentDate.getTime()) {
        let data = await refreshToken();
        console.log('INTERECEPTED user: ', user);
        config.headers['Authorization'] = 'Bearer ' + data.accessToken;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  return (
    <div className='write'>
      {file && (
        <img className='writeImg' src={URL.createObjectURL(file)} alt='' />
      )}
      <form action='' className='writeForm' onSubmit={handleSubmit}>
        <div className='writeFormGroup'>
          <label htmlFor='fileInput'>
            <i className='writeIcon fas fa-plus'></i>
          </label>
          <input
            type='file'
            id='fileInput'
            style={{ display: 'none' }}
            onChange={(e) => setFile(e.target.files[0])}
          />
          <input
            type='text'
            placeholder='Title'
            className='writeInput'
            autoFocus={true}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className='writeFormGroup'>
          <textarea
            placeholder='Tell your story..'
            type='text'
            className='writeInput writeText'
            onChange={(e) => sestDesc(e.target.value)}
          ></textarea>
          <button className='writeSubmit' type='submit'>
            Publish
          </button>
        </div>
      </form>
    </div>
  );
}

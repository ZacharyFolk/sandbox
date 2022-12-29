import { useContext, useState } from 'react';
import { Context } from '../../context/Context';
import axios from 'axios';
import jwt_decode from 'jwt-decode';

export default function Settings() {
  const { user } = useContext(Context);
  const [file, setFile] = useState(null);
  const [username, setUsername] = useState(user.username);
  const [email, setEmail] = useState(user.email);
  const [password, setPassword] = useState('');
  const [success, setSuccess] = useState(false);
  const axiosInstance = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
  });
  const handleSubmit = async (e) => {
    console.log('From context : ', user.email, user.password, user.username);
    e.preventDefault();
    const updatedUser = {
      userId: user._id,
      username,
      email,
    };
    if (password) {
      updatedUser.password = password;
    }
    console.log('UPDATED USER: ', updatedUser);
    console.log(user.accessToken);
    if (file) {
      const data = new FormData();
      const filename = Date.now() + file.name;
      data.append('name', filename);
      data.append('file', file);
      updatedUser.profilePic = filename;

      try {
        await axios.post('/upload', data);
      } catch (error) {
        console.log('Error with update : ', error);
      }
    }
    try {
      await axiosJWT.put('/users/' + user._id, updatedUser);
      setSuccess(true);
    } catch (error) {}
  };

  const refreshToken = async () => {
    try {
      const res = await axiosInstance.post('/auth/refresh', {
        token: user.refreshToken,
      });
      user.accessToken = res.data.accessToken;
      user.refreshToken = res.data.refreshToken;

      return res.data;
    } catch (error) {
      console.log(error);
    }
  };

  const axiosJWT = axios.create({ baseURL: process.env.REACT_APP_API_URL });

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
      } else {
        config.headers['Authorization'] = 'Bearer ' + user.accessToken;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  return (
    <div className='settings'>
      <div className='settingsWrapper'>
        <div className='settingsTitle'>
          <span className='settingsUpdateTitle'>Update Your Account</span>
          <span className='settingsDeleteTitle'>Delete Your Account</span>
        </div>
        <form action='' className='settingsForm' onSubmit={handleSubmit}>
          <label htmlFor=''>Profile Picture</label>
          <div className='settingsPP'>
            <img src='' alt='' />
            <label htmlFor='fileInput'>
              <i className='settinsPPIcon far fa-user-circle'></i>
            </label>
            <input
              type='file'
              id='fileInput'
              style={{ display: 'none' }}
              onChange={(e) => setFile(e.target.files[0])}
            />
          </div>
          <label>Username</label>
          <input
            type='text'
            placeholder={user.username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <label htmlFor=''>Email</label>
          <input
            type='email'
            placeholder={user.email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <label htmlFor=''>Password</label>
          <input
            type='password'
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type='submit' className='settingsSubmit'>
            Update
          </button>
          {success && <div>You updated your user.</div>}
        </form>
      </div>
    </div>
  );
}

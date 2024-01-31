import axios from 'axios';
import { useRef, useContext } from 'react';

import { Context } from '../../context/Context';

const axiosInstance = axios.create({ baseURL: process.env.REACT_APP_API_URL });

export default function Login() {
  const userRef = useRef();
  const passwordRef = useRef();
  const { dispatch, isFetching } = useContext(Context);
  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch({ type: 'LOGIN_START' });
    try {
      const res = await axiosInstance.post('/auth/login', {
        username: userRef.current.value,
        password: passwordRef.current.value,
      });

      console.log('Dispatch LOGIN_SUCCESS from login.jsx');
      console.log('payload: res.data =>', res.data);

      dispatch({ type: 'LOGIN_SUCCESS', payload: res.data });
    } catch (error) {
      console.log('Dispatch LOGIN_FAILURE from login.jsx');
      console.log(error);
      dispatch({ type: 'LOGIN_FAILURE' });
    }
  };

  return (
    <div className='login'>
      <span className='loginTitle'>LOGIN</span>
      <form className='loginForm' onSubmit={handleSubmit}>
        <label htmlFor=''>Username</label>
        <input
          type='text'
          className='loginInput'
          placeholder='Enter your username'
          ref={userRef}
        />
        <label>Password</label>
        <input
          type='password'
          className='loginInput'
          placeholder='Enter your password.. '
          ref={passwordRef}
        />
        <button className='loginButton' type='submit' disabled={isFetching}>
          LOGIN
        </button>
      </form>
    </div>
  );
}

import axios from 'axios';
import { useRef, useContext } from 'react';

import { Context } from '../../context/Context';
export default function Login() {
  const userRef = useRef();
  const passwordRef = useRef();
  const { user, dispatch, isFetching } = useContext(Context);

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch({ type: 'LOGIN_START' });
    try {
      const res = await axios.post('/auth/login', {
        username: userRef.current.value,
        password: passwordRef.current.value,
      });
      dispatch({ type: 'LOGIN_SUCCESS', payload: res.data });
    } catch (error) {
      dispatch({ type: 'LOGIN_FAILURE' });
    }
  };
  console.log(user);
  console.log(dispatch);
  console.log(isFetching);
  return (
    <div className='login'>
      <span className='loginTitle'>Login</span>
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
        <button className='loginButton' type='submit'>
          LOGIN
        </button>
      </form>
    </div>
  );
}

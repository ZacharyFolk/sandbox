import { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './register.css';
export default function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const axiosInstance = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
  });
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(false);

    try {
      const res = await axiosInstance.post('/auth/register/', {
        username,
        email,
        password,
      });

      res.data && window.location.replace('/login');
    } catch (error) {
      console.log(error);
      setError(true);
    }
  };
  return (
    <div className='register'>
      <h1>Register</h1>
      <form action='' className='registerForm' onSubmit={handleSubmit}>
        <label htmlFor='username'>Username</label>
        <input
          type='text'
          placeholder='Enter your username'
          onChange={(e) => setUsername(e.target.value)}
        />
        <label htmlFor=''>Email</label>
        <input
          type='text'
          placeholder='Enter email'
          onChange={(e) => setEmail(e.target.value)}
        />
        <label htmlFor=''>Password</label>
        <input
          type='password'
          placeholder='Enter your password'
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className='registerButton' type='submit'>
          Register
        </button>
      </form>

      <button className='registerLoginButton'>
        <Link to='/login'>Login</Link>
      </button>

      {error && <span>Something went wrong</span>}
    </div>
  );
}

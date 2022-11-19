import React from 'react';

export default function Register() {
  return (
    <div className='register'>
      <span className='registerTitle'>Register</span>
      <form action='' className='registerForm'>
        <label htmlFor=''>Email</label>
        <input
          type='text'
          className='registerInput'
          placeholder='Enter email'
        />
        <label htmlFor=''>Password</label>
        <input
          type='password'
          className='registerInput'
          placeholder='Enter your password'
        />
        <button className='regiserButton'>Register</button>
      </form>
      <button className='registerLoginButton'>Login</button>
    </div>
  );
}

export default function Login() {
  return (
    <div className='login'>
      <span className='loginTitle'>Login</span>
      <form className='loginForm'>
        <label htmlFor=''>Email</label>
        <input
          type='text'
          className='loginInput'
          placeholder='Enter your email'
        />
        <label>Password</label>
        <input
          type='password'
          className='loginInput'
          placeholder='Enter your password.. '
        />
        <button className='loginButton'>LOGIN</button>
      </form>
    </div>
  );
}

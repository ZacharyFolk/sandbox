import { useContext, useState } from 'react';
import Sidebar from '../../components/sidebar/Sidebar';
import { Context } from '../../context/Context';
import axios from 'axios';
export default function Settings() {
  const { user } = useContext(Context);

  const [file, setFile] = useState(null);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');

  const [password, setPassword] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const updatedUser = {
      userId: user._id,
      username,
      email,
      password,
    };
    if (file) {
      const data = new FormData();
      const filename = Date.now() + file.name;
      data.append('name', filename);
      data.append('file', file);
      updatedUser.profilePic = filename;

      try {
        await axios.post('/upload', data);
      } catch (error) {}
    }
    try {
      await axios.put('/users/' + user._id, updatedUser);
      setSuccess(true);
    } catch (error) {}
    console.log(user);
  };

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
      <Sidebar />
    </div>
  );
}

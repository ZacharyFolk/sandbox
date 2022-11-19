import React from 'react';
import Sidebar from '../../components/sidebar/Sidebar';

export default function Settings() {
  return (
    <div className='settings'>
      <div className='settingsWrapper'>
        <div className='settingsTitle'>
          <span className='settingsUpdateTitle'>Update Your Account</span>
          <span className='settingsDeleteTitle'>Delete Your Account</span>
        </div>
        <form action='' className='settingsForm'>
          <label htmlFor=''>Profile Picture</label>
          <div className='settingsPP'>
            <img src='' alt='' />
            <label htmlFor='fileInput'>
              <i className='settinsPPIcon far fa-user-circle'></i>
            </label>
            <input type='file' id='fileInput' style={{ display: 'none' }} />
          </div>
          <label>Username</label>
          <input type='text' placeholder='Zac' />
          <label htmlFor=''>Email</label>
          <input type='email' placeholder='zacharyfolk@gmail.com' />
          <label htmlFor=''>Password</label>
          <input type='password' />
          <button className='settingsSubmit'>Update</button>
        </form>
      </div>
      <Sidebar />
    </div>
  );
}

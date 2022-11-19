import React from 'react';

export default function Write() {
  return (
    <div className='write'>
      <form action='' className='writeForm'>
        <div className='writeFormGroup'>
          <label htmlFor='fileInput'>
            <i className='writeIcon fas fa-plus'></i>
          </label>
          <input type='file' id='fileInput' style={{ display: 'none' }} />
          <input
            type='text'
            placeholder='Title'
            className='writeInput'
            autoFocus={true}
          />
        </div>
        <div className='writeFormGroup'>
          <textarea
            placeholder='Tell your story..'
            type='text'
            className='writeInput writeText'
          ></textarea>
          <button className='writeSubmit'>Publish</button>
        </div>
      </form>
    </div>
  );
}

import { useContext, useState, useRef } from 'react';
import axios from 'axios';
import { Context } from '../../context/Context';
import jwt_decode from 'jwt-decode';
import { Editor } from '@tinymce/tinymce-react';
import './write.css';
export default function Write() {
  const [title, setTitle] = useState('');
  const [desc, sestDesc] = useState('');
  const [file, setFile] = useState(null);
  const { user } = useContext(Context);
  const editorRef = useRef(null);

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
      <div className='writeFormGroup'>
        <div className='image-upload'>
          <label htmlFor='fileInput'>
            <i className='writeIcon fas fa-plus'> </i>
            <span>Add main image</span>
          </label>
          <input
            type='file'
            id='fileInput'
            style={{ display: 'none' }}
            onChange={(e) => setFile(e.target.files[0])}
          />
        </div>

        <div className='title-container'>
          <input
            type='text'
            placeholder='Title'
            className='writeInput'
            id='post_title'
            autoFocus={true}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className='tinyContainer'>
          <Editor
            apiKey={process.env.REACT_APP_TINY_API}
            onInit={(evt, editor) => (editorRef.current = editor)}
            initialValue='<p>Write something amazing.</p>'
            value={desc}
            onEditorChange={(newValue, editor) => sestDesc(newValue)}
            init={{
              height: 500,
              menubar: false,
              plugins:
                'anchor lists advlist emoticons autolink autoresize code',
              selector: 'textarea',
              width: '100%',
              // skin: 'oxide-dark',
              // content_css: 'dark',
              toolbar:
                'undo redo | formatselect | ' +
                'bold italic backcolor | alignleft aligncenter ' +
                'alignright alignjustify | bullist numlist outdent indent | ' +
                'code removeformat | anchor emoticons restoredraft',
              content_style:
                'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
            }}
          />
        </div>

        <div className='button-container'>
          <button onClick={handleSubmit}>Submit</button>
        </div>
      </div>
    </div>
  );
}

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
  const axiosInstance = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
  });

  const handleSubmit = async (e) => {
    console.log('CLICK SUBMIT');
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
      window.location.replace('/post/' + res.data._id);
    } catch (error) {
      console.log('Post failed', error.message);
    }
  };

  const refreshToken = async () => {
    try {
      const res = await axiosInstance.post('/auth/refresh', {
        token: user.refreshToken,
      });
      user.refreshToken = res.data.refreshToken;
      localStorage.setItem('user', JSON.stringify(user));
      user.accessToken = res.data.accessToken;
      return res.data;
    } catch (error) {
      console.log(error);
    }
  };

  const axiosJWT = axios.create({ baseURL: process.env.REACT_APP_API_URL });

  // 🐛 this seems to only work after the initial expiry?

  axiosJWT.interceptors.request.use(
    async (config) => {
      let currentDate = new Date();
      const decodedToken = jwt_decode(user.accessToken);
      if (decodedToken.exp * 1000 < currentDate.getTime()) {
        let data = await refreshToken();
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
              menubar: 'insert',
              file_picker_types: 'file image media',
              image_uploadtab: true,
              images_file_types: 'jpg,svg,webp',
              images_upload_handler: function (blobInfo, success, failure) {
                let data = new FormData();
                data.append('file', blobInfo.blob(), blobInfo.filename());
                axios
                  .post('/upload', data)
                  .then(function (res) {
                    success(res.data.location);
                  })
                  .catch(function (err) {
                    failure('HTTP Error: ' + err.message);
                  });
              },
              plugins:
                'anchor lists advlist emoticons autolink autoresize code codesample image',
              selector: 'textarea',
              width: '100%',
              // skin: 'oxide-dark',
              // content_css: 'dark',
              toolbar:
                'undo redo | formatselect | ' +
                'bold italic backcolor | alignleft aligncenter ' +
                'alignright alignjustify | bullist numlist outdent indent | ' +
                'image | code codesample removeformat | anchor emoticons restoredraft',
              codesample_global_prismjs: true,
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

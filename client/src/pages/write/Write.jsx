import { useContext, useEffect, useState, useRef } from 'react';
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
  const [draft, setDraft] = useState(false);
  const [categories, setCategories] = useState([]);
  const [allCategories, setAllCategories] = useState([]);
  const [newCategory, setNewCategory] = useState('');
  const editorRef = useRef(null);
  const axiosInstance = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
  });

  useEffect(() => {
    axiosInstance
      .get('/categories')
      .then((res) => setAllCategories(res.data))
      .catch((err) => console.log(err));
    console.log(allCategories);
  }, [newCategory]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newPost = {
      username: user.username,
      title,
      desc,
      draft,
      categories: categories.map((c) => c._id),
    };

    try {
      const res = await axiosJWT.post('/posts', newPost);
      window.location.replace('/post/' + res.data._id);
    } catch (error) {
      console.log('Post failed', error.message);
    }
  };
  const handleSelectCategory = (e) => {
    const selectedCategory = allCategories.find(
      (c) => c._id === e.target.value
    );
    setCategories([...categories, selectedCategory]);
  };

  const handleNewCategory = (e) => {
    console.log(e.target.value);
    setNewCategory(e.target.value);
  };

  const addNewCategory = async () => {
    console.log('new one?', newCategory);
    const cat = {
      name: newCategory,
    };
    try {
      const res = await axiosJWT.post('/categories', cat);
    } catch (error) {
      console.log(error);
    }
  };

  const my_upload_handler = async (blobInfo, progress) => {
    let data = new FormData();
    data.append('file', blobInfo.blob(), blobInfo.filename());

    try {
      const res = await axiosJWT.post(
        'http://localhost:9999/upload/image',
        data
      );
      console.log('res.data =>', res.data);
      return res.data.location;
    } catch (error) {
      console.log('upload handler error : ', error);
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
        console.log('TOKEN HAS EXPIRED, STARTING REFRESH FUNCTION');
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
              images_file_types: 'jpg,jpeg,gif,png,svg,webp',
              // images_upload_url: 'http://localhost:9999/upload/image',
              //    images_upload_base_path: 'http://localhost:9999/',
              images_upload_handler: my_upload_handler,
              // images_upload_handler: function (blobInfo, success, failure) {
              //   // TODO : #23
              //   // axiosInstance
              //   //   .post('/upload/image', data)
              //   //   .then(function (res) {
              //   //     console.log(res.data);
              //   //     success(res.data.location);
              //   //   })
              //   //   .catch(function (err) {
              //   //     console.log('error', err.message);
              //   //     failure('HTTP Error: ' + err.message);
              //   //   });
              // },

              plugins:
                'anchor lists advlist emoticons link autolink autoresize code codesample image',
              selector: 'textarea',
              browser_spellcheck: true,
              contextmenu: false,
              width: '100%',
              // skin: 'oxide-dark',
              // content_css: 'dark',
              toolbar:
                'undo redo | formatselect | ' +
                'bold italic backcolor | alignleft aligncenter ' +
                'alignright alignjustify | bullist numlist outdent indent | ' +
                'image link | code codesample removeformat | anchor emoticons restoredraft',
              codesample_global_prismjs: true,
            }}
          />
        </div>

        <div className='button-container'>
          <div className='draft-container'>
            <label>Draft</label>
            <input
              type='checkbox'
              checked={draft}
              onChange={(e) => setDraft(e.target.checked)}
            />
          </div>
          <div className='cat-chooser'>
            <label>Categories</label>
            <select multiple onChange={handleSelectCategory}>
              {allCategories.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div className='newCat'>
            <input
              className='catInput'
              placeholder='New Category'
              type='text'
              onChange={handleNewCategory}
            />
            <button onClick={addNewCategory}>Add New Category</button>
          </div>
          <button onClick={handleSubmit}>Submit</button>
        </div>
      </div>
    </div>
  );
}

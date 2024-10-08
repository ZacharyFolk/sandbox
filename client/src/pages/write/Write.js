import { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { Context } from '../../context/Context';
import Tiny from '../../components/tiny/Tiny';
import useAxiosJWT from '../../utils/tokens';

export default function Write() {
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const { user } = useContext(Context);
  const [draft, setDraft] = useState(false);
  const [categories, setCategories] = useState([]);
  const [allCategories, setAllCategories] = useState([]);
  const [newCategory, setNewCategory] = useState('');

  const axiosJWT = useAxiosJWT();

  useEffect(() => {
    const axiosInstance = axios.create({
      baseURL: process.env.REACT_APP_API_URL,
    });
    axiosInstance
      .get('/categories')
      .then((res) => setAllCategories(res.data))
      .catch((err) => console.log(err));
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
      //  window.location.replace('/post/' + res.data._id);

      // TODO : Instead of relocate just provide a snack that post is updated
      console.log('POST UPDATED');
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
    setNewCategory(e.target.value);
  };

  const addNewCategory = async () => {
    const cat = {
      name: newCategory,
    };
    try {
      const res = await axiosJWT.post('/categories', cat);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="write-container">
      <div className="form-group">
        <label htmlFor="title">Title</label>
        <input
          id="title"
          type="text"
          className="form-control"
          autoFocus={true}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      <div className="form-group">
        <Tiny setDesc={setDesc} desc={desc} />
      </div>

      <div className="form-group select-group">
        <label htmlFor="categories">Categories</label>
        <select
          multiple
          value={categories.map((cat) => cat._id)}
          onChange={handleSelectCategory}
          className="form-control"
        >
          {allCategories.map((c) => (
            <option key={c._id} value={c._id}>
              {c.name}
            </option>
          ))}
        </select>

        <label htmlFor="new-category">New Category</label>
        <input
          id="new-category"
          type="text"
          className="form-control"
          onChange={handleNewCategory}
        />
        <button onClick={addNewCategory} className="btn">
          Add New Category
        </button>
      </div>

      <div className="form-group">
        <label>
          <input
            type="checkbox"
            checked={draft}
            onChange={(e) => setDraft(e.target.checked)}
          />{' '}
          Draft
        </label>
      </div>

      <button onClick={handleSubmit} className="btn btn-submit">
        Submit
      </button>
    </div>
  );
}

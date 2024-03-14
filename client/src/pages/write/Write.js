import {
  Container,
  TextField,
  Button,
  Checkbox,
  Select,
  MenuItem,
  Chip,
  FormControlLabel,
  Box,
} from '@mui/material';
import { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { Context } from '../../context/Context';
import Tiny from '../../components/tiny/Tiny';
import useAxiosJWT from '../../utils/tokens';
export default function Write() {
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [file, setFile] = useState(null);
  const { user } = useContext(Context);
  const [draft, setDraft] = useState(false);
  const [categories, setCategories] = useState([]);
  const [allCategories, setAllCategories] = useState([]);
  const [newCategory, setNewCategory] = useState('');
  const axiosInstance = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
  });

  const axiosJWT = useAxiosJWT();

  useEffect(() => {
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
    <Container>
      <Box sx={{ mt: 4 }}>
        <TextField
          label="Title"
          variant="outlined"
          autoFocus={true}
          onChange={(e) => setTitle(e.target.value)}
        />
      </Box>
      <Box sx={{ mt: 4, mb: 4 }}>
        <Tiny setDesc={setDesc} desc={desc} />
      </Box>
      <Box sx={{ display: 'flex' }}>
        <Select
          multiple
          value={categories}
          onChange={handleSelectCategory}
          renderValue={(selected) => (
            <div>
              {selected.map((value) => (
                <Chip key={value._id} label={value.name} />
              ))}
            </div>
          )}
        >
          {allCategories.map((c) => (
            <MenuItem key={c._id} value={c}>
              {c.name}
            </MenuItem>
          ))}
        </Select>

        <TextField
          label="New Category"
          variant="outlined"
          onChange={handleNewCategory}
        />
        <Button variant="contained" onClick={addNewCategory}>
          Add New Category
        </Button>
      </Box>
      <FormControlLabel
        control={
          <Checkbox
            checked={draft}
            onChange={(e) => setDraft(e.target.checked)}
            inputProps={{ 'aria-label': 'primary checkbox' }}
          />
        }
        label="Draft"
      />
      <Button variant="contained" onClick={handleSubmit}>
        Submit
      </Button>
    </Container>
  );
}

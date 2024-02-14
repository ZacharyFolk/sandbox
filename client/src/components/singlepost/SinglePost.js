import axios from 'axios';
import { useContext, useEffect, useState } from 'react';
import {
  Box,
  Container,
  Grid,
  IconButton,
  Paper,
  Typography,
} from '@mui/material';
import { useLocation } from 'react-router-dom';
import { Context } from '../../context/Context';
import useAxiosJWT from '../../utils/tokens';
import Tiny from '../tiny/Tiny';
import Prism from 'prismjs';
import EditNoteIcon from '@mui/icons-material/EditNote';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
const SinglePost = () => {
  const location = useLocation();
  const postid = location.pathname.split('/')[2];
  const [post, setPost] = useState({});
  const { user } = useContext(Context);
  const [formData, setFormData] = useState({
    title: '',
    desc: '',
    draft: false,
    categories: new Set(),
  });
  const [allCategories, setAllCategories] = useState([]);
  const [updateMode, setUpdateMode] = useState(false); // Added updateMode state
  const axiosInstance = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
  });
  const axiosJWT = useAxiosJWT();

  useEffect(() => {
    axiosInstance
      .get('/categories')
      .then((res) => setAllCategories(res.data))
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    const getPost = async () => {
      const res = await axiosInstance.get('/posts/' + postid);
      setPost(res.data);
      setFormData({
        title: res.data.title,
        desc: res.data.desc,
        draft: res.data.draft,
        categories: new Set(res.data.categories),
      });
    };
    getPost();
  }, []);

  const handleDelete = async () => {
    try {
      await axiosJWT.delete(`/posts/${post._id}`, {
        headers: { Authorization: 'Bearer ' + user.accessToken },
        data: { username: user.username },
      });
      window.location.replace('/');
    } catch (error) {
      console.log('Delete did not work', 'Error: ', error);
    }
  };

  const handleUpdate = async () => {
    try {
      await axiosJWT.put(`/posts/${post._id}`, {
        username: user.username,
        ...formData,
        categories: [...formData.categories],
      });
      setUpdateMode(false);
    } catch (error) {
      console.log('Problem updating, error: ', error);
    }
  };

  const handleSelectCategory = (e) => {
    const selectedCategoryId = e.target.value;
    const isChecked = e.target.checked;
    setFormData((prevFormData) => ({
      ...prevFormData,
      categories: isChecked
        ? new Set([...prevFormData.categories, selectedCategoryId])
        : new Set(
            [...prevFormData.categories].filter(
              (cat) => cat !== selectedCategoryId
            )
          ),
    }));
  };

  useEffect(() => {
    Prism.highlightAll();
  }, [formData.desc]);

  if (!post) {
    return <div>Nothing here</div>;
  }

  return (
    <Container>
      <Grid container spacing={2}>
        <Grid item xs={8}>
          <Paper style={{ padding: '20px' }}>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}
            >
              <Typography variant="h4" gutterBottom>
                {formData.title}
              </Typography>

              {post.username === user?.username && (
                <Box>
                  <IconButton onClick={() => setUpdateMode(true)}>
                    <EditNoteIcon />
                  </IconButton>

                  <IconButton onClick={handleDelete}>
                    <DeleteForeverIcon />
                  </IconButton>
                </Box>
              )}
            </Box>

            <Box>
              {new Date(post.createdAt).toDateString()}

              {updateMode ? (
                <>
                  <Tiny
                    setDesc={(desc) => setFormData({ ...formData, desc })}
                    desc={formData.desc}
                  />

                  <div className="button-container">
                    <div className="draft-container">
                      <label>Draft</label>
                      <input
                        type="checkbox"
                        checked={formData.draft}
                        onChange={(e) =>
                          setFormData({ ...formData, draft: e.target.checked })
                        }
                      />
                    </div>

                    <div className="cat-chooser">
                      <label>Categories</label>
                      {allCategories.map((category) => (
                        <div key={category._id}>
                          <input
                            type="checkbox"
                            id={category._id}
                            value={category._id}
                            checked={formData.categories.has(category._id)}
                            onChange={handleSelectCategory}
                          />
                          <label htmlFor={category._id}>{category.name}</label>
                        </div>
                      ))}
                    </div>

                    <button className="singlePostButton" onClick={handleUpdate}>
                      Update
                    </button>
                  </div>
                </>
              ) : (
                <div
                  className="content"
                  dangerouslySetInnerHTML={{ __html: formData.desc }}
                />
              )}
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default SinglePost;

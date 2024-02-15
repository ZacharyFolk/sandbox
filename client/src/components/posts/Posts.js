import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import fetchCategories from '../../utils/Category';
import Post from '../post/Post';
import {
  Box,
  Container,
  Divider,
  Grid,
  List,
  ListItem,
  Paper,
  Typography,
} from '@mui/material';
import { CategoriesAccordion } from './CategoriesAccordion';

export default function Posts({ posts }) {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const getCats = async () => {
      let cats = await fetchCategories();
      setCategories(cats);
    };
    getCats();
  }, []);
  return (
    <Container sx={{ width: '90%' }}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={8} order={{ xs: 2, md: 1 }}>
          <Paper style={{ padding: '30px' }}>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <Typography variant="h4" gutterBottom>
                Random musings
              </Typography>

              <Box className="new-scroll">
                {posts.map((p, i) => (
                  <Post key={i} post={p} />
                ))}
              </Box>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4} order={{ xs: 1, md: 2 }}>
          <CategoriesAccordion categories={categories} />
        </Grid>
      </Grid>
    </Container>
  );
}

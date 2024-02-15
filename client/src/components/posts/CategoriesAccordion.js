import React, { useState } from 'react';
import {
  Container,
  Grid,
  Paper,
  Box,
  Typography,
  Divider,
  List,
  ListItem,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Link } from 'react-router-dom';

export const CategoriesAccordion = ({ categories }) => {
  const theme = useTheme();
  const isMediumScreen = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Paper>
      <Typography variant="h4">Categories</Typography>
      <Divider />
      {isMediumScreen ? (
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h5">Expand Categories</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <List>
              {categories.map((category) => (
                <ListItem key={category._id}>
                  <Link to={`/archives/${category._id}`}>{category.name}</Link>
                </ListItem>
              ))}
            </List>
          </AccordionDetails>
        </Accordion>
      ) : (
        <List>
          {categories.map((category) => (
            <ListItem key={category._id}>
              <Link to={`/archives/${category._id}`}>{category.name}</Link>
            </ListItem>
          ))}
        </List>
      )}
    </Paper>
  );
};

// App.js

import React, { useState } from 'react';
import {
  Container,
  Grid,
  Card,
  CardActionArea,
  CardContent,
  Modal,
  Typography,
  Box,
} from '@mui/material';

const projects = [
  {
    id: 1,
    title: 'First Day',
    thumbnail: 'https://via.placeholder.com/150',
    images: [
      'https://via.placeholder.com/400',
      'https://via.placeholder.com/400',
    ],
    link: '/cagematch',
    short_description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla ac velit ut sem tincidunt vestibulum vel a libero.',
  },
  {
    id: 2,
    title: 'Cagematch',
    thumbnail: 'https://via.placeholder.com/150',
    images: [
      'https://via.placeholder.com/400',
      'https://via.placeholder.com/400',
    ],
    link: '/cagematch',
    short_description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla ac velit ut sem tincidunt vestibulum vel a libero.',
  },
  {
    id: 3,
    title: 'Wutukno',
    thumbnail: 'https://via.placeholder.com/150',
    images: [
      'https://via.placeholder.com/400',
      'https://via.placeholder.com/400',
    ],
    link: '/cagematch',
    short_description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla ac velit ut sem tincidunt vestibulum vel a libero.',
  },
  {
    id: 4,
    title: 'Simple Folk',
    thumbnail: 'https://via.placeholder.com/150',
    images: [
      'https://via.placeholder.com/400',
      'https://via.placeholder.com/400',
    ],
    link: '/cagematch',
    short_description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla ac velit ut sem tincidunt vestibulum vel a libero.',
  },
  {
    id: 5,
    title: 'Guru API',
    thumbnail: 'https://via.placeholder.com/150',
    images: [
      'https://via.placeholder.com/400',
      'https://via.placeholder.com/400',
    ],
    link: '/cagematch',
    short_description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla ac velit ut sem tincidunt vestibulum vel a libero.',
  },
  {
    id: 6,
    title: 'Folk Photography',
    thumbnail: 'https://via.placeholder.com/150',
    images: [
      'https://via.placeholder.com/400',
      'https://via.placeholder.com/400',
    ],
    link: '/cagematch',
    short_description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla ac velit ut sem tincidunt vestibulum vel a libero.',
  },
  {
    id: 7,
    title: 'Artological',
    thumbnail: 'https://via.placeholder.com/150',
    images: [
      'https://via.placeholder.com/400',
      'https://via.placeholder.com/400',
    ],
    link: '/cagematch',
    short_description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla ac velit ut sem tincidunt vestibulum vel a libero.',
  },
];

const Portfolio = () => {
  const [selectedProject, setSelectedProject] = useState(null);

  const openModal = (project) => {
    setSelectedProject(project);
  };

  const closeModal = () => {
    setSelectedProject(null);
  };

  return (
    <Box>
      {/* <Typography variant="h6">Projects</Typography> */}
      <Grid container spacing={3}>
        {projects.map((project) => (
          <Grid item key={project.id} xs={12} sm={6} md={4} lg={3}>
            <Card>
              <CardActionArea onClick={() => openModal(project)}>
                <img
                  src={project.thumbnail}
                  alt={project.title}
                  style={{ width: '100%' }}
                />
                <CardContent>
                  <Typography variant="h6" component="div">
                    {project.title}
                  </Typography>
                  <p>{project.short_description}</p>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Modal open={!!selectedProject} onClose={closeModal}>
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        >
          <Typography variant="h4" component="div" gutterBottom>
            {selectedProject && selectedProject.title}
          </Typography>
          <img
            src={selectedProject && selectedProject.images[0]}
            alt={selectedProject && selectedProject.title}
            style={{ width: '100%' }}
          />
          <Typography variant="body1" component="div" style={{ marginTop: 20 }}>
            {selectedProject && selectedProject.short_description}
          </Typography>
        </div>
      </Modal>
    </Box>
  );
};

export default Portfolio;

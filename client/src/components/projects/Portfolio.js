// App.js

import React, { useState } from 'react';
import {
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
    title: 'My Disco',
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
      'https://via.placeholder.com/300',
      'https://via.placeholder.com/400',
    ],
    link: '/cagematch',
    short_description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla ac velit ut sem tincidunt vestibulum vel a libero.',
  },
  // {
  //   id: 3,
  //   title: 'Wutukno',
  //   thumbnail: 'https://via.placeholder.com/150',
  //   images: [
  //     'https://via.placeholder.com/400',
  //     'https://via.placeholder.com/400',
  //   ],
  //   link: '/cagematch',
  //   short_description:
  //     'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla ac velit ut sem tincidunt vestibulum vel a libero.',
  // },
  {
    id: 4,
    title: 'Simple Folk',
    thumbnail: 'https://via.placeholder.com/150',
    images: [
      'https://via.placeholder.com/300',
      'https://via.placeholder.com/400',
    ],
    link: '/cagematch',
    short_description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla ac velit ut sem tincidunt vestibulum vel a libero.',
  },
  {
    id: 5,
    title: 'Wise API',
    thumbnail: 'https://via.placeholder.com/150',
    images: [
      'https://via.placeholder.com/400',
      'https://via.placeholder.com/400',
    ],
    link: 'https://wise-api.folk.codes/api-docs/',
    short_description:
      'A  simple little api to retrieve one-liners from some of my favorite thinkers.  It came out of the desire to build an api from scratch (read more about it here) and as a resource for this mindfulness app I started building long ago and may someday actually finish.',
  },
  // {
  //   id: 6,
  //   title: 'Folk Photography',
  //   thumbnail: 'https://via.placeholder.com/150',
  //   images: [
  //     'https://via.placeholder.com/400',
  //     'https://via.placeholder.com/400',
  //   ],
  //   link: '/cagematch',
  //   short_description:
  //     'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla ac velit ut sem tincidunt vestibulum vel a libero.',
  // },
  // {
  //   id: 7,
  //   title: 'Artological',
  //   thumbnail: 'https://via.placeholder.com/150',
  //   images: [
  //     'https://via.placeholder.com/400',
  //     'https://via.placeholder.com/400',
  //   ],
  //   link: '/cagematch',
  //   short_description:
  //     'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla ac velit ut sem tincidunt vestibulum vel a libero.',
  // },
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
          <div className="project-img-container">
            {selectedProject &&
              selectedProject.images &&
              selectedProject.images.map((image) => (
                <img src={image} alt={selectedProject.title} />
              ))}
          </div>
          <Typography variant="body1" component="div">
            {selectedProject && selectedProject.short_description}
          </Typography>
          {selectedProject && (
            <a href={selectedProject.link} target="_blank" rel="noreferrer">
              View the project
            </a>
          )}
        </div>
      </Modal>
    </Box>
  );
};

export default Portfolio;

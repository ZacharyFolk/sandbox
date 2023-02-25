const router = require('express').Router();
const Post = require('../models/Post');
const verify = require('../utils');

// Refresh token
let refreshTokens = [];

// CREATE NEW POST
router.post('/', verify, async (req, res) => {
  const newPost = new Post(req.body);
  const refreshToken = req.body.token;

  refreshTokens = refreshTokens.filter((token) => token !== refreshToken);
  try {
    const savedPost = await newPost.save();
    res.status(200).json(savedPost);
  } catch (error) {
    res.status(500).json(error);
  }
});

// UPDATE POST

router.put('/:id', verify, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post) {
      if (post.username === req.body.username) {
        try {
          const updatedPost = await Post.findByIdAndUpdate(
            req.params.id,
            {
              $set: req.body,
            },
            { new: true }
          );
          res.status(200).json(updatedPost);
        } catch (error) {
          res.status(500).json(error);
        }
      } else {
        res.status(401).json('You can only update your own posts');
      }
    } else {
      res.status(500).json('Can not find this post');
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

// DELETE POST

router.delete('/:id', verify, async (req, res) => {
  const refreshToken = req.body.token;

  refreshTokens = refreshTokens.filter((token) => token !== refreshToken);
  try {
    const post = await Post.findById(req.params.id);
    if (post.username === req.body.username) {
      try {
        await post.delete();
        res.status(200).json('Post is deleted');
      } catch (error) {
        res.status(500).json(error);
      }
    } else {
      res.status(401).json('You can only delete your own posts');
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

// GET POST
router.get('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json(error);
  }
});

// GET ALL POSTS

router.get('/', async (req, res) => {
  const username = req.query.user; // ?user=
  const catName = req.query.cat;
  try {
    let posts;
    if (username) {
      posts = await Post.find({ username });
    } else if (catName) {
      posts = await Post.find({
        categories: {
          $in: [catName],
        },
      });
    } else {
      posts = await Post.find();
    }
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;

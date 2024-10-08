const router = require('express').Router();
const Category = require('../models/Category');
const Post = require('../models/Post');
const verify = require('../utils');

// CREATE CATEGORY
router.post('/', verify, async (req, res) => {
  const newCat = new Category(req.body);
  try {
    const savedCat = await newCat.save();
    res.status(200).json(savedCat);
  } catch (error) {
    res.status(500).json(error);
  }
});

// GET ALL CATEGORIES
router.get('/', async (req, res) => {
  try {
    const cats = await Category.find();
    res.status(200).json(cats);
  } catch (error) {
    res.status(500).json(error);
  }
});

// GET ALL POSTS FROM CATEGORY ID
router.get('/:id', async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    const posts = await Post.find({ categories: req.params.id });
    res.status(200).json({ category, posts });
  } catch (error) {
    res.status(500).json(error);
  }
});
module.exports = router;

const express = require('express')
const router = express.Router()
const Post = require('../models/Post')

// get all posts
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find()
    res.json(posts)
  } catch (err) {
    res.json({ message: err })
  }
})

// get specific post
router.get('/:postId', async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId)
    res.json(post)
  } catch (err) {
    res.json({ message: err })
  }
})

// delete specific post
router.delete('/:postId', async (req, res) => {
  try {
    const removedPost = await Post.remove({ _id: req.params.postId })
    res.json(removedPost)
  } catch (err) {
    res.json({ message: err })
  }
})

// submit post
router.post('/', async (req, res) => {
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    createdBy: req.body.createdBy,
    images: req.body.images,
  })
  try {
    const savedPost = await post.save()
    res.json(savedPost)
  } catch (err) {
    res.json({ message: err })
  }
})

module.exports = router

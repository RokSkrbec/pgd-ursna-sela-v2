const express = require('express')
const router = express.Router()
const Notification = require('../models/Notification')

// get all notifications
router.get('/', async (req, res) => {
  try {
    const notifications = await Notification.find()
    res.json(notifications)
  } catch (err) {
    res.json({ message: err })
  }
})

// submit notification
router.post('/', async (req, res) => {
  const notification = new Notification({
    title: req.body.title,
    author: req.body.author,
    content: req.body.content,
  })
  try {
    const savedNotification = await notification.save()
    res.json(savedNotification)
  } catch (err) {
    res.json({ message: err })
  }
})
module.exports = router

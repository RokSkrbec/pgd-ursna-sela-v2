const mongoose = require('mongoose')

const NotificationSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  content: {
    type: String,
    required: true,
  },
})

module.exports = mongoose.model('Notifications', NotificationSchema)

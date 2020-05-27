const mongoose = require('mongoose')
const slugify = require('slugify')

// subschema of postSchema
const imagesSchema = mongoose.Schema({
  path: {
    type: String,
  },
})

const PostSchema = mongoose.Schema({
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
  createdBy: {
    type: String,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
  },
  images: [imagesSchema],
})

PostSchema.pre('validate', function (next) {
  if (this.title) {
    this.slug = slugify(this.title, { lower: true, strict: true })
  }
  next()
})

module.exports = mongoose.model('Posts', PostSchema)

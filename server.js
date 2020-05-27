const express = require('express')
const app = express()

const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const cors = require('cors')
require('dotenv/config')
const ejs = require('ejs')
const methodOverride = require('method-override')
const multer = require('multer')
const path = require('path')
const fs = require('fs')

//models
const Post = require('./models/Post')
const Notification = require('./models/Notification')

// middlewares
app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: false }))
app.use(methodOverride('_method'))
app.use('/public', express.static('public'))

// import routes
const postsRoute = require('./routes/posts')
const notificationsRoute = require('./routes/notifications')
app.use('/posts', postsRoute)
app.use('/notifications', notificationsRoute)

//------------------- Routes ----------------------
// Main page
app.get('/', async (req, res) => {
  const posts = await Post.find().sort({ date: 'desc' })
  const notification = await Notification.findOne().sort({ date: -1 })
  res.render('index', { posts: posts, notification: notification })
})

// Admin control panel
app.get('/admin', async (req, res) => {
  const posts = await Post.find().sort({ date: 'desc' })
  const notifications = await Notification.find().sort({ date: 'desc' })
  res.render('admin/admin', { posts: posts, notifications: notifications })
})

//-------------- Posts routes (Admin) -------------------
// Add new post (opens add new post page)
app.get('/admin/new-post', (req, res) => {
  res.render('admin/new-post', { post: new Post() })
})

// Add new post (after clicking save post)
app.post('/admin/new-post', async (req, res) => {
  let post = new Post({
    title: req.body.title,
    content: req.body.content,
  })
  try {
    let savedPost = await post.save()
    console.log('Post added')
    res.redirect('/admin')
  } catch (err) {
    console.log(err)
    res.redirect('/')
  }
})

// Edit post (opens edit page)
app.get('/admin/edit-post/:slug', async (req, res) => {
  const post = await Post.findOne({ slug: req.params.slug })
  if (post == null) res.redirect('/admin')
  res.render('admin/edit-post', { post: post })
})

// Edit post (after clicking save post)
app.put('/admin/edit-post/:slug', async (req, res) => {
  let post = await Post.findOne({ slug: req.params.slug })
  console.log(req.body)

  post.title = req.body.title
  post.content = req.body.content

  try {
    post = await post.save()
    console.log('Post saved')
    res.redirect('/admin')
  } catch (err) {
    console.log(err)
    res.redirect('/')
  }
})

// Delete post
app.delete('/admin/delete-post/:slug', async (req, res) => {
  console.log(req.params.slug)
  await Post.deleteOne({ slug: req.params.slug }, (err, res) => {
    if (err) {
      console.log('Napaka pri brisanju.')
    } else {
      console.log('Brisanje uspešno.')
    }
  })
  res.redirect('/admin')
})

//----------------- Notifications Routes (admin) -----------------------
// Add new notificaiton (opens add new notification page)
app.get('/admin/new-notification', (req, res) => {
  res.render('admin/new-notification', { notification: new Notification() })
})

// Add new notificaiton (after clicking save notificaiton)
app.post('/admin/new-notification', async (req, res) => {
  let notification = new Notification({
    title: req.body.title,
    content: req.body.content,
  })
  try {
    let savedNotification = await notification.save()
    console.log('Notification added')
    res.redirect('/admin')
  } catch (err) {
    console.log(err)
    res.redirect('/')
  }
})

// Edit notification (opens notification page)
app.get('/admin/edit-notification/:id', async (req, res) => {
  const notification = await Notification.findOne({ _id: req.params.id })
  if (notification == null) res.redirect('/admin')
  res.render('admin/edit-notification', { notification: notification })
})

// Edit notification (after clicking save notification)
app.put('/admin/edit-notification/:id', async (req, res) => {
  let notification = await Notification.findOne({ _id: req.params.id })
  console.log(req.body)

  notification.title = req.body.title
  notification.content = req.body.content

  try {
    notification = await notification.save()
    console.log('Notification saved')
    res.redirect('/admin')
  } catch (err) {
    console.log(err)
    res.redirect('/')
  }
})

// Delete notification
app.delete('/admin/delete-notification/:id', async (req, res) => {
  console.log(req.params.id)
  await Notification.deleteOne({ _id: req.params.id }, (err, res) => {
    if (err) {
      console.log('Napaka pri brisanju.')
    } else {
      console.log('Brisanje uspešno.')
    }
  })
  res.redirect('/admin')
})

// Connect to DB
mongoose
  .connect(process.env.DB_CONNECTION, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(
    () => {
      console.log('connected to db')
    },
    (err) => {
      console.log({ message: err })
    }
  )

//-----------------------------------------multer----------------------------------

// set storage engine
const storage = multer.diskStorage({
  destination: './public/uploads/',
  filename: function (req, file, cb) {
    cb(null, file.originalname.split('.')[0] + '_' + Date.now() + path.extname(file.originalname))
  },
})

// init upload
const upload = multer({
  storage: storage,
  limits: { fileSize: 3000000 },
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb)
  },
}).single('myImage')

// check file type
function checkFileType(file, cb) {
  // allowed extensions
  const filetypes = /jpeg|jpg|png|gif/
  //check extensions
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase())
  //check mimetype
  const mimetype = filetypes.test(file.mimetype)
  if (mimetype && extname) {
    return cb(null, true)
  } else {
    cb('Error: Images only!')
  }
}

// upload image
app.post('/admin/images/:slug', async (req, res) => {
  let postSlug = req.params.slug
  let post = await Post.findOne({ slug: req.params.slug })
  upload(req, res, async (err) => {
    if (err) {
      res.render('index', {
        msg: err,
      })
    } else {
      if (req.file == undefined) {
        res.render('/images', {
          msg: 'Napaka: Izberi sliko!',
        })
      } else {
        post.images.push({ path: req.file.filename })
        post = await post.save()
        post.content = req.file.filename
        res.redirect(`/admin/edit-post/${postSlug}`)
      }
    }
  })
})

// delete image
app.delete('/admin/delete-image/:postId/:imageId', async (req, res) => {
  let post = await Post.findOne({ _id: req.params.postId })
  let image = await post.images.id(req.params.imageId)
  console.log(image.path)
  post.images.pull({ _id: req.params.imageId })
  post = await post.save()
  try {
    fs.unlinkSync(`./public/uploads/${image.path}`)
    //file removed
  } catch (err) {
    console.error(err)
  }
  res.redirect(`/admin/edit-post/${post.slug}`)
})

// Start server
app.listen(process.env.PORT || 3000, () => {
  console.log('Server started.')
})

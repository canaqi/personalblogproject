require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const session = require('express-session');
const flash = require('express-flash');
const authRoutes = require('./routes/auth');
const blogRoutes = require('./routes/blog');
const path = require('path');
const multer = require('multer');
const BlogPost = require('./models/blogpost');
const methodOverride = require('method-override');

// Passport Config
require(path.join(__dirname, 'config', 'passport'))(passport);

const app = express();
const PORT = process.env.PORT || 5000;

// Set up the storage for uploaded files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  },
});

// Create the multer middleware
const upload = multer({ storage });

// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

// Use the method-override middleware
app.use(methodOverride('_method'));

// Define routes
app.get('/', (req, res) => {
  if (req.isAuthenticated()) {
    res.redirect('/home');
  } else {
    res.render('index', { success_msg: req.flash('success_msg') });
  }
});

app.get('/home', ensureAuthenticated, (req, res) => {
  BlogPost.findAll()
    .then(blogPosts => {
      res.render('home', { username: req.user.username, blogPosts, success_msg: req.flash('success_msg') });
    })
    .catch(error => {
      console.error(error);
      res.sendStatus(500);
    });
});

app.get('/blog', ensureAuthenticated, (req, res) => {
  res.render('blog');
});

app.post('/blogpost', ensureAuthenticated, upload.single('image'), (req, res) => {
  const { title, content } = req.body;
  const image = req.file ? req.file.filename : null;

  BlogPost.create({
    title,
    content,
    image,
  })
    .then(() => {
      req.flash('success_msg', 'Blog created successfully');
      res.redirect('/home');
    })
    .catch(error => {
      console.error(error);
      res.sendStatus(500);
    });
});

app.delete('/blogpost/:id', ensureAuthenticated, (req, res) => {
  const blogId = req.params.id;

  BlogPost.destroy({ where: { id: blogId } })
    .then(() => {
      req.flash('success_msg', 'Blog deleted successfully');
      res.redirect('/home');
    })
    .catch(error => {
      console.error(error);
      res.sendStatus(500);
    });
});

app.get('/auth/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      console.error('Error logging out:', err);
    }
    req.flash('success_msg', 'You are logged out');
    res.redirect('/'); // Redirect to the root URL
  });
});


app.use('/auth', authRoutes);
app.use('/blogpost', blogRoutes);

app.use(express.static('uploads'));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Middleware to ensure user is authenticated
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/auth/login');
}

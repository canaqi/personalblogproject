require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const session = require('express-session');
const flash = require('express-flash');
const authRoutes = require('./routes/auth');
const path = require('path');
const crypto = require('crypto');

// Passport Config
require(path.join(__dirname, 'config', 'passport'))(passport);

const app = express();
const PORT = process.env.PORT || 3000;

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

// Define a simple route for the root URL ("/")
app.get('/', (req, res) => {
    if(req.isAuthenticated()){
        res.render('index', {username: req.user.username});
    }else{
        res.render('index');
    }
});

app.use('/auth', authRoutes); // use authentication routes

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


const generateSessionSecret = () => {
  const secret = crypto.randomBytes(32).toString('hex');
  return secret;
};

const sessionSecret = generateSessionSecret();
console.log(sessionSecret);

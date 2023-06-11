const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const User = require('../models/User');
const path = require('path');

router.get('/login', (req, res) => {
    res.render('login');
});

router.get('/register', (req, res) => {
    res.render('register');
});

router.post('/register', (req, res) => {
    const { name, username, email, password, password2 } = req.body;

    let errors = [];

    if (!name || !username || !email || !password || !password2) {
        errors.push({ msg: 'Please enter all fields' });
    }

    if (password !== password2) {
        errors.push({ msg: 'Passwords do not match' });
    }

    if (password.length < 6) {
        errors.push({ msg: 'Password must be at least 6 characters' });
    }

    if (errors.length > 0) {
        res.render('register', {
            errors,
            name,
            username,
            email,
            password,
            password2
        });
    } else {
        User.findOne({ where: { email: email } }).then(user => {
            if (user) {
                errors.push({ msg: 'Email already exists' });
                res.render('register', {
                    errors,
                    name,
                    username,
                    email,
                    password,
                    password2
                });
            } else {
                const newUser = new User({
                    name,
                    username,
                    email,
                    password
                });

                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if (err) throw err;
                        newUser.password = hash;
                        newUser
                            .save()
                            .then(user => {
                                req.flash('success_msg', 'You are now registered and can log in');
                                res.redirect('/auth/login');
                            })
                            .catch(err => console.error(err));
                    });
                });
            }
        });
    }
});

router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/auth/login',
        failureFlash: true
    })(req, res, next);
});

router.get('/logout', (req, res) => {
  req.session.destroy((err) => {
      if (err) {
          return console.error(err);
      }
      res.redirect('/');
  });
});

module.exports = router;

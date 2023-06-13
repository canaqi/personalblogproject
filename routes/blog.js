const express = require('express');
const router = express.Router();
const BlogPost = require('../models/blogpost');

// Delete a blog post
router.delete('/:id', ensureAuthenticated, (req, res) => {
  const blogId = req.params.id;
  
  BlogPost.destroy({ where: { id: blogId } })
    .then(() => {
      req.flash('success_msg', 'Blog post deleted successfully');
      res.redirect('/home');
    })
    .catch((error) => {
      console.error(error);
      res.sendStatus(500);
    });
});

// Edit a blog post
router.get('/:id/edit', ensureAuthenticated, (req, res) => {
  const blogId = req.params.id;
  
  BlogPost.findByPk(blogId)
    .then((blogPost) => {
      res.render('edit', { blogPost });
    })
    .catch((error) => {
      console.error(error);
      res.sendStatus(500);
    });
});

router.put('/:id', ensureAuthenticated, (req, res) => {
  const blogId = req.params.id;
  const { title, content } = req.body;
  
  BlogPost.update({ title, content }, { where: { id: blogId } })
    .then(() => {
      req.flash('success_msg', 'Blog post updated successfully');
      res.redirect('/home');
    })
    .catch((error) => {
      console.error(error);
      res.sendStatus(500);
    });
});

// Middleware to ensure user is authenticated
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/auth/login');
}

module.exports = router;

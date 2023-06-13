const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Assuming the database configuration file is in the 'config' directory and named 'database.js'

// Define the BlogPost model
const BlogPost = sequelize.define('BlogPost', {
  // Define your model attributes here
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  image: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

module.exports = BlogPost;


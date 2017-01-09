/*jshint esversion: 6 */

// ask about dependency organization
const express = require('express');
const router = express.Router();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const {BlogPosts} = require('./models');

const jsonParser = bodyParser.json();
const app = express();

app.use(morgan('common'));

BlogPosts.create('title1', 'text1', 'blake sager', null);
BlogPosts.create('title2', 'text2', 'blake sager', null);
BlogPosts.create('title3', 'text3', 'blake sager', null);
BlogPosts.create('title4', 'text4', 'blake sager', null);

app.get('/blog-posts', (req, res) => {
	res.json(BlogPosts.get()); 
});

app.post('/blog-posts');

app.delete('/blog-posts/:id');

app.put('/blog-posts/:id');
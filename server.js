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

BlogPosts.create('JavaScript and You', 'text1', 'blake sager', null);
BlogPosts.create('Assembly for Dummies', 'text2', 'blake sager', null);
BlogPosts.create('Who moved my trackpad?', 'text3', 'blake sager', null);
BlogPosts.create('Logs. So many logs.', 'text4', 'blake sager', null);

app.get('/blog-posts', (req, res) => {
	res.json(BlogPosts.get()); 
});

// what is jsonParser doing and how?
app.post('/blog-posts', jsonParser, (req, res) => {
	const requiredFields = ['title', 'content', 'author', 'publishDate'];
	// ask about let and for loops w/ aysnc code
	for (let i=0; i < requiredFields.length; i++) {
		if(!(requiredFields[i] in req.body)) {
			const msg = 'Missing ${field} in request body';
			console.log(msg);
			return res.satus(400).send(msg);
		}
	}
	const blogPost = BlogPosts.create(req.body.title, req.body.content, req.body.author, req.body.publishDate);
	res.status(201).json(blogPost);
});

// app.delete('/blog-posts/:id');

// app.put('/blog-posts/:id');

app.listen(process.env.PORT || 8080, () => {
  console.log(`Your app is listening on port ${process.env.PORT || 8080}`);
});
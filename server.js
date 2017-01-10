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

app.get('/blog-posts', (req, res) => {
	res.json(BlogPosts.get()); 
});

// what is jsonParser doing and how?
app.post('/blog-posts', jsonParser, (req, res) => {
	const requiredFields = ['title', 'content', 'author', 'publishDate'];
	// ask about let and for loops w/ aysnc code
	for (let i=0; i < requiredFields.length; i++) {
		if(!(requiredFields[i] in req.body)) {
			const msg = `Missing ${field} in request body`;
			console.log(msg);
			return res.satus(400).send(msg);
		}
	}
	const blogPost = BlogPosts.create(req.body.title, req.body.content, req.body.author, req.body.publishDate);
	res.status(201).json(blogPost);
});

app.delete('/blog-posts/:id', (req, res) => {
	BlogPosts.delete(req.params.id);
	console.log(`Deleting blogpost ${req.params.id}`);
	res.status(204).end();
});

app.put('/blog-posts/:id', jsonParser, (req, res) => {
	const requiredFields = ['title', 'content', 'author', 'publishDate'];
	// ask about let and for loops w/ aysnc code
	for (let i=0; i < requiredFields.length; i++) {
		if(!(requiredFields[i] in req.body)) {
			const msg = `Missing ${field} in request body`;
			console.log(msg);
			return res.satus(400).send(msg);
		}
	}
	if (req.params.id !== req.body.id) {
		const msg = `Request path id (${req.params.id}) and request body id (${req.body.id}) must match`;
		console.error(msg);
		return res.status(400).send(msg);
	}
	console.log(`Updating shopping list item ${req.params.id}`);
	const updatedItem = BlogPosts.update({
		id: req.params.id,
		title: req.body.title,
		content: req.body.content,
		author: req.body.author,
		publishDate: (req.body.publishDate || Date.now())
	});
	res.status(204).json(updatedItem);
});

// app.put('/blog-posts/:id');

app.listen(process.env.PORT || 8080, () => {
  console.log(`Your app is listening on port ${process.env.PORT || 8080}`);
});


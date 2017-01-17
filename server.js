/*jshint esversion: 6 */

const bodyParser = require('body-parser');
const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');

const {DATABASE_URL, PORT} = require('./config');
const {BlogPost} = require('./models');

const app = express();

app.use(morgan('common'));
app.use(bodyParser.json());


mongoose.Promise = global.Promise;

// GET requests return all blog posts
app.get('/blog-posts', (req, res) => {
  BlogPost
    .find()
    .exec()
    .then(posts => {
      res.json(posts.map(post => post.apiRepr()));
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({error: 'Internal Server Error'});
    });
});
 
// return blog post by id
app.get('/blog-posts/:id', (req, res) =>{
  BlogPost
  .findById(req.params.id)
  .exec()
  .then(post => res.json(post.apiRepr()))
  .catch(err => {
    console.error(err);
      res.status(500).json({error: 'Internal Server Error'});
  });
});

// POST requests create new blog posts
app.post('/blog-posts', (req, res) => {
  const requiredFields = ['title', 'content', 'author'];
  requiredFields.forEach(field => {
    if (! (field in req.body)) {
      return res.status(400).json({error: `Must specify value for ${field}`});
    }
  });
  BlogPost
  .create({
    name: req.body.title,
    content: req.body.content,
    author: req.body.author})
  .then(
    blogPost => res.status(201).json(blogPost.apiRepr()))
  .catch(err => {
    console.error(err);
    res.status(500).json({error: 'Internal Server Error'});
  });
});


// update post by ID
app.put('/blog-posts/:id', (req, res) => {
  if (!(req.params.id && req.body.id && req.params.id === req.body.id)) {
    const message = (
      `Request path id (${req.params.id}) and request body id ` +
      `(${req.body.id}) must match`);
    console.error(message);
    res.status(400).json({message: message});
  }
  const toUpdate = {};
  const updateableFields = ['title', 'content', 'author'];
  updateableFields.forEach(field => {
    if (field in req.body) {
      toUpdate[field] = req.body[field];
    }
  });
  BlogPost
  .findbyIdAndUpdate(req.params.id, {$set: toUpdate})
  .exec()
  .then(updatedPost => res.status(204).json(updatedPost.apiRepr))
  .catch(err => res.status(500).json({message: "Internal Server Error"}));
});

// delete post
app.delete('/blog-posts/:id', (req, res) => {
  BlogPost
  .findByIdAndRemove(req.params.id)
  .exec()
  .then(() => {
    res.status(204).json({message: 'success'});
  })
  .catch(err => res.status(500).json({error: 'Internal server error'}));
});

// // catch all 404
app.use('*', function(req, res) {
  res.status(404).json({message: 'Not Found'});
});

let server;

function runServer(databaseUrl=DATABASE_URL, port=PORT) {
  return new Promise((resolve, reject) => {
    mongoose.connect(databaseUrl, err => {
      if (err) {
        return reject(err);
      }
      server = app.listen(port, () => {
        console.log(`Your app is listening on port ${port}`);
        console.log(`The db URL is ${databaseUrl}`);
        resolve();
      })
      .on('error', err => {
        mongoose.disconnect();
        reject(err);
      });
    });
  });
}

function closeServer() {
  return mongoose.disconnect().then(() => {
     return new Promise((resolve, reject) => {
       console.log('Closing server');
       server.close(err => {
           if (err) {
               return reject(err);
           }
           resolve();
       });
     });
  });
}

// if server.js is called directly (aka, with `node server.js`), this block
// runs. but we also export the runServer command so other code (for instance, test code) can start the server as needed.
if (require.main === module) {
  runServer().catch(err => console.error(err));
}

module.exports = {app, runServer, closeServer};
/* jshint esversion: 6 */
/* jshint expr: true */

const chai = require('chai');
const chaiHttp = require('chai-http');

const {app, runServer, closeServer} = require('../server');

const should = chai.should();

chai.use(chaiHttp);

describe('Blog Post API', function() {
	before(function() {
	  return runServer();
	});
	after(function() {
	  return closeServer();
	});

	// get
	it('should list blog posts on GET', function() {
		return chai.request(app)
		.get('/blog-posts')
		.then(function(res) {
			res.should.be.json;
			res.body.should.be.a('array');
			res.body.length.should.be.at.least(1);
			const expectedKeys = ['title', 'content', 'author', 'publishDate'];
			res.body.forEach(function(item) {
			  item.should.be.a('object');
			  item.should.include.keys(expectedKeys);
			});
		});
	});

	// post
	it('should add a blog post on POST', function() {
	  const newItem = {title: 'a', content: 'abc', author: 'Blake Sager', publishDate: false};
	  return chai.request(app)
	    .post('/blog-posts')
	    .send(newItem)
	    .then(function(res) {
	      res.should.have.status(201);
	      res.should.be.json;
	      res.body.should.be.a('object');
	      res.body.should.include.keys('id', 'title', 'content', 'author', 'publishDate');
	      res.body.id.should.not.be.null;
	    });
	});

	// put
	it('should update blog post on PUT', function() {
	  const updateData = {
	  	title: "Why God Why: an introduction to PHP",
	  	content: "Chapter One: Not the best start",
	  	author: "Chris Shans",
	  	publishDate: null
	  };
	  return chai.request(app)
			.get('/blog-posts')
	    .then(function(res) {
	      updateData.id = res.body[0].id;
	      return chai.request(app)
	        .put(`/blog-posts/${updateData.id}`)
	        .send(updateData);
	    })
	    .then(function(res) {
	    	console.log(res);
	      res.should.have.status(204);
	      res.body.should.be.a('object');
	    });
	});

	// delete 
	it('should delete posts on DELETE', function() {
	  return chai.request(app)
	    // first have to get so we have an `id` of item
	    // to delete
	    .get('/blog-posts')
	    .then(function(res) {
	      return chai.request(app)
	        .delete(`/blog-posts/${res.body[0].id}`);
	    })
	    .then(function(res) {
	      res.should.have.status(204);
	    });
	});
});
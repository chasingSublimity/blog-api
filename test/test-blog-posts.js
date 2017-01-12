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
	it('should add an item on POST', function() {
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
	      // response should be deep equal to `newItem` from above if we assign
	      // `id` to it from `res.body.id`
	    });
	});

	// put

	// delete 
});
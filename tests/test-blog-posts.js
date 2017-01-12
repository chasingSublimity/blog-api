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
		.get('shopping-list')
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

	// put

	// delete 
});
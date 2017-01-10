/*jshint esversion: 6 */

// ask about dependency organization
const express = require('express');
const morgan = require('morgan');
const app = express();

const blogpostRouter = require('./blogpostRouter');


app.use(morgan('common'));

app.use('/blog-posts', blogpostRouter);

app.listen(process.env.PORT || 8080, () => {
  console.log(`Your app is listening on port ${process.env.PORT || 8080}`);
});


const createError = require('http-errors');
const express = require('express');
const bodyParser = require('body-parser')
const cors = require('cors');
const routingEngine = require('./routes/routingEngine');

const app = express();

app.use(cors());
app.use('/', bodyParser.json(), routingEngine);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

app.listen(3001);

module.exports = app;

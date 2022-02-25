const createError = require('http-errors');
const express = require('express');
const bodyParser = require('body-parser')
const cors = require('cors');
const fabricRoutes = require('./routes/fabricRoutes');
const offchainRoutes = require('./routes/offchainRoutes');

const app = express();

app.use(cors());
app.use('/', bodyParser.json(), offchainRoutes);
app.use('/', bodyParser.json(), fabricRoutes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

module.exports = app;

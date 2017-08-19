const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
// used to parse incoming requests - converts them to json no matter what
// can cause errors
const morgan = require('morgan');
// morgan is a logging framework - mostly using it for debugging
const app = express();
const router = require('./router');
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:auth/auth');

app.use(morgan('combined'));
app.use(bodyParser.json({ type: '*/*' }));
router(app);
// jj
const port = process.env.PORT || 3090;
const server = http.createServer(app);
server.listen(port);
console.log('Server listening on:', port);
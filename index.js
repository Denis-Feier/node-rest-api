require('dotenv').config();

const express = require('express');

const routes = require('./app');

const app = express();

const PORT = process.env.PORT || 3000;

console.log('Server Started on Port: %s', PORT);

app.use(routes);

app.listen(PORT);

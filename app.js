const express = require('express');

const app=express();

app.use(express.json());

const {getCategory} = require ('./controllers/controllers.js');

app.get('/api/categories', getCategory);

module.exports = app;
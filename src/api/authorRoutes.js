const express = require('express');
const { dbClient } = require('../config');

const authorRoutes = express.Router();

// routes
// POST /api/author - sukuria nauja autoriu
authorRoutes.post('/author', async (req, res) => {
  res.json('creating an author');
});

// GET /api/author - gauti visus autorius
authorRoutes.get('/author', async (req, res) => {
  res.json('authors index');
});

// GET /api/author/:authorId - gauti konkretu autoriu

module.exports = authorRoutes;

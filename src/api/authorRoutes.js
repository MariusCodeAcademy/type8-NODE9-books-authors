const express = require('express');
const { dbClient } = require('../config');

const authorRoutes = express.Router();

// routes
// POST /api/author - sukuria nauja autoriu

// GET /api/author - gauti visus autorius

// GET /api/author/:authorId - gauti konkretu autoriu

module.exports = authorRoutes;

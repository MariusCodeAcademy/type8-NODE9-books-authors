const express = require('express');
const { ObjectId } = require('mongodb');
const { dbClient } = require('../config');

const authorRoutes = express.Router();

// routes
// POST /api/author - sukuria nauja autoriu
authorRoutes.post('/author', async (req, res) => {
  try {
    // prisijungti
    await dbClient.connect();
    // atlikti veiksma
    console.log('connected');
    // paimti gautus duomenis
    console.log('req.body ===', req.body);
    const newAuthorObj = req.body;
    // kai gaunam _id string versija o reikia irasyti ObjectId tipo irasa,
    // paverciam string _id i ObjectId su ObjectId(stringId)
    newAuthorObj.bookId = ObjectId(newAuthorObj.bookId);
    console.log('newAuthorObj.bookId ===', ObjectId(newAuthorObj.bookId));
    // su jais sukurti nauja knyga
    const collection = dbClient.db('library').collection('authors');
    const insertRezult = await collection.insertOne(newAuthorObj);
    res.status(201).json(insertRezult);
  } catch (error) {
    console.error('error in creating a author', error);
    res.status(500).json('something is wrong');
  } finally {
    // uzdaryti prisijungima
    await dbClient.close();
  }
});

// GET /api/author - gauti visus autorius
authorRoutes.get('/author', async (req, res) => {
  try {
    // prisijungti
    await dbClient.connect();
    // atlikti veiksma
    console.log('connected');
    // gauti visas knygas
    const collection = dbClient.db('library').collection('authors');
    const allAuthorsArr = await collection.find().toArray();
    res.status(200).json(allAuthorsArr);
  } catch (error) {
    console.error('error in getting all authors', error);
    res.status(500).json('something is wrong');
  } finally {
    // uzdaryti prisijungima
    await dbClient.close();
  }
});

// GET /api/author/:authorId    gauti konkretu autoriu

module.exports = authorRoutes;

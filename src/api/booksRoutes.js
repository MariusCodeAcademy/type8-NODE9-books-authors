const express = require('express');
const { dbClient } = require('../config');

const booksRoutes = express.Router();

// routes
// POST /api/book/ - sukursim nauja knyga
booksRoutes.post('/book', async (req, res) => {
  try {
    // prisijungti
    await dbClient.connect();
    // atlikti veiksma
    console.log('connected');
    // paimti gautus duomenis
    console.log('req.body ===', req.body);
    const newBookObj = req.body;
    // su jais sukurti nauja knyga
    const collection = dbClient.db('library').collection('books');
    const insertRezult = await collection.insertOne(newBookObj);
    res.status(201).json(insertRezult);
  } catch (error) {
    console.error('error in creating a book', error);
    res.status(500).json('something is wrong');
  } finally {
    // uzdaryti prisijungima
    await dbClient.close();
  }
});

// GET /api/book/ - grazina visas knygas
booksRoutes.get('/book', async (req, res) => {
  try {
    // prisijungti
    await dbClient.connect();
    // atlikti veiksma
    console.log('connected');
    // gauti visas knygas
    const collection = dbClient.db('library').collection('books');
    const allBooksArr = await collection.find().toArray();
    res.status(200).json(allBooksArr);
  } catch (error) {
    console.error('error in getting all books', error);
    res.status(500).json('something is wrong');
  } finally {
    // uzdaryti prisijungima
    await dbClient.close();
  }
});

// GET /api/book/:bookId - grazina knyga su id lygiu bookId

module.exports = booksRoutes;

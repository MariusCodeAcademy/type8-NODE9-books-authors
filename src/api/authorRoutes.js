const express = require('express');
const { ObjectId } = require('mongodb');
const { dbClient } = require('../config');
const { getArrayDb } = require('../helper');

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
  const authorsArr = await getArrayDb('authors');
  if (authorsArr === false) {
    res.status(500).json('Something went wrong');
    return;
  }
  res.json(authorsArr);
});

// GET /api/author/:authorId    gauti konkretu autoriu

// PATCH /api/author/:authorId - atnaujinti varda
authorRoutes.patch('/author/:authorId', async (req, res) => {
  // updateOne({filterObj/query}, {$set: {name: 'James'}})
  try {
    const { authorId } = req.params;
    const { newName } = req.body;
    // prisijungti
    await dbClient.connect();
    // atlikti veiksma
    console.log('connected');
    // atnaujinti varda
    const collection = dbClient.db('library').collection('authors');
    const updateRezult = await collection.updateOne(
      { _id: ObjectId(authorId) },
      { $set: { name: newName } }
    );
    res.status(200).json(updateRezult);
  } catch (error) {
    console.error('error in updating author name authors', error);
    res.status(500).json('something is wrong');
  } finally {
    // uzdaryti prisijungima
    await dbClient.close();
  }
});
// {newName: 'James bk1'}

// PATCH /api/author/add-book/:authorId - prideda viena knyga i autoriaus kurios id === authorId bookId masyva

module.exports = authorRoutes;

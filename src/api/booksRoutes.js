const express = require('express');
const { ObjectId } = require('mongodb');
const { dbClient } = require('../config');
const { getArrayDb } = require('../helper');

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
    const booksArr = await getArrayDb('books');
    res.json(booksArr);
  } catch (error) {
    res.status(500).json('Something went wrong');
  }
});

booksRoutes.get('/book-agg2', async (req, res) => {
  try {
    const aggPipeline = [
      {
        $lookup: {
          from: 'authors',
          localField: '_id',
          foreignField: 'bookId',
          as: 'bookAuthorArr',
        },
      },
      {
        $sort: {
          rating: -1,
        },
      },
      {
        $replaceRoot: {
          newRoot: {
            $mergeObjects: [
              {
                $arrayElemAt: ['$bookAuthorArr', 0],
              },
              '$$ROOT',
            ],
          },
        },
      },
      {
        $project: {
          bookAuthorArr: 0,
        },
      },
    ];
    // prisijungti
    await dbClient.connect();
    // atlikti veiksma
    console.log('connected');
    // gauti visas knygas
    const collection = dbClient.db('library').collection('books');
    const allBooksArr = await collection.aggregate(aggPipeline).toArray();
    res.status(200).json(allBooksArr);
  } catch (error) {
    console.error('error in getting all books', error);
    res.status(500).json('something is wrong');
  } finally {
    // uzdaryti prisijungima
    await dbClient.close();
  }
});
// GET /api/book-authors - grazina visas knygas
booksRoutes.get('/book-authors', async (req, res) => {
  try {
    // prisijungti
    await dbClient.connect();
    // atlikti veiksma
    console.log('connected');
    // gauti visas knygas
    const collection = dbClient.db('library').collection('books');
    const allBooksArr = await collection
      .aggregate([
        {
          $lookup: {
            from: 'authors',
            localField: '_id',
            foreignField: 'bookId',
            as: 'authorArr',
          },
        },
      ])
      .toArray();
    console.log('allBooksArr ===', allBooksArr);
    const authorsWithBooksArr = allBooksArr.map((bookObj) => {
      if (bookObj.authorArr.length === 0) {
        return bookObj;
      }
      return {
        title: bookObj.title,
        year: bookObj.year,
        rating: bookObj.rating,
        authorName: bookObj.authorArr[0].name,
        authorTown: bookObj.authorArr[0].town,
      };
    });
    console.log('authorsWithBooksArr ===', authorsWithBooksArr);
    res.status(200).json(authorsWithBooksArr);
  } catch (error) {
    console.error('error in getting all books', error);
    res.status(500).json('something is wrong');
  } finally {
    // uzdaryti prisijungima
    await dbClient.close();
  }
});

// GET /api/book/:bookId - grazina knyga su id lygiu bookId
booksRoutes.get('/book/:bookId', async (req, res) => {
  try {
    const { bookId } = req.params;
    await dbClient.connect();
    // gauti knyga kurios id yra === bookId
    const collection = dbClient.db('library').collection('books');
    const foundBook = await collection.findOne(ObjectId(bookId));
    console.log('foundBook ===', foundBook);
    res.status(200).json(foundBook);
  } catch (error) {
    console.error('error in getting single book', error);
    res.status(500).json('something is wrong');
  } finally {
    // uzdaryti prisijungima
    await dbClient.close();
  }
});

// DELETE /api/book/:delBookId - istrinam knyga kurios id === delBookId
booksRoutes.delete('/book/:delBookId', async (req, res) => {
  try {
    const { delBookId } = req.params;
    await dbClient.connect();
    // gauti knyga kurios id yra === bookId
    const collection = dbClient.db('library').collection('books');
    const deleteResult = await collection.deleteOne({ _id: ObjectId(delBookId) });
    console.log('deleteResult ===', deleteResult);
    res.status(200).json(deleteResult);
  } catch (error) {
    console.error('error in deleting single book', error);
    res.status(500).json('something is wrong');
  } finally {
    // uzdaryti prisijungima
    await dbClient.close();
  }
});
// deleteOne({filterObj})

module.exports = booksRoutes;

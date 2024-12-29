const express = require('express');
const cors = require('cors');
const app = express();

const { initializeDatabase } = require('./db/db.connection');
const { BooksData } = require('./models/booksData.model');

app.use(cors());
app.use(express.json());

initializeDatabase();

app.get('/', (req, res) => {
  res.send('Hello, Express!');
});

app.get('/books', async (req, res) => {
  try {
    const allbooks = await BooksData.find();
    res.json(allbooks);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/books', async (req, res) => {
  const { bookName, author, genre } = req.body;

  try {
    const bookData = new BooksData({ bookName, author, genre });
    await bookData.save();
    res.status(201).json(bookData);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

//update book by id
app.post('/books/:id', async (req, res) => {
  const bookId = req.params.id;
  const { bookName, author, genre } = req.body;
  try {
    const updatedBook = await BooksData.findByIdAndUpdate(
      bookId,
      {
        bookName,
        author,
        genre,
      },
      { new: true }
    );

    if (!updatedBook) {
      res.status(404).json({ error: 'Book not found' });
    }

    res.status(200).json(updatedBook);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.delete('/books/:id', async (req, res) => {
  const bookId = req.params.id;

  try {
    const deletedBook = await BooksData.findByIdAndDelete(bookId);

    if (!deletedBook) {
      return res.status(404).json({ error: 'Book not found' });
    }

    res.status(200).json({
      message: 'Book deleted successfully',
      book: deletedBook,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

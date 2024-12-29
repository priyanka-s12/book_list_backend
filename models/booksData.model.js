const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  bookName: String,
  author: String,
  genre: String,
});

const BooksData = mongoose.model('BooksData', bookSchema);

module.exports = { BooksData };

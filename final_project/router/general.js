const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;
  if (username && password) {
    if (isValid(username)) {
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "User successfully registered. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists!"});
    }
  }
  return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  let booksPromise = new Promise((resolve, reject) => {
    resolve(books);
  });

  booksPromise.then(resp => {
    return res.status(200).send(JSON.stringify(resp, null, 4));
  });
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;

  let bookPromise = new Promise((resolve, reject) => {
    const book = books[isbn];
    if (!book) {
      reject();
    } else {
      resolve(book);
    }
  });

  bookPromise.then(resp => {
    return res.status(200).send(JSON.stringify(resp, null, 4));
  }).catch(() => {
    return res.status(404).send(`Book with ISBN ${isbn} not found`);
  });
});

// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;

  let bookPromise = new Promise((resolve, reject) => {
    const booksWithAuthor = Object.keys(books).filter(isbn => books[isbn].author === author).map(isbn => books[isbn]);
    if (booksWithAuthor.length < 1) {
      reject();
    } else {
      resolve(booksWithAuthor);
    }
  });

  bookPromise.then(resp => {
    return res.status(200).send(JSON.stringify(resp, null, 4));
  }).catch(() => {
    return res.status(404).send(`No books with author ${author} found`);
  });
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title;
  let bookPromise = new Promise((resolve, reject) => {
    const booksWithTitle = Object.keys(books).filter(isbn => books[isbn].title === title).map(isbn => books[isbn]);
    if (booksWithTitle.length < 1) {
      reject();
    } else {
      resolve(booksWithTitle);
    }
  });

  bookPromise.then(resp => {
    return res.status(200).send(JSON.stringify(resp, null, 4));
  }).catch(() => {
    return res.status(404).send(`No books with title ${title} found`);
  });
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];

  if (!book) {
    return res.status(404).send(`Book with ISBN ${isbn} not found`);
  }

  return res.status(200).send(JSON.stringify(book.reviews, null, 4));
});

module.exports.general = public_users;

const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;
  // Check if both username and password are provided
  if (username && password) {
      // Check if the user does not already exist
      if (users.some(u => u.username === username)) {
        return res.status(404).json({message: "User already exists!"});
      } else {
        // Add the new user to the users array
        users.push({username, password});
        console.log(users);
        return res.status(200).json({message: "User successfully registered. Now you can login"});
    }
  }
  // Return error if username or password is missing
  
  return res.status(404).json({message: "Username or Password not provided. Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  res.send(JSON.stringify({books},null,4));
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", async function (req, res) {
    //Write your code here   
    const ISBN = req.params.isbn;   
    res.send(books[ISBN]);
});
  
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  new Promise((resolve, reject) => {
    const author = req.params.author;
    const booksByAuthor = Object.values(books).filter(book => book.author === author);
    if (booksByAuthor.length === 0) {
        reject("No books found by this author.");
    } else {
        resolve(booksByAuthor);
    }
    }) .then(data => {
        res.status(200).json(data);
    }).catch(error => {
        res.status(404).json({ message: "No books Found." });
    });
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  new Promise((resolve, reject) => {
    const title = req.params.title;
    const booksByTitle = Object.values(books).filter(book => book.title === title);
    if (booksByTitle.length === 0) {
        reject("No books found with this title");
    } else {
        resolve(booksByTitle);
    }
    }) .then(data => {
        res.status(200).json(data);
    }).catch(error => {
        res.status(404).json({ message: "No books Found." });
    });
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const ISBN = req.params.isbn;
  let book = books[ISBN];
  const reviewByISBN = book.reviews;
  res.send(reviewByISBN);
});

module.exports.general = public_users;

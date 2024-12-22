const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
    //write code to check is the username is valid
    return users.find((user) => user.username === username);
}

const authenticatedUser = (username,password)=>{ //returns boolean
    //write code to check if username and password match the one we have in records.
    const user = users.find((user) => user.username === username);
    return user && user.password === password;
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;
  
  if(!isValid(username) || !password){
    return res.status(403).json({ message: "Invlaid Username or Password."});
  }

  if (authenticatedUser(username, password)) {
    // Verify JWT token
    let accessToken = jwt.sign({
        data: password
    }, 'access', { expiresIn: 60 * 60 });

    // Store access token and username in session
    req.session.authorization = {
        accessToken, username
    }
    return res.status(200).send("User successfully logged in");
    } else {
    return res.status(208).send("Invalid Login. Check username and password" );
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const ISBN = req.params.isbn;
  const review = req.body.review;
  if (!books[ISBN]){
    return res.status(200).json({ message: "Book not Found."});
}   
  books[ISBN].reviews[req.session.authorization["username"]] = review;
  return res.status(200).json({ message: "Review Added or Modified.", reviews: books[ISBN].reviews });
  
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    //Write your code here
    const ISBN = req.params.isbn;
    if (!books[ISBN]){
        return res.status(200).json({ message: "Book not Found."});
    }

    if (!books[ISBN].reviews[req.session.authorization["username"]] > 0){
        return res.status(200).json({ message: "Review not Found."});
    }
  delete books[ISBN].reviews[req.session.authorization["username"]];
  return res.status(200).json({ message: "Review Deleted.", reviews: books[ISBN].reviews });
  
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;

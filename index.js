require("dotenv").config();

// Framework
const express = require("express");

const mongoose = require("mongoose");

// Database
const database = require("./database");

// Models
const BookModels = require("./database/book");
const AuthorModel = require("./database/author");
const PublicationModel = require("./database/publication");

// Initialization
const booky = express();

// Configuration
booky.use(express.json());

// Establish database connection
mongoose.connect(process.env.MONGO_URL, 
    {
        // useNewUrlParser : true,
        useUnifiedTopology : true,
       // useFindAndModify : false,
       // useCreateIndex : true,
    })
    .then( () => console.log("connection established!🤗") );

/*
 Route                  /
 Description            Get all books
 Access                 Public
 Parameter              None
 Methods                GET
*/


booky.get("/", (req, res) => {
    return res.json({books: database.books});
});


/*
 Route                  /
 Description            Get specific book on  ISBN
 Access                 Public
 Parameter              isbn
 Methods                GET
*/


booky.get("/is/:isbn", (req, res) =>{
    const getSpecificBook = database.books.filter( 
        (book) => book.ISBN === req.params.isbn 
        );
        
        if(getSpecificBook.length === 0) {
            return res.json({error: `No book found for the ISBN of ${req.params.isbn}`
        });
        }
        
        return res.json( { book : getSpecificBook});
});

/*
 Route                  /
 Description            Get specific book based on category
 Access                 Public
 Parameter              Category
 Methods                GET
*/


booky.get("/c/:category", (req, res) => {
    const getSpecificBook = database.books.filter((book) => 
        book.category.includes(req.params.category)
    );

    if(getSpecificBook.length === 0) {
        return res.json({error: `No book found for the category of ${req.params.category}`
    });
    }
    
    return res.json( { book : getSpecificBook});
});


/*
 Route                  /author
 Description            get all authors
 Access                 Public
 Parameter              None
 Methods                GET
*/

booky.get("/author", (req, res) => {
    return res.json({ authors: database.author });
});

/*
 Route                  /author/book
 Description            get all authors based on books
 Access                 Public
 Parameter              isbn
 Methods                GET
*/
booky.get("/author/book/:isbn", (req, res) => {
    const getSpecificAuthor = database.author.filter((author) => 
        author.books.includes(req.params.isbn)
    );

    if(getSpecificAuthor.length === 0) {
        return res.json({error: `No author found for the book of ${req.params.isbn}`,
    });
    }
    
    return res.json( { authors : getSpecificAuthor});
});

/*
 Route                  /publications
 Description            get all publications
 Access                 Public
 Parameter              None
 Methods                GET
*/
booky.get("/publication" , (req, res) => {
    return res.json({ publications : database.publication });
});


/*
 Route                  /book/add
 Description            Add new book
 Access                 Public
 Parameter              None
 Methods                POST
*/
booky.post("/book/add", (req, res) => {
    const { newBook } = req.body;  //Destructuring 


    database.books.push.newBook;
    return res.json({ books : database.books});
});

/*
 Route                  /author/add
 Description            Add new author
 Access                 Public
 Parameter              None
 Methods                POST
*/
booky.post("/author/add", (req , res) => {
    const { newAuthor} = req.body;
    database.author.push( newAuthor );
    return res.json( { authors : database.author });
});

/*
 Route                  /publication/add
 Description            Add new publication
 Access                 Public
 Parameter              None
 Methods                POST
*/
booky.post("/publication/add", (req, res) => {
    const { newPublication } = req.body;
    database.publication.push( newPublication );
    return res.json( { publications : database.publication } );
});

/*
 Route                  /book/update/title
 Description            Update book title
 Access                 Public
 Parameter              None
 Methods                PUT
*/
booky.put("/book/update/title/:isbn", (req, res) => {
    //here we can use forEach and Map 
    database.books.forEach((book) => {
        if(book.ISBN == req.params.isbn) {
            book.title = req.body.newBookTitle ;
            return;
        }
    });
    return res.json({books : database.books});
});

/*
 Route                  /book/author/update
 Description            Update/add new author for a book
 Access                 Public
 Parameter              None
 Methods                PUT
*/
booky.put("/book/author/update/:isbn/:authorID", (req, res) => {
    //update book data
    database.books.forEach((book) => {
        if (book.ISBN === req.params.isbn) {
            return book.author.push(parseInt(req.params.authorID));
        }
    });

    //update author database
    database.author.forEach ((authors) => {
        if (author.id === parseInt( req.params.authorID)){
            return author.books.push(req.params.isbn);
        }
    });
    return res.json({ books : database.books , author: database.author });
});

/*
 Route                  /publication/update/book
 Description            Update/add new book to a publication
 Access                 Public
 Parameter              isbn
 Methods                PUT
*/
booky.put("/publication/update/book/:isbn", (req, res) => {
    // update the publication database
    database.publications.forEach( (publication) => {
        if ( publication.id === req.body.pubID) {
            return publication.books.push(req.params.isbn);
        }
    });
    // update the book database
    database.books.forEach( (book) => {
        if ( book.ISBN === req.params.isbn) {
            book.publication = req.body.pubID;
            return;
        }
    });
    return res.json({
        books: database.books, 
        publications: database.publications, 
        authors : database.authors,
        message: "Successfully updated publication",
    });
});


/*
 Route                  /book/delete
 Description            delete a book
 Access                 Public
 Parameter              isbn
 Methods                DELETE
*/
booky.delete("/book/delete/:isbn", (req,res) => {
    // MAP :- replace the whole object
    // forEach : edit at a single point directly to master/main database (its hard to filter using forEach)

    const updatedBookDatabase = database.books.filter( 
        (book) => book.ISBN !== req.params.isbn
        );

        // filter will return new array thts why we need to save it somewhere

        database.books = updatedBookDatabase; //changing book database from CONST to LET, bcoz we're chnging it so it'll throw error  if database is const 
        return res.json( { books  : database.books });
});

/*
 Route                  /book/delete/author
 Description            delete a author from a book
 Access                 Public
 Parameter              isbn
 Methods                DELETE
*/
booky.delete("/book/delete/author/:isbn/:authorID", (req, res) => {
    // update the book database
            // use forEach first bcoz u r not deleting whole database but only 1 property viz author
    database.books.forEach( (book) => {
        if (book.ISBN === req.params.isbn) {
            const newAuthorList = book.authors.filter(
                (author) => author !== parseInt(req.params.authorID)
            );
            book.authors = newAuthorList;
            return;
        }
    });
    // update the author database
    database.authors.forEach( (author) => {
        if ( author.id === parseInt(req.params.authorID)) {
            const newBooksList = author.books.filter(
                (book) => book !== req.params.isbn
            );

            author.books = newBooksList ;
            return;
        }
    });
    return res.json( {
        message : " author was deleted!! 😌",
        book : database.books,
        author: database.authors,
    });
});


/*
 Route                  /publication/delete/book
 Description            delete a book from publication
 Access                 Public
 Parameter              isbn , publication id
 Methods                DELETE
*/
booky.delete("/publication/delete/book/:isbn/:pubID", (req, res) => {
    // update publication database
    database.publications.forEach( (publication) => {
        if(publication.id === parseInt(req.params.pubID)) {
            const newBooksList = publication.books.filter( 
                (book) => book !== req.params.isbn
            );
            publication.books = newBooksList;
            return;
        }
    });
    // update book database
    database.books.forEach( (book) => {
        if(book.ISBN === req.params.isbn){
            book.publication = 0; // no publication available
            return;
        }
    });
    return res.json( { books : database.books, publications: database.publications});
});

booky.listen(3000, () => console.log("Server is running😎"));


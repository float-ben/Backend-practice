const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const { Schema, Document } = mongoose;
const app = express();
const PORT = process.env.PORT || 4000;

app.use(bodyParser.json());

// Connect to MongoDB w/ Mongoose (to go along with Node.js)
mongoose.connect("mongodb+srv://bl45:Benrock123$@book-api.m8jj90v.mongodb.net/?retryWrites=true&w=majority", { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch((error) => console.error('MongoDB connection error:', error));


//Starting the server!
app.listen(PORT, () => {
    console.log(`Server is listening on http://localhost:${PORT}`);
});

//Defining book schema and model
const bookSchema = new Schema({
    title: String,
    author: String,
    genre: String,
});

const BookModel = mongoose.model('Book', bookSchema);

// My End Points!--------------------------------------

// POST: Post/Create a new book
app.post('/api/books', async (req, res) => {
    try {
        //console.log(req.body);
        // Validate that the request body contains the required fields
        if (!req.body.title || !req.body.author || !req.body.genre) {
            return res.status(400).json({ error: 'Title, author, and genre are required fields.' });
        }

        const newBook = await BookModel.create(req.body);
        res.status(201).json(newBook); // Return the created book document
    }
    catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// GET: get all books
app.get('/api/books', async (req, res) => {
    try {
        const books = await BookModel.find().select('title author genre'); // Specify the fields you want to retrieve
        //console.log(books);
        res.status(200).json(books);
    }
    catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// DELETE: Delete a book by ID
app.delete('/api/books/:id', async (req, res) => {
    try {
        const deletedBook = await BookModel.findByIdAndRemove(req.params.id);
        if (!deletedBook) {
            res.status(404).json({ error: 'Book not found' });
        }
        else {
            res.status(204).send();
        }
    }
    catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }

});

// POST: update a book's title by ID
app.post('/api/books/:id/update-title', async (req, res) => {
    try {
        const { id } = req.params;
        const { newTitle } = req.body;
        const updatedBook = await BookModel.findByIdAndUpdate(id, { title: newTitle }, { new: true });
        if (!updatedBook) {
            res.status(404).json({ error: 'Book not found' });
        }
        else {
            res.status(200).json(updatedBook);
        }
    }
    catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

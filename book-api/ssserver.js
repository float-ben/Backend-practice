//import express from 'express';
//import bodyParser from 'body-parser';
//import mongoose, { Schema, Document } from 'mongoose';
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const { Schema, Document } = mongoose;
const app = express();
const PORT = process.env.PORT || 4000;
app.use(bodyParser.json());
// Connect to MongoDB
mongoose.connect("mongodb+srv://bl45:Benrock123$@book-api.m8jj90v.mongodb.net/?retryWrites=true&w=majority", { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch((error) => console.error('MongoDB connection error:', error));
// Define book schema and model here
app.listen(PORT, () => {
    //console.log(`Server is running on port ${PORT}`);
    console.log(`Server is listening on http://localhost:${PORT}`);
});
const bookSchema = new Schema({
    title: String,
    author: String,
    genre: String,
});

const BookModel = mongoose.model('Book', bookSchema);
// Add your endpoints below -----------------------------------------------

// Create a new book
app.post('/api/books', async (req, res) => {
    try {
        const newBook = await BookModel.create(req.body);
        res.status(201).json(newBook);
    }
    catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Get all books
app.get('/api/books', async (req, res) => {
    try {
        const books = await BookModel.find();
        res.status(200).json(books);
    }
    catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Delete a book by ID
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
// Define your creative POST endpoint here
// Update a book's title by ID
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

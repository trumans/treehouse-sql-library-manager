const express = require('express');
const router = express.Router();

const SqlOp = require('sequelize').Op;

const Book = require('../models').Book;

const pageSize = 5;

// Return parameters to display a 500 error on error page
function status_500_params(message) {
	return {status: 500, message: message, title: "Server Error"}
}

// Return parameters to display response status code and message on error page 
function response_status_params(res) {
	return {status: res.statusCode, message: res.statusMessage, 
			title: "Server Error"}
}

// Create a new book - entry form
router.get('/books/new', (req, res, next) => {
	res.render('new-book', { book: Book.build(), title: 'New Book' });
});

// Create a new book - post action
router.post('/books/new', (req, res) => {
	Book.create(req.body)
		.then( function() {res.redirect('/books')})
		// If validation error then re-render page with error messages
		.catch( function(err) {
			// if validation error then re-render with error messages
        	if (err.name === "SequelizeValidationError") {
            	var book = Book.build(req.body);
    			book.id = req.params.id
            	res.render('new-book', 
              		{ book: book, title: 'New Book', errors: err.errors });
            // any other errors 
        	} else {
				res.render('error', status_500_params(err));
        	}
        });
});

// Display a book with options to update or delete
router.get('/books/:id', (req, res, next) => {
	Book.findByPk(req.params.id).then( function(book) { 
		if ( book ) {
    		return res.render('update-book', { book: book, title: book.title });
    	} else {
      		// book was not in database. return 404 error
      		next();
  		}
  	});
});

// Delete a book - post action
router.post('/books/:id/delete', (req, res) => {
	Book.findByPk(req.params.id)
		.then( function(book) { 
			if (book) {
				book.destroy(); 
			} else {
				res.render('error', response_status_params(res));
			}})
		.then( function() { res.redirect('/books') })
		.catch( function(err) {
			res.render('error', status_500_params(err));
		});
});

// Update a book - post action
router.post('/books/:id', (req, res) => {
	Book.findByPk(req.params.id)
		.then( function(book) { return book.update(req.body); })
		.then( function(book) { 
			if (book) { 
				res.redirect('/books'); 
			} else {
				res.render('error', response_status_params(res));
			}})
		.catch( function(err) {
			// If validation error then re-render page with error messages
        	if (err.name === "SequelizeValidationError") {
            	var book = Book.build(req.body);
    			book.id = req.params.id
            	res.render('update-book', 
              		{ book: book, title: book.title, errors: err.errors });
            // any other errors
        	} else {
				res.render('error', status_500_params(err));
        	}});
});

// List all books by page with search filter
router.get('/books', (req, res) => {
	var page = parseInt(req.query.p);
	var search = req.query.s;  

	// set find options
	var findOpts = {};
	if (isNaN(page)) { page = 1 }
	findOpts.offset = (page-1) * pageSize;
	findOpts.limit =  pageSize;
	// search criteria from query string	
	if ( search != undefined) {
		const searchEx = `%${search}%`;
		findOpts.where = { 
				[SqlOp.or]: [
					{title:  {[SqlOp.like]: searchEx}}, 
					{author: {[SqlOp.like]: searchEx}}, 
					{genre:  {[SqlOp.like]: searchEx}}, 
					{year:   {[SqlOp.like]: searchEx}} 
				]}
	} 

	// find books and render results
	Book.findAll(findOpts).then( function(books) {
		var renderOpts = { books: books, title: 'Books' }
		renderOpts.search = search || ''
		if (page > 1) { renderOpts.prevPage = page - 1 }
		if (books.length == pageSize) { renderOpts.nextPage = page + 1 }

  		res.render('index', renderOpts);
	});
});

module.exports = router
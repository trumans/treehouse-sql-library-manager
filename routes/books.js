const express = require('express');
const router = express.Router();

const Book = require('../models').Book;

const pageSize = 5;
const Sequelize = require('sequelize');
const SqlOp = Sequelize.Op;

// Return parameters for error page to display a 500 error
function status_500_params(message) {
	return {status: 500, message: message, title: "Server Error"}
}

// Return parameters for error page to display response status code and message
function response_status_params(res) {
	return {status: res.statusCode, message: res.statusMessage, 
			title: "Server Error"}
}

// Create a new book form
router.get('/books/new', (req, res, next) => {
	res.render('new-book', { book: Book.build(), title: 'New Book' });
});

// Create a new book - post action
router.post('/books/new', (req, res, next) => {
	Book.create(req.body)
		.then( function() {res.redirect('/books')})
		// If validation error then re-render page with error messages
		.catch( function(err) {
        	if (err.name === "SequelizeValidationError") {
            	var book = Book.build(req.body);
    			book.id = req.params.id
            	res.render('new-book', 
              		{ book: book, title: 'New Book', errors: err.errors });
        	} else {
				res.render('error', status_500_params(err));
        	}
        });
});

// Display/update/delete a book form
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
router.post('/books/:id/delete', (req, res, next) => {
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
router.post('/books/:id', (req, res, next) => {
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
        	} else {
				res.render('error', status_500_params(err));
        	}});
});

// List all books by page
router.get('/books', (req, res) => {
	const page = parseInt(req.query.p);  // page# from URL query params
	var opts = { offset: ( isNaN(page) ) ? 0 : (page-1) * pageSize, 
				 limit:  pageSize
			   }
	// search criteria, if in query string
	if (req.query.s != undefined) {
		const search = `%${req.query.s}%`;
		opts.where = { 
				[SqlOp.or]: [
					{title:  {[SqlOp.like]: search}}, 
					{author: {[SqlOp.like]: search}}, 
					{genre:  {[SqlOp.like]: search}}, 
					{year:   {[SqlOp.like]: search}} 
				]}
	}

	Book.findAll(opts).then( function(books) {
  		res.render('index', {books: books, title: 'Books'});
	});
});

module.exports = router
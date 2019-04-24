// Library Manager app

const express = require('express');
const app = express();
const sequelize = require('./models').sequelize;

const Book = require('./models').Book;

app.set('view engine', 'pug');
app.use('/static', express.static('public'));
sequelize.sync().then(function() {
	app.listen(3000, () => { console.log('\napp is listening on port 3000') });
});

app.get('/books/:id', (req, res, next) => {
	Book.findByPk(req.params.id).then( function(book) { 
		if ( book ) {
    		return res.render('update-book', { book: book, title: book.title });
    	} else {
      		// book was not in database. return 404 error
      		next();
  		}
  	});
});

app.post('/books/:id/delete', (req, res, next) => {
	// delete book SQL call
});

app.post('/books/:id', (req, res, next) => {
	// update book SQL call
});

app.get('/books/new', (req, res, next) => {
	res.render('new-book', { title: 'New Book' });
});

app.post('/books/new', (req, res, next) => {
	// create book SQL call
});

app.get('/books', (req, res) => {
	Book.findAll().then( function(books) {
  		res.render('index', {books: books, title: 'Books'});
	});
});

app.get('/', (req, res) => {
  res.redirect('/books');
});

// intentionally throw an error to display the Server Error page
app.get('/error', (req, res) => {
	status = 400;
	message = new Error('The route intentionally returns a 400 error');
	title = "Server Error";
	res.render('error', { status, message, title });
});

// capture undefined routes to show a 404 error.
app.use((req, res) => {
	res.render('page-not-found', {title: "Page Not Found"});
});

// catch errors thrown by app for any request and route
app.use((err, req, res, next) => {
	// pass to the error page the http status 
	//   or the teapot status if outside of expected status range
	res.locals.status = 
		(err.status >= 100 && err.status < 600) ? err.status : 418;
	res.locals.message = err;
	res.locals.title = "Server Error";
	res.render('error');
});

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
    		return res.render('book-update', { book: book, title: "Update Book" });
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
	res.render('new-book');
});

app.post('/books/new', (req, res, next) => {
	// create book SQL call
});

app.get('/books', (req, res) => {
	console.log("in get /books");
	Book.findAll().then( function(books) {
		console.log("in get /books findAll then");
  		res.locals.books = books;
  		res.locals.title = "Book List";
  		res.render('index');
	});
});

app.get('/', (req, res) => {
  res.redirect('/books');
});

// intentionally throw an error
app.get('/error', (req, res) => {
  message = new Error('Route intentionally returns a 400 error');
  status = 400;
  res.render('error', { status, message });
});

// capture undefined routes to show a 404 error.
app.use((req, res) => {
  res.render('page-not-found');
});

// catch errors thrown by app for any request and route
app.use((err, req, res, next) => {
  console.log("in err catcher. err.status is "+err.status);
  (err.status >= 100 && err.status < 600) ? e = err.status : e = 418
  res.status(e);
  // display stack dump on formated error page
  res.locals.status = e
  res.locals.message = err;
  res.render('error');
});




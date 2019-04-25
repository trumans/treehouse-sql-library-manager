// Library Manager app

const express = require('express');
const bodyParser = require('body-parser');
const sequelize = require('./models').sequelize;
const app = express();

app.set('view engine', 'pug');
app.use('/static', express.static('public'));

// support http request parsing
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

// Synchronize Sequelize models and database then start listener at port 3000
sequelize.sync().then(function() {
	app.listen(3000, () => { console.log('\napp is listening on port 3000') });
});

const bookRoutes = require('./routes/books');
app.use(bookRoutes);

// Root - redirects to list all books
app.get('/', (req, res) => {
  res.redirect('/books');
});

// intentionally throw an error to display the Server Error page
app.get('/server-error', (req, res) => {
	status = 599;
	message = new Error('The route intentionally returns a 599 error');
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

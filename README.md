
# Routes and Features #

* / (root)v         - redirects to /books
* /books (get)      - list books in database. supported query strings:
  * p=page  - where 'page' is which the page of the results to display. Page 1 is 
              displayed if the key is omitted or the value does not parse to an 
              integer greater than 0.
  * s=value - where 'value' is the case-insensitive search value which filters records 
              on the title, author, genre or year fields. Records are not 
              filtered if the key is omitted or the search value is empty.
* /books/new (get)  - form to enter data for a new book. Books require a title and
                      author.
* /books/new (post) - create a book using data from the form.  Books missing title
                      or author return to the entry form with an error message(s).
* /books/# (get)    - form to display, update or delete a book, where # is the 
                      record id.  Books require a title and author.
* /books/# (post)   - update the book record using data from the form. Books missing
                      title or author return to the update form with an error message(s).
* /books/#/delete (post) - delete the book, where # is the record id.
* /server-error     - display an error 599 on the server error page.

# Exceeds Requirements Features #

* /books page contains a search field which filters records as described above in 
  the query string s=value.
* /books page contains buttons to display the previous and next page of books. The
  'previous' button is suppressed on page 1, and the 'next' button is suppressed 
  on a partial page (presumably the last page). Initially, the page size is only 
  5 books to help demonstrate the feature, but can be changed by editing the 
  pageSize variable at the top of /routes/books.js

# To Install #

1. Download the project and install dependencies with "npm install" from a terminal window.
2. Start the server side of the app with "npm start", which calls app.js.
3. In a browser open the URL "localhost:3000"

# Project Structure #

The application uses Express to manage routes, Pug to generate html, and 
Sequelize to access the local sqlite database.

* app.js        - starts the application on the server. contains error handling routes
* config folder - project configurations, such as db connections used by sequelize
* library.db    - sqlite database containing book data
* migrations folder - not used
* model folder  - object used by sequelize to interact with database 
* package.json  - npm configuration file
* public folder - static assets, such as css stylesheet
* README.md     - this file
* routes folder - routes for books pages
* seeders folder - not used
* views folder  - pug templates for rendering html

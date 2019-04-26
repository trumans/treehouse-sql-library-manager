
# Routes and Features #

/ - root redirects to /books
/books (get) - list books in database
  supports query strings:
    p=page - 'page' is the page# from the results to display. This first page is
      is displayed if the key omitted or 'page' is not an integer.
    s=value - 'value' is the case-insensitive search value applied to the title,
      author, genre or year fields. Records are not filtered if omitted or null.
/books/new (get) - form to create a book
/books/new (post) - create a book using data from the form
/books/# (get) - form display, update or delete a book, where # is record id
/books/# (post) - update the book record using data from the form
/books/#/delete (post) - delete the book record
/server-error - display an error 599 on server error page

# Exceeds Requirements Features #

/books contains a search field which filters records as described above in 
  s=value query string
/books page contains buttons to display the previous and next page of books. The
  'previous' button is suppressed on page 1, and the 'next' button is suppressed 
  on a partial page. Initially the page size is only 5 books to facilitate in 
  demonstrating the buttons. The page size can be changed by editing the
  pageSize variable at the top of /routes/books.js

# To Install #

1. Download the project and install dependencies with "npm install".
2. Launch the app with "npm start", which calls app.js.
3. In a browser open the URL "localhost:3000"

# Project Structure #

The application uses Express to manage routes, Pug to generate html, and 
Sequelize to access a local sqlite database.

app.js        - starts the application on the server. contains error handling routes
config folder - project configurations, such as db connections used by sequelize
library.db    - sqlite database containing book data
migrations folder - not used
model folder  - object used by sequelize to interact with database 
package.json  - npm configuration file
public folder - static assets, such as css stylesheet
README.md     - this file
routes folder - routes for books pages
seeders folder - not used
views folder  - pug templates for rendering html

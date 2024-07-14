const dbConfig = require('../config/DbConfigPractical');

class Book {
    constructor(id, title, author, availabilty) {
      this.book_id = id;
      this.title = title;
      this.author = author;
      this.availabilty = availabilty
    }

    static async getAllBooks() {
      const connection = await sql.connect(dbConfig);
      const sqlQuery = `SELECT * FROM Books`; // SQL query to get all books
      const request = connection.request();
      const result = await request.query(sqlQuery);
      connection.close();
  
      return result.recordset.map(
        (row) => new Book(row.book_id, row.title, row.author, row.availability)
      );
    }
  
    static async updateBookAvailability(book_id, availability) {
      const connection = await sql.connect(dbConfig);
      const sqlQuery = `UPDATE Books SET availability = @availability WHERE book_id = @book_id`;
      const request = connection.request();
      request.input('book_id', book_id);
      request.input('availability', availability);
      const result = await request.query(sqlQuery);
      connection.close();
  
      return result.rowsAffected;
    }
  }
  
  module.exports = Book;

  
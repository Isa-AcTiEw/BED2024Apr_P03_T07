const db_Config = require("../../../config/db_Config");

class Book {
    constructor(id, title, author, availabilty) {
      this.book_id = id;
      this.title = title;
      this.author = author;
      this.availabilty = availabilty
    }

    async getAllBooks(){
        const connection = await sql.connect(dbConfig);

        const sqlQuery = `SELECT * FROM Books`; // Replace with your actual table name
    
        const request = connection.request();
        const result = await request.query(sqlQuery);
    
        connection.close();
    
        return result.recordset.map(
          (row) => new Book(row.book_id, row.title, row.author, row.availabilty)
        ); // Convert rows to Book objects
    }

    async updateBookAvailability(book_id,Book){
      const connection = await sql.connect(db_Config);
      const sqlQuery = `UPDATE Books SET availability = @availability WHERE book_id = @book_id`
      const request = connection.request();
      request.input("book_id",Book.id);
      request.input("availability",Book.availabilty)

    }
}  

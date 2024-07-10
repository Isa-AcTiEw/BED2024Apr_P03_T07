const sql = require('mssql');
const dbConfig = require('../config/DbConfigPractical');

const getAllBooks = async (req, res) => {
  try {
    const pool = await sql.connect(dbConfig);
    const result = await pool.request().query('SELECT * FROM Books');
    res.json(result.recordset);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const updateAvailability = async (req, res) => {
  const { bookId } = req.params;
  const { availability } = req.body;

  if (availability !== 'Y' && availability !== 'N') {
    return res.status(400).json({ message: 'Invalid availability value' });
  }

  try {
    const pool = await sql.connect(dbConfig);
    await pool.request()
      .input('bookId', sql.Int, bookId)
      .input('availability', sql.Char, availability)
      .query('UPDATE Books SET availability = @availability WHERE book_id = @bookId');

    res.json({ message: 'Book availability updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = { getAllBooks, updateAvailability };

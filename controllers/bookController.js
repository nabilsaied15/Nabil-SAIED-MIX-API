const { pool } = require('../config/db.postgres');

const bookController = {
  // GET tous les livres
  getAllBooks: async (req, res) => {
    try {
      const result = await pool.query('SELECT * FROM books ORDER BY id');
      res.json(result.rows);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // POST créer un livre
  createBook: async (req, res) => {
    const { title, author, available = true } = req.body;
    
    try {
      const result = await pool.query(
        'INSERT INTO books (title, author, available) VALUES ($1, $2, $3) RETURNING *',
        [title, author, available]
      );
      res.status(201).json(result.rows[0]);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = bookController;
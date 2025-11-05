const { pool } = require('../config/db.postgres');

const bookController = {
  getAllBooks: async (req, res) => {
    try {
      const result = await pool.query('SELECT * FROM books ORDER BY id');
      res.json(result.rows);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

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
  },

  updateBook: async (req, res) => {
    const { id } = req.params;
    const { title, author, available } = req.body;
    try {
      const result = await pool.query(
        'UPDATE books SET title = $1, author = $2, available = $3 WHERE id = $4 RETURNING *',
        [title, author, available, id]
      );
      if (result.rows.length === 0) return res.status(404).json({ error: 'Livre non trouvé' });
      res.json(result.rows[0]);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  deleteBook: async (req, res) => {
    const { id } = req.params;
    try {
      const result = await pool.query('DELETE FROM books WHERE id = $1 RETURNING *', [id]);
      if (result.rows.length === 0) return res.status(404).json({ error: 'Livre non trouvé' });
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = bookController;
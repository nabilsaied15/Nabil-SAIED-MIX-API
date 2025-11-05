const { pool } = require('../config/db.postgres');

const Book = {
  // Trouver tous les livres
  findAll: async () => {
    const result = await pool.query('SELECT * FROM books ORDER BY id');
    return result.rows;
  },

  // Trouver un livre par ID
  findById: async (id) => {
    const result = await pool.query('SELECT * FROM books WHERE id = $1', [id]);
    return result.rows[0];
  },

  // Trouver les livres par auteur
  findByAuthor: async (author) => {
    const result = await pool.query('SELECT * FROM books WHERE author = $1 ORDER BY title', [author]);
    return result.rows;
  },

  // Trouver les livres disponibles
  findAvailable: async () => {
    const result = await pool.query('SELECT * FROM books WHERE available = true ORDER BY title');
    return result.rows;
  },

  // Créer un nouveau livre
  create: async (bookData) => {
    const { title, author, available = true } = bookData;
    const result = await pool.query(
      'INSERT INTO books (title, author, available) VALUES ($1, $2, $3) RETURNING *',
      [title, author, available]
    );
    return result.rows[0];
  },

  // Mettre à jour un livre
  update: async (id, bookData) => {
    const { title, author, available } = bookData;
    const result = await pool.query(
      'UPDATE books SET title = $1, author = $2, available = $3 WHERE id = $4 RETURNING *',
      [title, author, available, id]
    );
    return result.rows[0];
  },

  // Supprimer un livre
  delete: async (id) => {
    const result = await pool.query('DELETE FROM books WHERE id = $1 RETURNING *', [id]);
    return result.rows[0];
  },

  // Marquer un livre comme non disponible
  markAsUnavailable: async (id) => {
    const result = await pool.query(
      'UPDATE books SET available = false WHERE id = $1 RETURNING *',
      [id]
    );
    return result.rows[0];
  },

  // Marquer un livre comme disponible
  markAsAvailable: async (id) => {
    const result = await pool.query(
      'UPDATE books SET available = true WHERE id = $1 RETURNING *',
      [id]
    );
    return result.rows[0];
  }
};

module.exports = Book;
const { pool } = require('../config/db.postgres');

// Ce modèle utilise directement le pool PostgreSQL
// car nous n'utilisons pas d'ORM comme Sequelize pour PostgreSQL

const User = {
  // Trouver tous les utilisateurs
  findAll: async () => {
    const result = await pool.query('SELECT * FROM users ORDER BY id');
    return result.rows;
  },

  // Trouver un utilisateur par ID
  findById: async (id) => {
    const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
    return result.rows[0];
  },

  // Trouver un utilisateur par email
  findByEmail: async (email) => {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    return result.rows[0];
  },

  // Créer un nouvel utilisateur
  create: async (userData) => {
    const { name, email } = userData;
    const result = await pool.query(
      'INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *',
      [name, email]
    );
    return result.rows[0];
  },

  // Mettre à jour un utilisateur
  update: async (id, userData) => {
    const { name, email } = userData;
    const result = await pool.query(
      'UPDATE users SET name = $1, email = $2 WHERE id = $3 RETURNING *',
      [name, email, id]
    );
    return result.rows[0];
  },

  // Supprimer un utilisateur
  delete: async (id) => {
    const result = await pool.query('DELETE FROM users WHERE id = $1 RETURNING *', [id]);
    return result.rows[0];
  }
};

module.exports = User;
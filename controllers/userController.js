const { pool } = require('../config/db.postgres');

const userController = {
  // GET tous les utilisateurs
  getAllUsers: async (req, res) => {
    try {
      const result = await pool.query('SELECT * FROM users ORDER BY id');
      res.json(result.rows);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // POST créer un utilisateur
  createUser: async (req, res) => {
    const { name, email } = req.body;
    
    try {
      const result = await pool.query(
        'INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *',
        [name, email]
      );
      res.status(201).json(result.rows[0]);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // GET un utilisateur par ID
  getUserById: async (req, res) => {
    const { id } = req.params;
    
    try {
      const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
      
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Utilisateur non trouvé' });
      }
      
      res.json(result.rows[0]);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = userController;
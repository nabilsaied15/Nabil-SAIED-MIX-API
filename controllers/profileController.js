const Profile = require('../models/Profile.model');
const { pool } = require('../config/db.postgres');

const profileController = {
  // GET profil par userId
  getProfile: async (req, res) => {
    const { userId } = req.params;
    
    try {
      const profile = await Profile.findOne({ userId: parseInt(userId) });
      
      if (!profile) {
        return res.status(404).json({ error: 'Profil non trouvé' });
      }
      
      res.json(profile);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // POST créer un profil
  createProfile: async (req, res) => {
    const { userId, preferences = [], history = [] } = req.body;
    
    try {
      // Vérifier si l'utilisateur existe en SQL
      const userResult = await pool.query('SELECT * FROM users WHERE id = $1', [userId]);
      
      if (userResult.rows.length === 0) {
        return res.status(404).json({ error: 'Utilisateur non trouvé dans la base SQL' });
      }

      const profile = new Profile({
        userId: parseInt(userId),
        preferences,
        history
      });

      const savedProfile = await profile.save();
      res.status(201).json(savedProfile);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // PUT mettre à jour un profil
  updateProfile: async (req, res) => {
    const { userId } = req.params;
    const { preferences, history } = req.body;
    
    try {
      const updatedProfile = await Profile.findOneAndUpdate(
        { userId: parseInt(userId) },
        { 
          $set: { preferences },
          $push: { history: { $each: history || [] } }
        },
        { new: true, upsert: false }
      );

      if (!updatedProfile) {
        return res.status(404).json({ error: 'Profil non trouvé' });
      }

      res.json(updatedProfile);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // GET données complètes utilisateur (SQL + NoSQL)
  getUserFullData: async (req, res) => {
    const { id } = req.params;
    
    try {
      // Récupérer données SQL
      const userResult = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
      
      if (userResult.rows.length === 0) {
        return res.status(404).json({ error: 'Utilisateur non trouvé' });
      }

      const user = userResult.rows[0];

      // Récupérer données MongoDB
      const profile = await Profile.findOne({ userId: parseInt(id) });

      res.json({
        user: {
          id: user.id,
          name: user.name,
          email: user.email
        },
        profile: profile || {
          preferences: [],
          history: []
        }
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = profileController;
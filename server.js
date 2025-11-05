const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { initPostgres } = require('./config/db.postgres');
const connectMongo = require('./config/db.mongo');

const userRoutes = require('./routes/userRoutes');
const bookRoutes = require('./routes/bookRoutes');
const profileRoutes = require('./routes/profileRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/users', userRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/profiles', profileRoutes);

// Route de test
app.get('/', (req, res) => {
  res.json({ 
    message: 'API Bookly+ Hybride SQL + NoSQL',
    endpoints: {
      users: '/api/users',
      books: '/api/books', 
      profiles: '/api/profiles',
      userFull: '/api/profiles/user-full/:id'
    }
  });
});

// Route 404
app.use((req, res) => {
  res.status(404).json({ error: 'Route non trouvée' });
});

// Gestion des erreurs
app.use((error, req, res, next) => {
  console.error('Erreur serveur:', error);
  res.status(500).json({ error: 'Erreur interne du serveur' });
});

// Démarrage du serveur
const startServer = async () => {
  try {
    // Connexion à MongoDB
    await connectMongo();
    
    // Initialisation de PostgreSQL
    await initPostgres();
    
    // Démarrage du serveur Express
    app.listen(PORT, () => {
      console.log(`🚀 Serveur démarré sur le port ${PORT}`);
      console.log(`📚 API Bookly+ accessible sur http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('❌ Erreur lors du démarrage du serveur:', error);
    process.exit(1);
  }
};

// Lancement de l'application
startServer();
//Importation d'express pour les middleware et de Mongoose pour MongoDB
const express = require('express')
const mongoose = require('mongoose');
const path = require('path'); //permet de recuperer l'URL pour les images ligne 29

// Constante app avec express
const app = express()

//Routes
const userRoutes = require('./routes/user');
const quoteRoutes = require('./routes/quote');

//Sécurité : CORS
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  next();
});

// connection à la base de donnée via mongoose
mongoose.connect(process.env.MONGO_URL,
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

app.use(express.json());
app.use('/images', express.static(path.join(__dirname, 'images'))); //permet à l'app d'aller chercher les images dans le dossier image

//on crée des middleware, l'attribut next permet de passer au middleware suivant : 
app.use('/api/quote', quoteRoutes);
app.use('/api/auth', userRoutes);

// Exportation de l'app
module.exports = app
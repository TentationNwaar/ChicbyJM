// models/User.js

const mongoose = require('mongoose');

// Définition du schéma utilisateur
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  // Ajoutez d'autres champs si nécessaire (par exemple, rôle, date de création, etc.)
});

// Création du modèle User
const User = mongoose.model('User', userSchema);

// Exportation du modèle
module.exports = User;
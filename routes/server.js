const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./authRoutes.js');

mongoose.connect('mongodb://localhost:27017/monDB', { useNewUrlParser: true, useUnifiedTopology: true });

const app = express();
app.use(express.json());
app.use('/auth', authRoutes);

app.listen(5000, () => console.log("Serveur démarré sur le port 5000"));
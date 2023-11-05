const express = require('express');
const fetch = require('node-fetch');

const app = express();
const PORT = 3000;

app.get('/weather', async (req, res) => {
  try {
    const apiKey = 'VOTRE_CLÉ_API';
    const apiUrl = `https://api.meteo-concept.com/api/forecast/daily?latlng=48.086%2C-2.635&insee=35238&token=${apiKey}`;

    const response = await fetch(apiUrl);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Une erreur s\'est produite' });
  }
});

app.listen(PORT, () => {
  console.log(`Serveur backend en cours d'exécution sur le port ${PORT}`);
});
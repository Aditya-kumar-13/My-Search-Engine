const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { rankDocuments } = require('./Ranking');
const { connectToMongo } = require('./db');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: `${process.env.Frontend_URL}`, 
  methods: ["GET", "POST"],
  credentials: true
}));app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


app.post('/search', async (req, res) => {
  console.log("entered backend")
  const queryString = req.body.query;
  console.log('Received query:', queryString);
  try {
    const results = await rankDocuments(queryString);
    res.status(200).json({ results });
  } catch (error) {
    console.error("Error during ranking:", error);
    res.status(500).json({ error: 'Search failed' });
  }
});

connectToMongo().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on PORT ${PORT}`);
  });
});

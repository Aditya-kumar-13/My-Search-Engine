const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { rankDocuments } = require('./Ranking');

const app = express();
const PORT = process.env.PORT || 5000;
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
let queryString;
app.post('/search', (req, res) => {
    queryString = req.body.query;
    console.log('Received form data:', req.body.query);
    results= rankDocuments(queryString);
    
    res.status(200).json({results });
});

app.listen(PORT, () => {
    console.log(`Server is running PORT: ${PORT}`);
});

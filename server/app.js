const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const apps = require('./app-data.js');

const app = express();
app.use(morgan('dev'));
app.use(cors());

app.get('/apps', (req, res) => {
    const { genres, sort} = req.query;
    if (sort) {
        if (!['Rating', 'App'].includes(sort)) {
            return res.status(400).send('Sort must be either rating or app');
        }
    }
    if (genres) {
        if (!['Action', "Puzzle", "Strategy", "Casual", "Arcade", 'Card'].includes(genres)) {
            return res.status(400).send('Genre must be one of either Action, Puzzle, Strategy, Casual, Arcade, or Card');
        }
    }
    let results = genres ? apps.filter(app => app.Genres.includes(genres)) : apps;
    if (sort === "App") {
        results.sort((a, b) => {
            return a[sort] > b[sort] ? 1 : a[sort] < b[sort] ? -1 : 0;
        });
    }
    if (sort === "Rating") {
        results.sort((a, b) => {
            return a[sort] > b[sort] ? -1 : a[sort] < b[sort] ? 1 : 0;
        });
    }
    res.json(results);
});


module.exports = app;
const express = require('express');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 3000;
const ADMIN_USER = process.env.ADMIN_USER || 'admin';
const ADMIN_PASS = process.env.ADMIN_PASS || 'password';

app.use(express.json());
app.use(express.static('public'));

let players = JSON.parse(fs.readFileSync('data/players.json'));
let games = JSON.parse(fs.readFileSync('data/games.json'));

app.get('/api/players', (req, res) => {
    res.json(players);
});

app.post('/api/players', (req, res) => {
    players.push(req.body);
    fs.writeFileSync('data/players.json', JSON.stringify(players, null, 2));
    res.status(201).json({ message: 'Player added' });
});

app.get('/api/games', (req, res) => {
    res.json(games);
});

app.post('/api/games', (req, res) => {
    games.push(req.body);
    fs.writeFileSync('data/games.json', JSON.stringify(games, null, 2));
    res.status(201).json({ message: 'Game added' });
});

app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    if (username === ADMIN_USER && password === ADMIN_PASS) {
        res.json({ success: true });
    } else {
        res.status(401).json({ success: false });
    }
});

app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));

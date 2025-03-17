const express = require('express');
const fs = require('fs');
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static('public'));

// Load data from JSON files
let players = JSON.parse(fs.readFileSync('data/players.json'));
let games = JSON.parse(fs.readFileSync('data/games.json'));

// Get all players
app.get('/api/players', (req, res) => {
    res.json(players);
});

// Add a player
app.post('/api/players', (req, res) => {
    players.push(req.body);
    fs.writeFileSync('data/players.json', JSON.stringify(players));
    res.status(201).json({ message: 'Player added' });
});

// Get all games
app.get('/api/games', (req, res) => {
    res.json(games);
});

// Add a game
app.post('/api/games', (req, res) => {
    games.push(req.body);
    fs.writeFileSync('data/games.json', JSON.stringify(games));
    res.status(201).json({ message: 'Game added' });
});

// Simple login (hardcoded for demo)
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    if (username === 'admin' && password === 'password') {
        res.json({ success: true });
    } else {
        res.status(401).json({ success: false });
    }
});

app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));

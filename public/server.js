const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static('public'));

// In-memory data (no JSON files!)
let players = [
  {
    team: "BGA",
    sport: "Football",
    year: 2025,
    Coach: { coachName: "Bacho Minadze" },
    players: [
      {
        name: "Diego Maradona",
        position: "midfielder",
        number: 10,
        goals: 5,
        assists: 5,
        matches: 7,
        image: "images/maradona.jpg"
      }
    ]
  }
];

let games = [];

// Get all players
app.get('/api/players', (req, res) => {
  res.json(players);
});

// Add a player (adds to first team for demo)
app.post('/api/players', (req, res) => {
  players[0].players.push(req.body);
  res.status(201).json({ message: 'Player added' });
});

// Delete a player by index in players[0].players
app.delete('/api/players/:index', (req, res) => {
  const index = parseInt(req.params.index);
  if (players[0].players[index]) {
    players[0].players.splice(index, 1);
    res.json({ message: 'Player deleted' });
  } else {
    res.status(404).json({ error: 'Player not found' });
  }
});

// Update a player by index in players[0].players
app.put('/api/players/:index', (req, res) => {
  const index = parseInt(req.params.index);
  if (players[0].players[index]) {
    players[0].players[index] = req.body;
    res.json({ message: 'Player updated' });
  } else {
    res.status(404).json({ error: 'Player not found' });
  }
});

// Get all games
app.get('/api/games', (req, res) => {
  res.json(games);
});

// Add a game
app.post('/api/games', (req, res) => {
  games.push(req.body);
  res.status(201).json({ message: 'Game added' });
});

// Simple login (hardcoded)
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  if (username === 'admin' && password === 'password') {
    res.json({ success: true });
  } else {
    res.status(401).json({ success: false });
  }
});

app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));

const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const ADMIN_USER = 'admin';
const ADMIN_PASS = 'adminpassword';

app.use(express.json());
app.use(express.static('public'));

// In-memory data (no JSON files)
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
let slides = []; // Slideshow images stored as array of URLs

// --- Players Endpoints ---
app.get('/api/players', (_req, res) => {
  res.json(players);
});

app.post('/api/players', (req, res) => {
  players[0].players.push(req.body);
  res.status(201).json({ message: 'Player added' });
});

// --- Games Endpoints ---
app.get('/api/games', (_req, res) => {
  res.json(games);
});

app.post('/api/games', (req, res) => {
  games.push(req.body);
  res.status(201).json({ message: 'Game added' });
});

// --- Login Endpoint ---
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  console.log('Login attempt:', username, password);  // Debug
  if (username === ADMIN_USER && password === ADMIN_PASS) {
    res.json({ success: true });
  } else {
    res.status(401).json({ success: false });
  }
});

// --- Slideshow Endpoints ---
app.get('/api/slides', (_req, res) => {
  res.json(slides);
});

app.post('/api/slides', (req, res) => {
  slides.push(req.body.url);
  res.status(201).json({ message: 'Slide added' });
});

app.delete('/api/slides/:index', (req, res) => {
  const index = parseInt(req.params.index);
  if (slides[index]) {
    slides.splice(index, 1);
    res.json({ message: 'Slide deleted' });
  } else {
    res.status(404).json({ error: 'Slide not found' });
  }
});

app.listen(PORT, () => console.log(`✅ Server running at http://localhost:${PORT}`));

const express = require('express');
const mongoose = require('mongoose');
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static('public'));


const MONGO_URI = 'mongodb+srv://admin:adminpassword@cluster0.hzsb2.mongodb.net/footballDB?retryWrites=true&w=majority';
mongoose.connect(MONGO_URI);


const playerSchema = new mongoose.Schema({
    name: String,
    position: String,
    number: Number,
    goals: Number,
    assists: Number,
    matches: Number,
    saves: Number,
    image: String,
    nickname: String
});

const gameSchema = new mongoose.Schema({
    team1: String,
    team2: String,
    score: String,
    date: String
});
const slideSchema = new mongoose.Schema({
    url: String
});
const Slide = mongoose.model('Slide', slideSchema);
const Player = mongoose.model('Player', playerSchema);
const Game = mongoose.model('Game', gameSchema);


app.get('/api/players', async (_req, res) => {
    const players = await Player.find();
    res.json(players);
});

app.post('/api/players', async (req, res) => {
    const player = new Player(req.body);
    await player.save();
    res.status(201).json({ message: 'Player added' });
});

app.put('/api/players/:id', async (req, res) => {
    await Player.findByIdAndUpdate(req.params.id, req.body);
    res.json({ message: 'Player updated' });
});

app.delete('/api/players/:id', async (req, res) => {
    await Player.findByIdAndDelete(req.params.id);
    res.json({ message: 'Player deleted' });
});

// --- Games API ---
app.get('/api/games', async (_req, res) => {
    const games = await Game.find();
    res.json(games);
});

app.post('/api/games', async (req, res) => {
    const game = new Game(req.body);
    await game.save();
    res.status(201).json({ message: 'Game added' });
});
// --- Update Game ---
app.put('/api/games/:id', async (req, res) => {
    await Game.findByIdAndUpdate(req.params.id, req.body);
    res.json({ message: 'Game updated' });
});

// --- Delete Game ---
app.delete('/api/games/:id', async (req, res) => {
    await Game.findByIdAndDelete(req.params.id);
    res.json({ message: 'Game deleted' });
});

// --- Slides API ---
app.get('/api/slides', async (_req, res) => {
    const slides = await Slide.find();
    const urls = slides.map(s => ({ id: s._id, url: s.url }));
    res.json(urls);
});

app.post('/api/slides', async (req, res) => {
    const slide = new Slide({ url: req.body.url });
    await slide.save();
    res.status(201).json({ message: 'Slide added' });
});

app.delete('/api/slides/:id', async (req, res) => {
    await Slide.findByIdAndDelete(req.params.id);
    res.json({ message: 'Slide deleted' });
});


app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    if (username === 'admin' && password === 'adminpassword') {
        res.json({ success: true });
    } else {
        res.status(401).json({ success: false });
    }
});


// --- Start Server ---
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));

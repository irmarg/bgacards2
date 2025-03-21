console.log("admin.js loaded");

document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
    loadPlayers();
    loadGames();
    loadSlides();
    setupLogoutButton();
});

let editingPlayerId = null;
let editingGameId = null;

// --- Load Players ---
function loadPlayers() {
    fetch('/api/players')
        .then(res => res.json())
        .then(players => {
            const list = document.getElementById('player-list');
            list.innerHTML = '';
            players.forEach(p => {
                const div = document.createElement('div');
                div.innerHTML = `
                    <strong>${p.name}</strong> - ${p.position}
                    <button onclick="startEditPlayer('${p._id}')">Edit</button>
                    <button onclick="deletePlayer('${p._id}')">Delete</button>
                `;
                list.appendChild(div);
            });
        });
}

function addOrUpdatePlayer() {
    const player = getPlayerInput();

    if (editingPlayerId) {
        fetch(`/api/players/${editingPlayerId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(player)
        })
        .then(res => res.json())
        .then(() => {
            alert('Player updated!');
            resetPlayerForm();
            loadPlayers();
        });
    } else {
        fetch('/api/players', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(player)
        })
        .then(res => res.json())
        .then(() => {
            alert('Player added!');
            clearPlayerForm();
            loadPlayers();
        });
    }
}

function startEditPlayer(id) {
    fetch('/api/players')
        .then(res => res.json())
        .then(players => {
            const p = players.find(pl => pl._id === id);
            if (p) {
                editingPlayerId = id;
                setPlayerForm(p);
                document.getElementById('player-submit').textContent = 'Save Changes';
            }
        });
}

function deletePlayer(id) {
    fetch(`/api/players/${id}`, { method: 'DELETE' })
        .then(res => res.json())
        .then(() => {
            alert('Player deleted');
            loadPlayers();
        });
}

function getPlayerInput() {
    return {
        name: document.getElementById('player-name').value,
        position: document.getElementById('player-position').value,
        number: parseInt(document.getElementById('player-number').value) || 0,
        goals: parseInt(document.getElementById('player-goals').value) || 0,
        assists: parseInt(document.getElementById('player-assists').value) || 0,
        saves: parseInt(document.getElementById('player-saves').value) || 0,
        matches: parseInt(document.getElementById('player-matches').value) || 0,
        nickname: document.getElementById('player-nickname').value || '',
        image: document.getElementById('player-image').value
    };
}

function setPlayerForm(p) {
    document.getElementById('player-name').value = p.name;
    document.getElementById('player-position').value = p.position;
    document.getElementById('player-number').value = p.number || '';
    document.getElementById('player-goals').value = p.goals || '';
    document.getElementById('player-assists').value = p.assists || '';
    document.getElementById('player-saves').value = p.saves || '';
    document.getElementById('player-matches').value = p.matches || '';
    document.getElementById('player-nickname').value = p.nickname || '';
    document.getElementById('player-image').value = p.image;
}

function clearPlayerForm() {
    document.querySelectorAll('#player-name, #player-position, #player-goals, #player-assists, #player-saves, #player-image, #player-number, #player-matches, #player-nickname')
        .forEach(input => input.value = '');
}


function resetPlayerForm() {
    editingPlayerId = null;
    clearPlayerForm();
    document.getElementById('player-submit').textContent = 'Add Player';
}

// --- Load Games ---
function loadGames() {
    fetch('/api/games')
        .then(res => res.json())
        .then(games => {
            const list = document.getElementById('game-list');
            list.innerHTML = '';
            games.forEach(g => {
                const div = document.createElement('div');
                div.innerHTML = `
                    <strong>${g.team1} vs ${g.team2}</strong> - ${g.score} on ${g.date}
                    <button onclick="startEditGame('${g._id}')">Edit</button>
                    <button onclick="deleteGame('${g._id}')">Delete</button>
                `;
                list.appendChild(div);
            });
        });
}

function addOrUpdateGame() {
    const game = {
        team1: document.getElementById('team1').value,
        team2: document.getElementById('team2').value,
        score: document.getElementById('score').value,
        date: document.getElementById('game-date').value
    };

    if (editingGameId) {
        fetch(`/api/games/${editingGameId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(game)
        })
        .then(res => res.json())
        .then(() => {
            alert('Game updated!');
            clearGameForm();
            loadGames();
        });
    } else {
        fetch('/api/games', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(game)
        })
        .then(res => res.json())
        .then(() => {
            alert('Game added!');
            clearGameForm();
            loadGames();
        });
    }
}

function startEditGame(id) {
    fetch('/api/games')
        .then(res => res.json())
        .then(games => {
            const g = games.find(game => game._id === id);
            if (g) {
                editingGameId = id;
                document.getElementById('team1').value = g.team1;
                document.getElementById('team2').value = g.team2;
                document.getElementById('score').value = g.score;
                document.getElementById('game-date').value = g.date;
                document.getElementById('game-submit').textContent = 'Save Game';
            }
        });
}

function deleteGame(id) {
    fetch(`/api/games/${id}`, { method: 'DELETE' })
        .then(res => res.json())
        .then(() => {
            alert('Game deleted!');
            loadGames();
        });
}

function clearGameForm() {
    editingGameId = null;
    document.getElementById('team1').value = '';
    document.getElementById('team2').value = '';
    document.getElementById('score').value = '';
    document.getElementById('game-date').value = '';
    document.getElementById('game-submit').textContent = 'Add Game';
}

// --- Slideshow Management ---
function loadSlides() {
    fetch('/api/slides')
        .then(res => res.json())
        .then(slides => {
            const list = document.getElementById('slide-list');
            list.innerHTML = '';
            slides.forEach(slide => {
                const div = document.createElement('div');
                div.innerHTML = `
                    <img src="${slide.url}" alt="Slide Image" style="max-width:200px;">
                    <button onclick="deleteSlide('${slide.id}')">Delete</button>
                `;
                list.appendChild(div);
            });
        });
}

function addSlide() {
    const url = document.getElementById('slide-image-url').value;
    fetch('/api/slides', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url })
    })
    .then(res => res.json())
    .then(() => {
        alert('Slide added!');
        document.getElementById('slide-image-url').value = '';
        loadSlides();
    });
}

function deleteSlide(id) {
    fetch(`/api/slides/${id}`, { method: 'DELETE' })
        .then(res => res.json())
        .then(() => {
            alert('Slide deleted');
            loadSlides();
        });
}

// --- Logout ---
function setupLogoutButton() {
    const logoutBtn = document.createElement('button');
    logoutBtn.textContent = 'Logout';
    logoutBtn.style.marginTop = '20px';
    logoutBtn.style.padding = '10px 20px';
    logoutBtn.style.backgroundColor = '#007BFF';
    logoutBtn.style.color = 'white';
    logoutBtn.style.border = 'none';
    logoutBtn.style.borderRadius = '5px';
    logoutBtn.style.cursor = 'pointer';

    logoutBtn.onclick = () => {
        localStorage.removeItem('isAdmin');
        alert('Logged out successfully.');
        window.location.href = 'index.html';
    };

    document.getElementById('logout-section').appendChild(logoutBtn);
}

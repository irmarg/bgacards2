// admin.js
console.log("admin.js loaded");

// --- Authentication Check on Page Load ---
document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
    loadPlayers();
    loadGames();
    loadSlides();
    setupLogoutButton(); 
});


// --- Player Management ---
function loadPlayers() {
    fetch('/api/players')
        .then(res => res.json())
        .then(players => {
            const list = document.getElementById('player-list');
            list.innerHTML = '';
            players.forEach((p, index) => {
                const div = document.createElement('div');
                div.innerHTML = `
                    <strong>${p.name}</strong> - ${p.position}
                    <button onclick="editPlayer(${index})">Edit</button>
                    <button onclick="deletePlayer(${index})">Delete</button>
                `;
                list.appendChild(div);
            });
        });
}

function addPlayer() {
    const player = getPlayerInput();
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

function editPlayer(index) {
    fetch('/api/players')
        .then(res => res.json())
        .then(players => {
            const p = players[index];
            setPlayerForm(p);
            const btn = document.getElementById('player-submit');
            btn.textContent = 'Save Changes';
            btn.onclick = () => saveEditedPlayer(index);
        });
}

function saveEditedPlayer(index) {
    const player = getPlayerInput();
    fetch(`/api/players/${index}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(player)
    })
    .then(res => res.json())
    .then(() => {
        alert('Player updated!');
        resetPlayerButton();
        clearPlayerForm();
        loadPlayers();
    });
}

function deletePlayer(index) {
    fetch(`/api/players/${index}`, { method: 'DELETE' })
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
        goals: parseInt(document.getElementById('player-goals').value) || 0,
        assists: parseInt(document.getElementById('player-assists').value) || 0,
        saves: parseInt(document.getElementById('player-saves').value) || 0,
        image: document.getElementById('player-image').value,
        nickname: ""
    };
}

function setPlayerForm(p) {
    document.getElementById('player-name').value = p.name;
    document.getElementById('player-position').value = p.position;
    document.getElementById('player-goals').value = p.goals;
    document.getElementById('player-assists').value = p.assists;
    document.getElementById('player-saves').value = p.saves;
    document.getElementById('player-image').value = p.image;
}

function clearPlayerForm() {
    document.getElementById('player-name').value = '';
    document.getElementById('player-position').value = '';
    document.getElementById('player-goals').value = '';
    document.getElementById('player-assists').value = '';
    document.getElementById('player-saves').value = '';
    document.getElementById('player-image').value = '';
}

function resetPlayerButton() {
    const btn = document.getElementById('player-submit');
    btn.textContent = 'Add Player';
    btn.onclick = addPlayer;
}

// --- Game Management ---
function loadGames() {
    fetch('/api/games')
        .then(res => res.json())
        .then(games => {
            const list = document.getElementById('game-list');
            list.innerHTML = '';
            games.forEach((g, index) => {
                const div = document.createElement('div');
                div.innerHTML = `
                    <strong>${g.team1} vs ${g.team2}</strong> - ${g.score} on ${g.date}
                    <button onclick="deleteGame(${index})">Delete</button>
                `;
                list.appendChild(div);
            });
        });
}

function addGame() {
    const game = {
        team1: document.getElementById('team1').value,
        team2: document.getElementById('team2').value,
        score: document.getElementById('score').value,
        date: document.getElementById('game-date').value
    };

    fetch('/api/games', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(game)
    })
    .then(res => res.json())
    .then(() => {
        alert('Game added!');
        loadGames();
    });
}

function deleteGame(index) {
    fetch(`/api/games/${index}`, { method: 'DELETE' })
        .then(res => res.json())
        .then(() => {
            alert('Game deleted');
            loadGames();
        });
}

// --- Slideshow Image Management (placeholder) ---
function loadSlides() {
    // Placeholder for slideshow load
    // Fetch and render slides
    // Add edit/delete buttons for slides
}

// --- Admin Login Button Logic ---
function handleAdminClick() {
    window.location.href = 'login.html';
}

// --- Logout Functionality ---
function setupLogoutButton() {
    const logoutBtn = document.createElement('button');
    logoutBtn.textContent = 'Logout';

    // Style for visibility
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

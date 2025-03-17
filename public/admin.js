// Load players on page load
document.addEventListener('DOMContentLoaded', loadPlayers);

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
        clearForm();
        loadPlayers();
    });
}

function deletePlayer(index) {
    fetch(`/api/players/${index}`, {
        method: 'DELETE'
    })
    .then(res => res.json())
    .then(() => {
        alert('Player deleted');
        loadPlayers();
    });
}

function editPlayer(index) {
    fetch('/api/players')
        .then(res => res.json())
        .then(players => {
            const p = players[index];
            document.getElementById('player-name').value = p.name;
            document.getElementById('player-position').value = p.position;
            document.getElementById('player-goals').value = p.goals;
            document.getElementById('player-assists').value = p.assists;
            document.getElementById('player-saves').value = p.saves;
            document.getElementById('player-image').value = p.image;

            // Change Add to Save
            const addBtn = document.querySelector('button[onclick="addPlayer()"]');
            addBtn.textContent = 'Save Changes';
            addBtn.onclick = function () { saveEditedPlayer(index); };
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
        clearForm();
        const addBtn = document.querySelector('button[onclick*="saveEditedPlayer"]');
        addBtn.textContent = 'Add Player';
        addBtn.setAttribute('onclick', 'addPlayer()');
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

function clearForm() {
    document.getElementById('player-name').value = '';
    document.getElementById('player-position').value = '';
    document.getElementById('player-goals').value = '';
    document.getElementById('player-assists').value = '';
    document.getElementById('player-saves').value = '';
    document.getElementById('player-image').value = '';
}

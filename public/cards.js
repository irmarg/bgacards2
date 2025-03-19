console.log("cards.js loaded");

document.addEventListener('DOMContentLoaded', () => {
    fetchPlayers();
    setupFilter();
});

function fetchPlayers() {
    fetch('/api/players')
        .then(res => res.json())
        .then(players => {
            renderPlayers(players);
        });
}

function renderPlayers(players) {
    const container = document.getElementById('player-cards');
    container.innerHTML = '';

    players.forEach(player => {
        const card = document.createElement('div');
        card.className = 'player-card';
        card.innerHTML = `
            <img src="${player.image || 'images/default.jpg'}" alt="${player.name}" class="player-image">
            <h3>${player.name || 'Unknown'}</h3>
            <p><strong>Nickname:</strong> ${player.nickname || 'N/A'}</p>
            <p><strong>Position:</strong> ${player.position || 'N/A'}</p>
            <p><strong>Number:</strong> ${player.number || 'N/A'}</p>
            <p><strong>Goals:</strong> ${player.goals || 0}</p>
            <p><strong>Assists:</strong> ${player.assists || 0}</p>
            <p><strong>Saves:</strong> ${player.saves || 0}</p>
            <p><strong>Matches:</strong> ${player.matches || 0}</p>
        `;
        container.appendChild(card);
    });
}

function setupFilter() {
    const filter = document.getElementById('filter');
    filter.addEventListener('change', () => {
        const value = filter.value.toLowerCase();
        fetch('/api/players')
            .then(res => res.json())
            .then(players => {
                const filtered = players.filter(player => {
                    if (value === 'all') return true;
                    if (value === 'nickname') return player.nickname && player.nickname.trim() !== '';
                    return player.position && player.position.toLowerCase() === value;
                });
                renderPlayers(filtered);
            });
    });
}

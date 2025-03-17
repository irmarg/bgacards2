document.addEventListener('DOMContentLoaded', () => {
    fetch('/api/players')
        .then(res => res.json())
        .then(players => renderPlayers(players));

    document.getElementById('players').addEventListener('change', e => {
        const value = e.target.value;
        fetch('/api/players')
            .then(res => res.json())
            .then(players => {
                const filtered = players.filter(p => {
                    if (value === 'all') return true;
                    if (value === 'nickname') return p.nickname; 
                    return p.position.toLowerCase() === value;
                });
                renderPlayers(filtered);
            });
    });
});

function renderPlayers(players) {
    const container = document.getElementById('player-cards');
    container.innerHTML = '';
    players.forEach(p => {
        const card = document.createElement('div');
        card.classList.add('player-card');
        card.innerHTML = `
            <img src="${p.image}" alt="${p.name}" />
            <h3>${p.name}</h3>
            <p>Position: ${p.position}</p>
            <p>Goals: ${p.goals}, Assists: ${p.assists}, Saves: ${p.saves}</p>
        `;
        card.addEventListener('click', () => showModal(p));
        container.appendChild(card);
    });
}

function showModal(player) {
    document.getElementById('player-modal').style.display = 'block';
    document.getElementById('player-image').src = player.image;
    document.getElementById('player-name').textContent = player.name;
    document.getElementById('player-goals').textContent = `Goals: ${player.goals}`;
    document.getElementById('player-assists').textContent = `Assists: ${player.assists}`;
    document.getElementById('player-matches').textContent = `Saves: ${player.saves}`;
    renderChart(player);
}

function renderChart(player) {
    const ctx = document.getElementById('playerStats').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Goals', 'Assists', 'Saves'],
            datasets: [{
                label: player.name,
                data: [player.goals, player.assists, player.saves]
            }]
        }
    });
}

document.querySelector('.close').addEventListener('click', () => {
    document.getElementById('player-modal').style.display = 'none';
});

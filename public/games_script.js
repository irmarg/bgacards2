document.getElementById('search-button').addEventListener('click', () => {
    const filter = document.getElementById('filter-select').value;
    const query = document.getElementById('search-input').value.toLowerCase();
    const fromDate = document.getElementById('from-date').value;
    const toDate = document.getElementById('to-date').value;

    fetch('/api/games')
        .then(res => res.json())
        .then(games => {
            let filtered = games;
            if (filter === 'team') {
                filtered = games.filter(g => g.team1.toLowerCase().includes(query) || g.team2.toLowerCase().includes(query));
            } else if (filter === 'date') {
                filtered = games.filter(g => g.date === query);
            }
            if (fromDate && toDate) {
                filtered = filtered.filter(g => g.date >= fromDate && g.date <= toDate);
            }
            renderGames(filtered);
        });
});

function renderGames(games) {
    const container = document.getElementById('game-results');
    container.innerHTML = '';
    games.forEach(g => {
        const card = document.createElement('div');
        card.classList.add('game-card');
        card.innerHTML = `
            <h3>${g.team1} vs ${g.team2}</h3>
            <p>Score: ${g.score}</p>
            <p>Date: ${g.date}</p>
        `;
        container.appendChild(card);
    });
}

// Landing page script for Cloud Team

document.addEventListener('DOMContentLoaded', () => {
    const startButton = document.getElementById('start-game');
    const topScoresElement = document.getElementById('top-scores');

    startButton.addEventListener('click', () => {
        window.location.href = 'game.html';
    });

    function loadTopScores() {
        const savedScores = localStorage.getItem('cloudTeamTopScores');
        if (savedScores) {
            const topScores = JSON.parse(savedScores);
            updateScoreboard(topScores);
        }
    }

    function updateScoreboard(topScores) {
        topScoresElement.innerHTML = '';
        topScores.forEach((score, index) => {
            const li = document.createElement('li');
            li.textContent = `${score.name}: ${score.score}`;
            li.className = 'mb-2';
            topScoresElement.appendChild(li);
        });
    }

    loadTopScores();
});
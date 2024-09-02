// Landing page script for Cloud Team Multiplayer

const socket = io();

document.addEventListener('DOMContentLoaded', () => {
    const joinButton = document.getElementById('join-game');
    const startButton = document.getElementById('start-game');
    const playerNameInput = document.getElementById('player-name');
    const playerForm = document.getElementById('player-form');
    const waitingRoom = document.getElementById('waiting-room');
    const playerList = document.getElementById('player-list');
    const topScoresElement = document.getElementById('top-scores');

    let players = [];

    joinButton.addEventListener('click', () => {
        const playerName = playerNameInput.value.trim();
        if (playerName) {
            socket.emit('player_join', playerName);
            playerForm.classList.add('hidden');
            waitingRoom.classList.remove('hidden');
        }
    });

    startButton.addEventListener('click', () => {
        socket.emit('start_game');
    });

    socket.on('players_update', (updatedPlayers) => {
        players = updatedPlayers;
        updatePlayerList();
    });

    socket.on('game_starting', () => {
        window.location.href = 'game.html';
    });

    socket.on('host_status', (isHost) => {
        startButton.classList.toggle('hidden', !isHost);
    });

    function updatePlayerList() {
        playerList.innerHTML = '';
        players.forEach(player => {
            const li = document.createElement('li');
            li.textContent = player.name;
            playerList.appendChild(li);
        });
    }

    function loadTopScores() {
        const savedScores = localStorage.getItem('cloudTeamTopScores');
        if (savedScores) {
            const topScores = JSON.parse(savedScores);
            updateScoreboard(topScores);
        }
    }

    function updateScoreboard(topScores) {
        topScoresElement.innerHTML = '';
        topScores.slice(0, 5).forEach((score, index) => {
            const li = document.createElement('li');
            li.textContent = `${score.name}: ${score.score}`;
            li.className = 'mb-2';
            topScoresElement.appendChild(li);
        });
    }

    loadTopScores();
});
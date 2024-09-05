// Landing page script for Cloud Team Multiplayer

const socket = io();

// Add debug flag
const DEBUG = true;

// Add debug logging function
function debugLog(message) {
    if (DEBUG) {
        console.log(`[DEBUG] ${message}`);
    }
}

// Add connection logging
socket.on('connect', () => {
    debugLog('Connected to server');
});

socket.on('connect_error', (error) => {
    debugLog(`Connection error: ${error}`);
});

document.addEventListener('DOMContentLoaded', () => {
    debugLog("DOM content loaded. Initializing landing page...");
    
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
            debugLog(`Player joining: ${playerName}`);
            socket.emit('player_join', playerName);
            playerForm.classList.add('hidden');
            waitingRoom.classList.remove('hidden');
        }
    });

    startButton.addEventListener('click', () => {
        debugLog("Start game button clicked");
        socket.emit('start_game');
    });

    socket.on('players_update', (updatedPlayers) => {
        debugLog(`Received players update: ${JSON.stringify(updatedPlayers)}`);
        players = updatedPlayers;
        updatePlayerList();
    });

    socket.on('game_starting', () => {
        debugLog("Game starting, redirecting to game.html");
        window.location.href = 'game.html';
    });

    socket.on('host_status', (isHost) => {
        debugLog(`Received host status: ${isHost}`);
        startButton.classList.toggle('hidden', !isHost);
    });

    function updatePlayerList() {
        debugLog("Updating player list");
        playerList.innerHTML = '';
        players.forEach(player => {
            const li = document.createElement('li');
            li.textContent = player.name;
            playerList.appendChild(li);
        });
    }

    function loadTopScores() {
        debugLog("Loading top scores");
        const savedScores = localStorage.getItem('cloudTeamTopScores');
        if (savedScores) {
            const topScores = JSON.parse(savedScores);
            updateScoreboard(topScores);
        }
    }

    function updateScoreboard(topScores) {
        debugLog("Updating scoreboard");
        topScoresElement.innerHTML = '';
        topScores.slice(0, 5).forEach((score, index) => {
            const li = document.createElement('li');
            li.textContent = `${score.name}: ${score.score}`;
            li.className = 'mb-2';
            topScoresElement.appendChild(li);
        });
    }

    loadTopScores();
    debugLog("Landing page initialized");
});
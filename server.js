const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
const { createStore } = require('redux');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const PORT = process.env.PORT || 3000;

// Add debug flag
const DEBUG = true;

// Add debug logging function
function debugLog(message) {
    if (DEBUG) {
        console.log(`[DEBUG] ${message}`);
    }
}

// Log server setup information
debugLog(`Express version: ${require('express/package.json').version}`);
debugLog(`Node.js version: ${process.version}`);
debugLog(`Current working directory: ${process.cwd()}`);

app.use(express.static(path.join(__dirname, '.')));

// Log middleware setup
debugLog(`Static file serving middleware set up for directory: ${path.join(__dirname, '.')}`);

// Game state
let players = [];
let gameInProgress = false;

io.on('connection', (socket) => {
    debugLog(`New connection: ${socket.id}`);

    socket.on('player_join', (playerName) => {
        debugLog(`Player joined: ${playerName}`);
        const player = { id: socket.id, name: playerName, score: 0 };
        players.push(player);
        socket.emit('host_status', players.length === 1);
        io.emit('players_update', players);
    });

    socket.on('start_game', () => {
        debugLog('Game starting');
        gameInProgress = true;
        io.emit('game_starting');
    });

    socket.on('disconnect', () => {
        debugLog(`Player disconnected: ${socket.id}`);
        players = players.filter(player => player.id !== socket.id);
        io.emit('players_update', players);
        if (players.length === 0) {
            gameInProgress = false;
        }
    });
});

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    debugLog(`Server is listening on http://localhost:${PORT}`);
});

// Error handling
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
});
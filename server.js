const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, '.')));

const players = new Map();
const MAX_PLAYERS = 4;
let gameInProgress = false;
let hostId = null;

io.on('connection', (socket) => {
  console.log('New player connected:', socket.id);

  socket.on('player_join', (playerName) => {
    if (players.size >= MAX_PLAYERS || gameInProgress) {
      socket.emit('game_full');
      return;
    }

    players.set(socket.id, {
      id: socket.id,
      name: playerName,
      score: 0,
      ready: false
    });

    if (players.size === 1) {
      hostId = socket.id;
      socket.emit('host_status', true);
    }

    io.emit('players_update', Array.from(players.values()));
  });

  socket.on('start_game', () => {
    if (socket.id === hostId && players.size >= 1) {
      gameInProgress = true;
      io.emit('game_starting');
    }
  });

  socket.on('player_ready', () => {
    const player = players.get(socket.id);
    if (player) {
      player.ready = true;
      if (Array.from(players.values()).every(p => p.ready)) {
        io.emit('round_start');
      }
    }
  });

  socket.on('update_score', (data) => {
    const player = players.get(data.playerId);
    if (player) {
      player.score = data.score;
      io.emit('update_scores', Array.from(players.values()));
    }
  });

  socket.on('round_end', (data) => {
    const player = players.get(data.playerId);
    if (player) {
      player.score = data.score;
      player.ready = false;
    }

    if (Array.from(players.values()).every(p => !p.ready)) {
      const results = Array.from(players.values())
        .sort((a, b) => b.score - a.score)
        .map((p, index) => ({ ...p, position: index + 1 }));
      
      io.emit('end_round', results);
      gameInProgress = false;
    }
  });

  socket.on('disconnect', () => {
    console.log('Player disconnected:', socket.id);
    players.delete(socket.id);
    io.emit('player_disconnected', socket.id);

    if (socket.id === hostId && players.size > 0) {
      hostId = players.keys().next().value;
      io.to(hostId).emit('host_status', true);
    }

    if (players.size === 0) {
      gameInProgress = false;
    }
  });
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
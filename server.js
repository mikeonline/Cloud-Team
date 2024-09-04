const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
const { createStore } = require('redux');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, '.')));

// Redux setup
const initialState = {
    players: {},
    gameInProgress: false,
    hostId: null,
    roundTimer: 120,
    taskTimer: 10,
    currentTask: null,
    MAX_PLAYERS: 4,
    MAX_LIVES: 3
};

function gameReducer(state = initialState, action) {
    switch (action.type) {
        case 'PLAYER_JOIN':
            if (Object.keys(state.players).length >= state.MAX_PLAYERS || state.gameInProgress) {
                return state;
            }
            return {
                ...state,
                players: {
                    ...state.players,
                    [action.payload.id]: {
                        id: action.payload.id,
                        name: action.payload.name,
                        score: 0,
                        ready: false,
                        lives: state.MAX_LIVES
                    }
                },
                hostId: state.hostId || action.payload.id
            };
        case 'PLAYER_DISCONNECT':
            const { [action.payload]: removedPlayer, ...remainingPlayers } = state.players;
            return {
                ...state,
                players: remainingPlayers,
                hostId: state.hostId === action.payload ? (Object.keys(remainingPlayers)[0] || null) : state.hostId,
                gameInProgress: Object.keys(remainingPlayers).length > 0 ? state.gameInProgress : false
            };
        case 'START_GAME':
            return {
                ...state,
                gameInProgress: true,
                roundTimer: 120,
                taskTimer: 10
            };
        case 'PLAYER_READY':
            return {
                ...state,
                players: {
                    ...state.players,
                    [action.payload]: {
                        ...state.players[action.payload],
                        ready: true
                    }
                }
            };
        case 'TASK_COMPLETED':
            const points = calculateScore(action.payload.timeTaken);
            return {
                ...state,
                players: {
                    ...state.players,
                    [action.payload.playerId]: {
                        ...state.players[action.payload.playerId],
                        score: state.players[action.payload.playerId].score + points
                    }
                },
                currentTask: null
            };
        case 'SET_NEW_TASK':
            return {
                ...state,
                currentTask: action.payload,
                taskTimer: 10
            };
        case 'UPDATE_TIMERS':
            return {
                ...state,
                roundTimer: state.roundTimer - 1,
                taskTimer: state.taskTimer - 1
            };
        case 'LOSE_LIFE':
            return {
                ...state,
                players: {
                    ...state.players,
                    [action.payload]: {
                        ...state.players[action.payload],
                        lives: state.players[action.payload].lives - 1
                    }
                }
            };
        case 'END_ROUND':
            return {
                ...state,
                gameInProgress: false,
                players: Object.fromEntries(
                    Object.entries(state.players).map(([id, player]) => [id, { ...player, ready: false }])
                )
            };
        default:
            return state;
    }
}

const store = createStore(gameReducer);

function calculateScore(timeTaken) {
    const maxPoints = 100;
    const minPoints = 10;
    const maxTime = 10; // Maximum time to complete a task for minimum points
    return Math.max(minPoints, Math.floor(maxPoints - (timeTaken / maxTime) * (maxPoints - minPoints)));
}

function getTopScores() {
    const players = Object.values(store.getState().players);
    return players
        .sort((a, b) => b.score - a.score)
        .slice(0, 10)
        .map((p, index) => ({ name: p.name, score: p.score, rank: index + 1 }));
}

function generateTasks(players) {
    // This is a placeholder. In a real implementation, you would generate tasks based on the current game state.
    return {
        instruction: "Sample task instruction",
        action: () => true, // This would be a function to check if the task is completed
        isValid: () => true // This would be a function to check if the task is still valid
    };
}

io.on('connection', (socket) => {
    console.log('New player connected:', socket.id);

    socket.on('player_join', (playerName) => {
        store.dispatch({ type: 'PLAYER_JOIN', payload: { id: socket.id, name: playerName } });
        const state = store.getState();
        if (Object.keys(state.players).length >= state.MAX_PLAYERS || state.gameInProgress) {
            socket.emit('game_full');
            return;
        }
        if (state.hostId === socket.id) {
            socket.emit('host_status', true);
        }
        io.emit('players_update', Object.values(state.players));
    });

    socket.on('start_game', () => {
        const state = store.getState();
        if (socket.id === state.hostId && Object.keys(state.players).length >= 1) {
            store.dispatch({ type: 'START_GAME' });
            io.emit('game_starting');
            startGameLoop();
        }
    });

    socket.on('player_ready', () => {
        store.dispatch({ type: 'PLAYER_READY', payload: socket.id });
        const state = store.getState();
        if (Object.values(state.players).every(p => p.ready)) {
            io.emit('round_start');
        }
    });

    socket.on('task_completed', (data) => {
        store.dispatch({ type: 'TASK_COMPLETED', payload: { playerId: socket.id, timeTaken: data.timeTaken } });
        const state = store.getState();
        socket.emit('update_score', state.players[socket.id].score);
        io.emit('update_scores', Object.values(state.players));
        setNewTask();
    });

    socket.on('disconnect', () => {
        console.log('Player disconnected:', socket.id);
        store.dispatch({ type: 'PLAYER_DISCONNECT', payload: socket.id });
        const state = store.getState();
        io.emit('player_disconnected', socket.id);
        if (state.hostId === socket.id && Object.keys(state.players).length > 0) {
            const newHostId = Object.keys(state.players)[0];
            io.to(newHostId).emit('host_status', true);
        }
    });
});

function startGameLoop() {
    const gameInterval = setInterval(() => {
        store.dispatch({ type: 'UPDATE_TIMERS' });
        const state = store.getState();
        
        if (state.roundTimer <= 0 || Object.values(state.players).every(p => p.lives <= 0)) {
            clearInterval(gameInterval);
            endRound();
        } else {
            if (state.taskTimer <= 0) {
                Object.keys(state.players).forEach(playerId => {
                    store.dispatch({ type: 'LOSE_LIFE', payload: playerId });
                });
                setNewTask();
            }
            io.emit('update_game_state', {
                roundTimer: state.roundTimer,
                taskTimer: state.taskTimer,
                currentTask: state.currentTask,
                players: state.players
            });
        }
    }, 1000);
}

function setNewTask() {
    const state = store.getState();
    const newTask = generateTasks(state.players);
    store.dispatch({ type: 'SET_NEW_TASK', payload: newTask });
    io.emit('new_task', newTask);
}

function endRound() {
    store.dispatch({ type: 'END_ROUND' });
    const state = store.getState();
    const topScores = getTopScores();
    Object.entries(state.players).forEach(([playerId, player]) => {
        const playerPosition = topScores.findIndex(s => s.name === player.name) + 1;
        io.to(playerId).emit('end_round', {
            score: player.score,
            playerPosition: playerPosition,
            topScores: topScores
        });
    });
}

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
console.log("Game.js is loading...");

const socket = io();

const controlPanel = document.getElementById('control-panel');
const instructionElement = document.getElementById('instruction');
const scoreElement = document.getElementById('score');
const timerElement = document.getElementById('timer');
const topScoresElement = document.getElementById('top-scores');
const livesElement = document.getElementById('lives');
const gameContainer = document.getElementById('game-container');
const countdownProgressLeftElement = document.getElementById('countdown-progress-left');
const countdownProgressRightElement = document.getElementById('countdown-progress-right');
const playersListElement = document.getElementById('players');
const tickerPanel = document.getElementById('ticker-panel');

let playerId;
let gameState = {};
let controlListeners = [];

const allControls = [
    {
        id: 'database-slider',
        type: 'slider',
        label: 'Database Load',
        min: 0,
        max: 100,
        value: 50
    },
    {
        id: 'network-button',
        type: 'button',
        label: 'Optimize Network',
        text: 'Optimize'
    },
    {
        id: 'security-toggle',
        type: 'toggle',
        label: 'Security Firewall'
    },
    {
        id: 'cache-slider',
        type: 'slider',
        label: 'Cache Level',
        min: 0,
        max: 100,
        value: 50
    },
    {
        id: 'api-dropdown',
        type: 'dropdown',
        label: 'API Version',
        options: ['v1', 'v2', 'v3']
    },
    {
        id: 'backup-button',
        type: 'button',
        label: 'Backup Data',
        text: 'Backup'
    },
    {
        id: 'scaling-toggle',
        type: 'toggle',
        label: 'Auto-scaling'
    },
    {
        id: 'cpu-slider',
        type: 'slider',
        label: 'CPU Usage',
        min: 0,
        max: 100,
        value: 50
    },
    {
        id: 'memory-slider',
        type: 'slider',
        label: 'Memory Usage',
        min: 0,
        max: 100,
        value: 50
    },
    {
        id: 'firewall-dropdown',
        type: 'dropdown',
        label: 'Firewall Mode',
        options: ['Permissive', 'Moderate', 'Strict']
    },
    {
        id: 'encryption-toggle',
        type: 'toggle',
        label: 'Data Encryption'
    },
    {
        id: 'load-balancer-toggle',
        type: 'toggle',
        label: 'Load Balancer'
    }
];

function createControl(control) {
    console.log(`Creating control: ${control.id}`);
    const controlDiv = document.createElement('div');
    controlDiv.className = 'control';
    controlDiv.innerHTML = `<label for="${control.id}" class="block mb-2">${control.label}:</label>`;

    let inputElement;
    switch (control.type) {
        case 'slider':
            inputElement = `<input type="range" step="5" id="${control.id}" min="${control.min}" max="${control.max}" value="${control.value}" step="5" class="w-full">
                            <span id="${control.id}-level" class="level-display block text-center mt-2">${control.value}%</span>`;
            break;
        case 'button':
            inputElement = `<button id="${control.id}" class="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">${control.text}</button>`;
            break;
        case 'toggle':
            inputElement = `<div class="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
                                <input type="checkbox" id="${control.id}" class="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"/>
                                <label for="${control.id}" class="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"></label>
                            </div>
                            <span class="toggle-status ml-2">Off</span>`;
            break;
        case 'dropdown':
            inputElement = `<select id="${control.id}" class="w-full bg-gray-700 border border-gray-600 text-white rounded px-3 py-2">
                                ${control.options.map(option => `<option value="${option}">${option}</option>`).join('')}
                            </select>`;
            break;
    }

    controlDiv.innerHTML += inputElement;
    return controlDiv;
}

function selectRandomControls(count) {
    const shuffled = allControls.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
}

function setupControls() {
    console.log("Setting up controls...");
    if (!controlPanel) {
        console.error("Control panel element not found!");
        return;
    }
    controlPanel.innerHTML = '';
    const currentControls = selectRandomControls(7);
    currentControls.forEach(control => {
        const controlElement = createControl(control);
        controlPanel.appendChild(controlElement);
        if (control.type === 'slider') {
            const slider = controlElement.querySelector(`#${control.id}`);
            const level = controlElement.querySelector(`#${control.id}-level`);
            const sliderListener = () => {
                updateSliderLevel(slider, level);
                checkTask();
            };
            slider.addEventListener('input', sliderListener);
            controlListeners.push({ element: slider, type: 'input', listener: sliderListener });
        } else if (control.type === 'button') {
            const button = controlElement.querySelector(`#${control.id}`);
            const buttonListener = () => {
                button.clicked = true;
                checkTask();
                setTimeout(() => { button.clicked = false; }, 1000);
            };
            button.addEventListener('click', buttonListener);
            controlListeners.push({ element: button, type: 'click', listener: buttonListener });
        } else if (control.type === 'toggle') {
            const toggle = controlElement.querySelector(`#${control.id}`);
            const toggleListener = () => {
                updateToggleStatus(toggle);
                checkTask();
            };
            toggle.addEventListener('change', toggleListener);
            controlListeners.push({ element: toggle, type: 'change', listener: toggleListener });
        } else if (control.type === 'dropdown') {
            const dropdown = controlElement.querySelector(`#${control.id}`);
            const dropdownListener = checkTask;
            dropdown.addEventListener('change', dropdownListener);
            controlListeners.push({ element: dropdown, type: 'change', listener: dropdownListener });
        }
    });
    console.log("Controls set up complete.");
}

function updateSliderLevel(slider, levelElement) {
    const roundedValue = Math.round(slider.value / 5) * 5;
    slider.value = roundedValue;
    levelElement.textContent = roundedValue + '%';
}

function updateToggleStatus(toggle) {
    const statusElement = toggle.closest('.control').querySelector('.toggle-status');
    statusElement.textContent = toggle.checked ? 'On' : 'Off';
}

function checkTask() {
    if (gameState.currentTask && gameState.currentTask.action()) {
        const timeTaken = (Date.now() - gameState.taskStartTime) / 1000; // Convert to seconds
        socket.emit('task_completed', { timeTaken });
    }
}

function updateInstructionDisplay(text) {
    instructionElement.style.animation = 'none';
    instructionElement.offsetHeight; // Trigger reflow
    instructionElement.textContent = text;
    instructionElement.style.animation = '';
}

function updateTimerDisplay(roundTimer, taskTimer) {
    const minutes = Math.floor(roundTimer / 60);
    const seconds = roundTimer % 60;
    timerElement.textContent = `Time: ${minutes}:${seconds.toString().padStart(2, '0')}`;
    updateCountdownTimer(taskTimer);
}

function updateCountdownTimer(taskTimer) {
    const progress = (taskTimer / 10) * 100;
    countdownProgressLeftElement.style.height = `${progress}%`;
    countdownProgressRightElement.style.height = `${progress}%`;
    const color = progress <= 30 ? '#ef4444' : '#48bb78';
    countdownProgressLeftElement.style.backgroundColor = color;
    countdownProgressRightElement.style.backgroundColor = color;
}

function updateLivesDisplay(lives) {
    livesElement.textContent = `Lives: ${lives}`;
}

function updatePlayersList(players) {
    playersListElement.innerHTML = '';
    Object.values(players).forEach(player => {
        const li = document.createElement('li');
        li.textContent = `${player.name}: ${player.score}`;
        if (player.id === playerId) {
            li.classList.add('font-bold');
        }
        playersListElement.appendChild(li);
    });
}

function shakeScreen() {
    gameContainer.classList.add('shake');
    setTimeout(() => {
        gameContainer.classList.remove('shake');
    }, 500);
}

function scrambleMatrixText() {
    const canvas = document.getElementById('matrix-bg');
    const ctx = canvas.getContext('2d');
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%^&*()_+-=[]{}|;:,.<>?';
    
    function scramble() {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = '#0F0';
        ctx.font = '15px EpsonMxSeries';

        for (let i = 0; i < canvas.width; i += 20) {
            for (let j = 0; j < canvas.height; j += 20) {
                const char = characters[Math.floor(Math.random() * characters.length)];
                ctx.fillText(char, i, j);
            }
        }
    }

    let scrambleCount = 0;
    const scrambleInterval = setInterval(() => {
        scramble();
        scrambleCount++;
        if (scrambleCount >= 10) {
            clearInterval(scrambleInterval);
        }
    }, 50);
}

function pulseRed() {
    const overlay = document.createElement('div');
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.backgroundColor = 'rgba(255, 0, 0, 0.3)';
    overlay.style.animation = 'pulse-red 0.5s ease-in-out';
    overlay.style.pointerEvents = 'none';
    document.body.appendChild(overlay);

    setTimeout(() => {
        document.body.removeChild(overlay);
    }, 500);
}

function showGameOverScreen(data) {
    const { score, playerPosition, topScores } = data;
    const visibleScores = 7;
    const startIndex = Math.max(0, Math.min(playerPosition - Math.ceil(visibleScores / 2), topScores.length - visibleScores));
    const endIndex = Math.min(startIndex + visibleScores, topScores.length);

    gameContainer.innerHTML = `
        <div class="game-over-screen bg-gray-800 bg-opacity-90 p-8 rounded-lg shadow-lg max-w-4xl w-full relative z-10">
            <h1 class="text-4xl font-bold text-center mb-6 text-blue-400">Game Over</h1>
            <p class="text-2xl text-center mb-4">Your Score: ${score}</p>
            <p class="text-xl text-center mb-6">Your Position: ${playerPosition}</p>
            <div class="leaderboard-container mb-6">
                <table class="w-full text-left">
                    <thead>
                        <tr>
                            <th class="px-4 py-2">Rank</th>
                            <th class="px-4 py-2">Name</th>
                            <th class="px-4 py-2">Score</th>
                        </tr>
                    </thead>
                    <tbody id="leaderboard-body"></tbody>
                </table>
            </div>
            <button id="end-button" class="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">Return to Main Menu</button>
        </div>
    `;

    const leaderboardBody = document.getElementById('leaderboard-body');
    for (let i = startIndex; i < endIndex; i++) {
        const score = topScores[i];
        const row = document.createElement('tr');
        row.innerHTML = `
            <td class="px-4 py-2">${i + 1}</td>
            <td class="px-4 py-2">${score.name}</td>
            <td class="px-4 py-2">${score.score}</td>
        `;
        if (i + 1 === playerPosition) {
            row.classList.add('bg-yellow-500', 'text-black', 'font-bold');
        }
        leaderboardBody.appendChild(row);
    }

    document.getElementById('end-button').addEventListener('click', () => {
        window.location.href = 'index.html';
    });
}

function createMatrixBackground() {
    const canvas = document.getElementById('matrix-bg');
    const ctx = canvas.getContext('2d');

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%^&*()_+-=[]{}|;:,.<>?';
    const columns = canvas.width / 15;
    const drops = [];

    for (let i = 0; i < columns; i++) {
        drops[i] = 1;
    }

    function draw() {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = '#0F0';
        ctx.font = '12px EpsonMxSeries, monospace';

        for (let i = 0; i < drops.length; i++) {
            const text = characters[Math.floor(Math.random() * characters.length)];
            ctx.fillText(text, i * 15, drops[i] * 15);

            if (drops[i] * 15 > canvas.height && Math.random() > 0.975) {
                drops[i] = 0;
            }

            drops[i]++;
        }
    }

    setInterval(draw, 33);
}

document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM content loaded. Initializing game...");
    try {
        createMatrixBackground();
        
        const style = document.createElement('style');
        style.textContent = `
            @keyframes pulse-red {
                0% { opacity: 0; }
                50% { opacity: 1; }
                100% { opacity: 0; }
            }
        `;
        document.head.appendChild(style);

        socket.on('connect', () => {
            console.log('Connected to server');
            playerId = socket.id;
        });

        socket.on('players_update', (players) => {
            updatePlayersList(players);
        });

        socket.on('game_starting', () => {
            setupControls();
            updateInstructionDisplay("Get ready! Game is starting...");
        });

        socket.on('round_start', () => {
            updateInstructionDisplay("Round started! Complete the tasks!");
        });

        socket.on('update_score', (score) => {
            scoreElement.textContent = score;
        });

        socket.on('update_game_state', (state) => {
            gameState = state;
            updateTimerDisplay(state.roundTimer, state.taskTimer);
            updateLivesDisplay(state.players[playerId].lives);
            updatePlayersList(state.players);
            if (state.currentTask) {
                updateInstructionDisplay(state.currentTask.instruction);
            }
        });

        socket.on('new_task', (task) => {
            gameState.currentTask = task;
            gameState.taskStartTime = Date.now();
            updateInstructionDisplay(task.instruction);
        });

        socket.on('end_round', (data) => {
            showGameOverScreen(data);
        });

        socket.on('player_disconnected', (id) => {
            if (gameState.players) {
                delete gameState.players[id];
                updatePlayersList(gameState.players);
            }
        });

    } catch (error) {
        console.error("Error initializing game:", error);
    }
});

console.log("Game.js loaded successfully.");
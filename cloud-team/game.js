console.log("Game.js is loading...");

const controlPanel = document.getElementById('control-panel');
const instructionElement = document.getElementById('instruction');
const scoreElement = document.getElementById('score');
const timerElement = document.getElementById('timer');
const topScoresElement = document.getElementById('top-scores');
const livesElement = document.getElementById('lives');
const gameContainer = document.getElementById('game-container');
const countdownProgressElement = document.getElementById('countdown-progress');

// Non-player editable setting for the number of lives
const MAX_LIVES = 3;

let score = 0;
let lives = MAX_LIVES;
let currentTask = null;
let roundTimer = 120; // 2 minutes in seconds
let taskStartTime = 0;
let taskTimer = 10; // 10 seconds per task
let roundInterval;
let taskInterval;
let topScores = [];
let currentControls = [];

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
    currentControls = selectRandomControls(7);
    currentControls.forEach(control => {
        const controlElement = createControl(control);
        controlPanel.appendChild(controlElement);
        if (control.type === 'slider') {
            const slider = controlElement.querySelector(`#${control.id}`);
            const level = controlElement.querySelector(`#${control.id}-level`);
            slider.addEventListener('input', () => {
                updateSliderLevel(slider, level);
                checkTask();
            });
        } else if (control.type === 'button') {
            const button = controlElement.querySelector(`#${control.id}`);
            button.addEventListener('click', () => {
                button.clicked = true;
                checkTask();
                setTimeout(() => { button.clicked = false; }, 1000);
            });
        } else if (control.type === 'toggle') {
            const toggle = controlElement.querySelector(`#${control.id}`);
            toggle.addEventListener('change', () => {
                updateToggleStatus(toggle);
                checkTask();
            });
        } else if (control.type === 'dropdown') {
            const dropdown = controlElement.querySelector(`#${control.id}`);
            dropdown.addEventListener('change', checkTask);
        }
    });
    console.log("Controls set up complete.");
}

function generateTasks() {
    return currentControls.flatMap(control => {
        switch (control.type) {
            case 'slider':
                const randomValue = Math.floor(Math.random() * 21) * 5; // Generate random multiple of 5 between 0 and 100
                return [
                    {
                        instruction: `Set ${control.label} to ${randomValue}%!`,
                        action: () => document.getElementById(control.id).value === randomValue.toString(),
                        isValid: () => document.getElementById(control.id).value !== randomValue.toString()
                    }
                ];
            case 'button':
                return [
                    {
                        instruction: `${control.label}!`,
                        action: () => document.getElementById(control.id).clicked,
                        isValid: () => true
                    }
                ];
            case 'toggle':
                return [
                    {
                        instruction: `Enable ${control.label}!`,
                        action: () => document.getElementById(control.id).checked,
                        isValid: () => !document.getElementById(control.id).checked
                    },
                    {
                        instruction: `Disable ${control.label}!`,
                        action: () => !document.getElementById(control.id).checked,
                        isValid: () => document.getElementById(control.id).checked
                    }
                ];
            case 'dropdown':
                return control.options.map(option => ({
                    instruction: `Set ${control.label} to ${option}!`,
                    action: () => document.getElementById(control.id).value === option,
                    isValid: () => document.getElementById(control.id).value !== option
                }));
        }
    });
}

function updateScore(points) {
    score += points;
    scoreElement.textContent = score;
}

function setNewTask() {
    console.log("Setting new task...");
    const tasks = generateTasks();
    let validTasks = tasks.filter(task => task.isValid());
    if (validTasks.length > 0) {
        currentTask = validTasks[Math.floor(Math.random() * validTasks.length)];
        instructionElement.textContent = currentTask.instruction;
        taskStartTime = Date.now();
        taskTimer = 10; // Reset task timer to 10 seconds
        updateCountdownTimer();
    } else {
        instructionElement.textContent = "Great job! Waiting for new tasks...";
        setTimeout(setNewTask, 2000); // Try again in 2 seconds
    }
    console.log("New task set:", currentTask.instruction);
}

function checkTask() {
    if (currentTask && currentTask.action()) {
        const timeTaken = (Date.now() - taskStartTime) / 1000; // Convert to seconds
        const maxPoints = 100;
        const minPoints = 10;
        const maxTime = 10; // Maximum time to complete a task for minimum points
        const points = Math.max(minPoints, Math.floor(maxPoints - (timeTaken / maxTime) * (maxPoints - minPoints)));
        updateScore(points);
        setNewTask();
    }
}

function updateSliderLevel(slider, levelElement) {
    const roundedValue = Math.round(slider.value / 5) * 5;
    slider.value = roundedValue;
    levelElement.textContent = roundedValue + '%';
}

function updateTimer() {
    const minutes = Math.floor(roundTimer / 60);
    const seconds = roundTimer % 60;
    timerElement.textContent = `Time: ${minutes}:${seconds.toString().padStart(2, '0')}`;
    roundTimer--;
    if (roundTimer < 0) {
        endRound();
    }
}

function updateTaskTimer() {
    taskTimer--;
    updateCountdownTimer();
    if (taskTimer < 0) {
        loseLife();
        setNewTask();
    }
}

function updateCountdownTimer() {
    const progress = (taskTimer / 10) * 100;
    countdownProgressElement.style.width = `${progress}%`;
    countdownProgressElement.style.backgroundColor = progress <= 30 ? '#ef4444' : '#48bb78';
}

function loseLife() {
    lives--;
    updateLivesDisplay();
    shakeScreen();
    scrambleMatrixText();
    pulseRed();
    if (lives <= 0) {
        endRound();
    }
}

function updateLivesDisplay() {
    livesElement.textContent = `Lives: ${lives}`;
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
        ctx.font = '15px monospace';

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

function startRound() {
    console.log("Starting new round...");
    setupControls();
    roundTimer = 120;
    score = 0;
    lives = MAX_LIVES;
    scoreElement.textContent = '0';
    updateLivesDisplay();
    setNewTask();
    roundInterval = setInterval(updateTimer, 1000);
    taskInterval = setInterval(() => {
        updateTaskTimer();
        if (!currentTask || !currentTask.isValid()) {
            setNewTask();
        }
    }, 1000);
    console.log("Round started.");
}

function endRound() {
    console.log("Ending round...");
    clearInterval(roundInterval);
    clearInterval(taskInterval);
    const playerPosition = checkHighScore(score);
    showGameOverScreen(playerPosition);
}

function checkHighScore(score) {
    const newScore = { name: "Player", score: score };
    topScores.push(newScore);
    topScores.sort((a, b) => b.score - a.score);
    const playerPosition = topScores.findIndex(s => s === newScore) + 1;
    
    if (topScores.length > 100) {
        topScores.pop();
    }
    
    saveTopScores();
    return playerPosition;
}

function showGameOverScreen(playerPosition) {
    gameContainer.innerHTML = `
        <div class="game-over-screen bg-gray-800 bg-opacity-90 p-8 rounded-lg shadow-lg max-w-4xl w-full relative z-10">
            <h1 class="text-4xl font-bold text-center mb-6 text-blue-400">Game Over</h1>
            <p class="text-2xl text-center mb-4">Your Score: ${score}</p>
            <p class="text-xl text-center mb-6">Your Position: ${playerPosition}</p>
            <div class="leaderboard-container h-64 overflow-y-auto mb-6">
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
            <button id="end-button" class="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">End</button>
        </div>
    `;

    const leaderboardBody = document.getElementById('leaderboard-body');
    topScores.forEach((score, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td class="px-4 py-2">${index + 1}</td>
            <td class="px-4 py-2">${score.name}</td>
            <td class="px-4 py-2">${score.score}</td>
        `;
        if (index + 1 === playerPosition) {
            row.classList.add('bg-yellow-500', 'text-black', 'font-bold');
        }
        leaderboardBody.appendChild(row);
    });

    // Scroll to player's position
    const leaderboardContainer = document.querySelector('.leaderboard-container');
    const playerRow = leaderboardBody.children[playerPosition - 1];
    if (playerRow) {
        leaderboardContainer.scrollTop = playerRow.offsetTop - leaderboardContainer.offsetHeight / 2;
    }

    document.getElementById('end-button').addEventListener('click', () => {
        window.location.href = 'index.html';
    });
}

function updateScoreboard() {
    if (!topScoresElement) {
        console.error("Top scores element not found!");
        return;
    }
    topScoresElement.innerHTML = '';
    topScores.slice(0, 5).forEach((score, index) => {
        const li = document.createElement('li');
        li.textContent = `${score.name}: ${score.score}`;
        li.className = 'mb-2';
        topScoresElement.appendChild(li);
    });
}

function saveTopScores() {
    localStorage.setItem('cloudTeamTopScores', JSON.stringify(topScores));
}

function loadTopScores() {
    const savedScores = localStorage.getItem('cloudTeamTopScores');
    if (savedScores) {
        topScores = JSON.parse(savedScores);
        updateScoreboard();
    }
}

function updateToggleStatus(toggle) {
    const statusElement = toggle.closest('.control').querySelector('.toggle-status');
    statusElement.textContent = toggle.checked ? 'On' : 'Off';
}

function createMatrixBackground() {
    const canvas = document.getElementById('matrix-bg');
    const ctx = canvas.getContext('2d');

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%^&*()_+-=[]{}|;:,.<>?';
    const columns = canvas.width / 20;
    const drops = [];

    for (let i = 0; i < columns; i++) {
        drops[i] = 1;
    }

    function draw() {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = '#0F0';
        ctx.font = '15px monospace';

        for (let i = 0; i < drops.length; i++) {
            const text = characters[Math.floor(Math.random() * characters.length)];
            ctx.fillText(text, i * 20, drops[i] * 20);

            if (drops[i] * 20 > canvas.height && Math.random() > 0.975) {
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
        loadTopScores();
        startRound();
        createMatrixBackground();

        // Add CSS for red pulse animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes pulse-red {
                0% { opacity: 0; }
                50% { opacity: 1; }
                100% { opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    } catch (error) {
        console.error("Error initializing game:", error);
    }
});

console.log("Game.js loaded successfully.");
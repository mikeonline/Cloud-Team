// Point popup functionality

let lastMousePosition = { x: 0, y: 0 };

// Track mouse position
document.addEventListener('mousemove', (event) => {
    lastMousePosition.x = event.clientX;
    lastMousePosition.y = event.clientY;
});

function showPointPopup(points) {
    const popup = document.createElement('div');
    popup.className = 'point-popup';
    popup.textContent = `+${points}`;
    
    // Random rotation
    const randomRotation = Math.random() * 10 - 5; // Random value between -5 and 5
    
    popup.style.setProperty('--rotation', `${randomRotation}deg`);
    
    // Position the popup at the last known mouse position
    popup.style.left = `${lastMousePosition.x}px`;
    popup.style.top = `${lastMousePosition.y}px`;
    
    document.body.appendChild(popup);
    
    // Trigger the animation
    setTimeout(() => {
        popup.style.opacity = '1';
        popup.style.animation = 'float-up 1.5s ease-out';
    }, 0);
    
    // Remove the popup after animation
    setTimeout(() => {
        document.body.removeChild(popup);
    }, 1500);
}

// Override the original updateScore function
const originalUpdateScore = window.updateScore;
window.updateScore = function(points) {
    originalUpdateScore(points);
    showPointPopup(points);
};

// Add CSS for point popup
document.addEventListener('DOMContentLoaded', () => {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes float-up {
            0% {
                transform: translateY(0) rotate(var(--rotation));
            }
            100% {
                transform: translateY(-100px) rotate(var(--rotation));
            }
        }
        .point-popup {
            position: fixed;
            font-family: 'JetBrains Mono Extra Bold', cursive;
            font-size: 1.5rem;
            color: #4CAF50;
            pointer-events: none;
            opacity: 0;
            transition: opacity 0.5s ease-out;
            text-shadow: 0 0 5px rgba(76, 175, 80, 0.5);
            z-index: 9999;
        }
    `;
    document.head.appendChild(style);
});
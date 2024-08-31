// Point popup functionality

function showPointPopup(points) {
    const popup = document.createElement('div');
    popup.className = 'point-popup';
    popup.textContent = `+${points}`;
    
    // Random horizontal position
    const randomX = Math.random() * 40 - 20; // Random value between -20 and 20
    
    // Random rotation
    const randomRotation = Math.random() * 10 - 5; // Random value between -5 and 5
    
    popup.style.setProperty('--rotation', `${randomRotation}deg`);
    
    // Position the popup near the last interacted control
    const controlPanel = document.getElementById('control-panel');
    const lastControl = document.activeElement.closest('.control') || controlPanel.lastElementChild;
    const rect = lastControl.getBoundingClientRect();
    
    popup.style.left = `${rect.left + rect.width / 2 + randomX}px`;
    popup.style.top = `${rect.top}px`;
    
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
            position: absolute;
            font-family: 'JetBrains Mono Extra Bold', cursive;
            font-size: 1.5rem;
            color: #4CAF50;
            pointer-events: none;
            opacity: 0;
            transition: opacity 0.5s ease-out;
        }
    `;
    document.head.appendChild(style);
});
# Cloud Team Multiplayer

Cloud Team is an interactive web-based multiplayer game where players manage virtual cloud infrastructure and compete against each other for the highest score.

## Project Structure

```
cloud-team/
├── Assets/
│   ├── EpsonMxSeriesDmp-ZVRG8.ttf
│   ├── JetBrainsMono-ExtraBold.ttf
│   ├── JetBrainsMono-ExtraBoldItalic.ttf
│   ├── JetBrainsMonoNL-Regular.ttf
│   └── Rastamanoblique-xner.ttf
├── game.html
├── game.js
├── index.html
├── landing.js
├── pointPopup.js
├── server.js
├── styles.css
├── package.json
└── README.md
```

## Description

Cloud Team is a multiplayer web-based game that simulates managing cloud infrastructure. Players are presented with various challenges and must make decisions to optimize their virtual cloud environment. The game features a scoring system, a timer, and real-time multiplayer functionality to add excitement and challenge.

## Features

- Multiplayer gameplay with support for up to 4 players
- Interactive landing page with player joining and waiting room
- Dynamic game interface with real-time updates
- Scoring system and lives counter
- Timed gameplay with visual countdown
- Responsive design using Tailwind CSS
- Server-side game logic using Node.js and Socket.io

## How to Run

1. Clone the repository to your local machine.
2. Install Node.js if you haven't already (https://nodejs.org/).
3. Open a terminal and navigate to the project directory.
4. Run `npm install` to install the required dependencies.
5. Start the server by running `node server.js`.
6. Open a web browser and go to `http://localhost:3000` to play the game.
7. Share the URL with other players to join the game (make sure they're on the same network or use a service like ngrok for remote play).

## Dependencies

- [Node.js](https://nodejs.org/)
- [Express](https://expressjs.com/)
- [Socket.io](https://socket.io/)
- [Tailwind CSS](https://tailwindcss.com/) (loaded via CDN)
- [JetBrains Mono](https://fonts.google.com/specimen/JetBrains+Mono) font (loaded via Google Fonts)

## Files

- `index.html`: The landing page of the game
- `game.html`: The main game interface
- `game.js`: Contains the game logic and client-side Socket.io implementation
- `landing.js`: Handles the functionality of the landing page and waiting room
- `pointPopup.js`: Manages the point popup animations
- `server.js`: Node.js server that handles game logic and Socket.io events
- `styles.css`: Custom styles for the game

## How to Play

1. Enter your name and join the game from the landing page.
2. Wait for other players to join (minimum 2 players, maximum 4 players).
3. The host (first player to join) can start the game when ready.
4. Manage your virtual cloud infrastructure by completing tasks quickly and accurately.
5. Compete against other players to achieve the highest score.
6. The game ends after a set time, and final scores are displayed.

## Contributing

Contributions to Cloud Team Multiplayer are welcome! Please feel free to submit a Pull Request.

## Future Improvements

- Add more varied and complex tasks
- Implement different difficulty levels
- Create a persistent leaderboard
- Add power-ups or special events during gameplay
- Improve graphics and animations

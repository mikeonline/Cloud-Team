# Cloud Team

Cloud Team is an interactive web-based game where players manage virtual cloud infrastructure and compete for the highest score. The project has been migrated to Angular for improved performance and maintainability.

## Project Structure

```
cloud-team-angular/
├── src/
│   ├── app/
│   │   ├── control-panel/
│   │   ├── game/
│   │   ├── message-panel/
│   │   ├── observation-lounge/
│   │   ├── player-registration/
│   │   ├── score-panel/
│   │   ├── services/
│   │   ├── timer/
│   │   ├── app.component.ts
│   │   ├── app.module.ts
│   │   └── app.routes.ts
│   ├── assets/
│   ├── index.html
│   └── main.ts
├── angular.json
├── package.json
├── tsconfig.json
└── README.md
```

## Description

Cloud Team is a web-based game that simulates managing cloud infrastructure. Players are presented with various challenges and must make decisions to optimize their virtual cloud environment. The game features a scoring system and a timer to add excitement and challenge. The project has been migrated to Angular to leverage its powerful features and improve overall performance.

## Features

- Interactive landing page with high scores
- Dynamic game interface with real-time updates
- Scoring system and lives counter
- Timed gameplay with visual countdown
- Responsive design using Angular and SCSS
- Modular architecture with separate components for different game elements

## Future Plans

- Reintegration of multiplayer functionality (previously removed, to be added as a priority)
- Further optimization of Angular components and services
- Enhanced user interface and experience leveraging Angular's capabilities

## How to Run

1. Clone the repository to your local machine.
2. Navigate to the project directory.
3. Run `npm install` to install dependencies.
4. Run `ng serve` to start the development server.
5. Open a web browser and navigate to `http://localhost:4200`.

## Dependencies

- [Angular](https://angular.io/) (version specified in package.json)
- [RxJS](https://rxjs.dev/) for reactive programming
- Other dependencies as listed in package.json

## Key Files and Components

- `src/app/app.component.ts`: The root component of the application
- `src/app/game/game.component.ts`: Contains the main game logic
- `src/app/services/`: Directory containing various services (timer, player, etc.)
- `src/app/timer/timer.component.ts`: Manages the game timer functionality
- `src/app/control-panel/control-panel.component.ts`: Handles game controls
- `src/app/score-panel/score-panel.component.ts`: Manages score display and updates

## Contributing

Contributions to Cloud Team are welcome! Please feel free to submit a Pull Request.

## Recent Changes

- Migrated the entire project from vanilla JavaScript to Angular framework
- Restructured the codebase into modular components and services
- Implemented Angular's powerful features for state management and reactivity
- Updated the build process to use Angular CLI
- Refactored game logic to work within Angular's component lifecycle

## Git Repository

The project is now hosted on GitHub at https://github.com/mikeonline/Cloud-Team.git. The latest changes have been pushed to the 'newTake' branch.

import { Component } from '@angular/core';
import { GameStateService } from '../services/game-state.service';

@Component({
  selector: 'app-control-panel',
  template: `
    <div class="control-panel">
      <button (click)="startGame()" [disabled]="gameState.isGameActive" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2">
        Start Game
      </button>
      <button (click)="endGame()" [disabled]="!gameState.isGameActive" class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
        End Game
      </button>
    </div>
  `,
  styles: [`
    .control-panel {
      margin-top: 1rem;
    }
  `]
})
export class ControlPanelComponent {
  constructor(private gameStateService: GameStateService) {}

  get gameState() {
    return this.gameStateService.gameState$.value;
  }

  startGame() {
    this.gameStateService.startGame();
  }

  endGame() {
    this.gameStateService.endGame();
  }
}

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameStateService } from '../services/game-state.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-control-panel',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="control-panel">
      <ng-container *ngIf="gameState$ | async as gameState">
        <button (click)="startGame()" [disabled]="gameState.isGameActive" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2">
          Start Game
        </button>
        <button (click)="endGame()" [disabled]="!gameState.isGameActive" class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
          End Game
        </button>
      </ng-container>
    </div>
  `,
  styles: [`
    .control-panel {
      margin-top: 1rem;
    }
  `]
})
export class ControlPanelComponent {
  gameState$: Observable<any>;

  constructor(private gameStateService: GameStateService) {
    this.gameState$ = this.gameStateService.gameState$;
  }

  startGame() {
    this.gameStateService.startGame();
  }

  endGame() {
    this.gameStateService.endGame();
  }
}
